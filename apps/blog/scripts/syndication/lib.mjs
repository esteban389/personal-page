import { parseFrontmatter } from '@astrojs/markdown-remark';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_SITE = 'https://blog.estebanmurcia.dev';
export const DEV_API_BASE = 'https://dev.to/api';

const DEV_TAG_PATTERN = /^[a-z0-9]+$/;

export function parseArguments(argv) {
  const options = {
    slug: undefined,
    lang: 'en',
    dev: undefined,
    medium: false,
    dryRun: false,
    site: undefined,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--') {
      continue;
    }

    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }

    if (argument === '--medium') {
      options.medium = true;
      continue;
    }

    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (argument === '--lang' || argument === '--dev' || argument === '--site') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`${argument} requires a value.`);
      }

      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }

    const assignment = argument.match(/^--(lang|dev|site)=(.+)$/);
    if (assignment) {
      options[assignment[1]] = assignment[2];
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`);
    }

    if (options.slug) {
      throw new Error(`Unexpected positional argument: ${argument}`);
    }
    options.slug = argument;
  }

  if (options.help) return options;
  if (!options.slug) throw new Error('A post slug is required.');
  if (!['en', 'es'].includes(options.lang)) {
    throw new Error('--lang must be either "en" or "es".');
  }
  if (options.dev && !['draft', 'publish'].includes(options.dev)) {
    throw new Error('--dev must be either "draft" or "publish".');
  }
  if (!options.dev && !options.medium) {
    throw new Error('Choose at least one destination with --dev or --medium.');
  }

  return options;
}

export function normalizeSlug(value) {
  const slug = value.replace(/\.(?:md|mdx)$/i, '');
  const segments = slug.split('/');
  const valid =
    !path.isAbsolute(slug) &&
    !slug.includes('\\') &&
    segments.every((segment) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(segment));

  if (!valid) {
    throw new Error(`Invalid post slug: ${value}`);
  }

  return slug;
}

export async function loadPost(projectRoot, slugValue, lang) {
  const slug = normalizeSlug(slugValue);
  const localeDirectory = lang === 'es' ? 'es' : '';
  const postsRoot = path.resolve(projectRoot, 'src/content/posts', localeDirectory);
  const candidates = ['.md', '.mdx'].map((extension) =>
    path.resolve(postsRoot, `${slug}${extension}`)
  );

  for (const candidate of candidates) {
    if (!candidate.startsWith(`${postsRoot}${path.sep}`)) {
      throw new Error('The post path must stay inside the content collection.');
    }
  }

  const matches = [];
  for (const candidate of candidates) {
    try {
      matches.push({ path: candidate, source: await readFile(candidate, 'utf8') });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  if (matches.length === 0) {
    throw new Error(`No ${lang} post found for slug "${slug}".`);
  }
  if (matches.length > 1) {
    throw new Error(`Both Markdown and MDX posts exist for slug "${slug}".`);
  }

  const match = matches[0];
  if (path.extname(match.path) === '.mdx') {
    throw new Error('MDX posts are not supported by the syndication exporter yet.');
  }

  return {
    ...parsePostSource(match.source, match.path, lang),
    slug,
    path: match.path,
  };
}

export function parsePostSource(source, sourcePath = 'post.md', expectedLang = 'en') {
  let parsed;
  try {
    parsed = parseFrontmatter(source);
  } catch (error) {
    throw new Error(`Could not parse frontmatter in ${sourcePath}: ${error.message}`);
  }

  const data = parsed.frontmatter;
  const body = parsed.content.trim();

  if (!data.title || typeof data.title !== 'string') {
    throw new Error(`${sourcePath} must have a title.`);
  }
  if (!data.description || typeof data.description !== 'string') {
    throw new Error(`${sourcePath} must have a description.`);
  }
  if (!data.pubDate) {
    throw new Error(`${sourcePath} must have a pubDate.`);
  }
  if (data.lang !== expectedLang) {
    throw new Error(`${sourcePath} must explicitly set lang: '${expectedLang}'.`);
  }
  if (data.draft === true) {
    throw new Error(`${sourcePath} is a draft. Publish it on the blog before syndicating it.`);
  }
  if (!body) {
    throw new Error(`${sourcePath} has no article body.`);
  }

  validateSyndicationMetadata(data.syndication, sourcePath);
  const relativeImages = findRelativeImages(body);
  if (relativeImages.length > 0) {
    throw new Error(
      `${sourcePath} contains relative inline images that cannot be syndicated safely: ${relativeImages.join(', ')}`
    );
  }

  return { data, body };
}

export function validateSyndicationMetadata(metadata, sourcePath = 'post.md') {
  if (!metadata) return;

  if (metadata.dev) {
    const { tags } = metadata.dev;
    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 4) {
      throw new Error(`${sourcePath} must configure between one and four DEV tags.`);
    }
    const invalidTags = tags.filter((tag) => typeof tag !== 'string' || !DEV_TAG_PATTERN.test(tag));
    if (invalidTags.length > 0) {
      throw new Error(
        `${sourcePath} has invalid DEV tags: ${invalidTags.join(', ')}. Use lower-case letters and numbers.`
      );
    }
  }

  if (metadata.medium) {
    const { topics } = metadata.medium;
    if (!Array.isArray(topics) || topics.length === 0 || topics.length > 5) {
      throw new Error(`${sourcePath} must configure between one and five Medium topics.`);
    }
  }
}

export function findRelativeImages(markdown) {
  const destinations = [];
  const markdownImage = /!\[[^\]]*]\(\s*(?:<([^>]+)>|([^\s)]+))/g;
  const htmlImage = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;

  for (const match of markdown.matchAll(markdownImage)) {
    destinations.push(match[1] ?? match[2]);
  }
  for (const match of markdown.matchAll(htmlImage)) {
    destinations.push(match[1] ?? match[2] ?? match[3]);
  }

  return [...new Set(destinations.filter((destination) => !/^https?:\/\//i.test(destination)))];
}

export function buildCanonicalUrl(siteValue, slugValue, lang, baseValue = '') {
  const slug = normalizeSlug(slugValue);
  const site = new URL(siteValue);
  const base = baseValue === '/' ? '' : `/${baseValue.replace(/^\/+|\/+$/g, '')}`;
  const locale = lang === 'es' ? '/es' : '';
  site.pathname = `${base}${locale}/posts/${slug}/`.replace(/\/{2,}/g, '/');
  site.search = '';
  site.hash = '';
  return site.href;
}

export function normalizedUrl(value, base) {
  const url = new URL(value, base);
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
  return url.href;
}

function attributesFromTag(tag) {
  const attributes = new Map();
  const expression = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.matchAll(expression)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attributes;
}

export function extractCanonicalUrl(html, pageUrl) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = attributesFromTag(match[0]);
    const rel = (attributes.get('rel') ?? '').toLowerCase().split(/\s+/);
    if (rel.includes('canonical') && attributes.get('href')) {
      return new URL(attributes.get('href'), pageUrl).href;
    }
  }
  return undefined;
}

export function extractOpenGraphImage(html, pageUrl) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = attributesFromTag(match[0]);
    const property = (attributes.get('property') ?? attributes.get('name') ?? '').toLowerCase();
    if (property === 'og:image' && attributes.get('content')) {
      return new URL(attributes.get('content'), pageUrl).href;
    }
  }
  return undefined;
}

export async function verifyLiveCanonical(fetchImplementation, canonicalUrl) {
  const response = await fetchImplementation(canonicalUrl, {
    headers: { Accept: 'text/html', 'User-Agent': 'esteban-blog-syndication/1.0' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Canonical page returned HTTP ${response.status}: ${canonicalUrl}`);
  }

  const html = await response.text();
  const declaredCanonical = extractCanonicalUrl(html, canonicalUrl);
  if (!declaredCanonical) {
    throw new Error(`Canonical page does not declare a canonical link: ${canonicalUrl}`);
  }
  if (normalizedUrl(declaredCanonical) !== normalizedUrl(canonicalUrl)) {
    throw new Error(
      `Canonical mismatch. Expected ${canonicalUrl}, but the page declares ${declaredCanonical}.`
    );
  }

  return {
    canonicalUrl,
    openGraphImage: extractOpenGraphImage(html, canonicalUrl),
  };
}

async function devApiRequest(fetchImplementation, apiKey, pathname, init = {}) {
  const response = await fetchImplementation(`${DEV_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.forem.api-v1+json',
      'Content-Type': 'application/json',
      'User-Agent': 'esteban-blog-syndication/1.0',
      'api-key': apiKey,
      ...init.headers,
    },
    signal: AbortSignal.timeout(20_000),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const details = data?.error ?? data?.message ?? text.slice(0, 300) ?? 'Unknown API error';
    throw new Error(`DEV API returned HTTP ${response.status}: ${details}`);
  }

  return data;
}

export function buildDevArticle(post, canonicalUrl, mode, openGraphImage) {
  const metadata = post.data.syndication?.dev;
  if (!metadata) {
    throw new Error('This post does not configure syndication.dev metadata.');
  }

  return {
    title: post.data.title,
    description: post.data.description,
    body_markdown: post.body,
    tags: metadata.tags,
    canonical_url: canonicalUrl,
    published: mode === 'publish',
    ...(metadata.series ? { series: metadata.series } : {}),
    ...(openGraphImage ? { main_image: openGraphImage } : {}),
  };
}

function isPublishedDevArticle(article) {
  return article.published === true || Boolean(article.published_at || article.published_timestamp);
}

export async function upsertDevArticle({
  fetchImplementation,
  apiKey,
  post,
  canonicalUrl,
  mode,
  openGraphImage,
}) {
  if (!apiKey) {
    throw new Error('DEVTO_API_KEY is missing. Add it to apps/blog/.env.local.');
  }

  const articles = await devApiRequest(
    fetchImplementation,
    apiKey,
    '/articles/me/all?per_page=1000'
  );
  if (!Array.isArray(articles)) {
    throw new Error('DEV API returned an unexpected article list.');
  }

  const configuredId = post.data.syndication?.dev?.articleId;
  const matches = configuredId
    ? articles.filter((article) => article.id === configuredId)
    : articles.filter(
        (article) =>
          article.canonical_url &&
          normalizedUrl(article.canonical_url) === normalizedUrl(canonicalUrl)
      );

  if (configuredId && matches.length === 0) {
    throw new Error(`No DEV article exists with configured articleId ${configuredId}.`);
  }
  if (matches.length > 1) {
    throw new Error(
      `Multiple DEV articles use canonical URL ${canonicalUrl}. Resolve them manually.`
    );
  }

  const existing = matches[0];
  if (existing && mode === 'draft' && isPublishedDevArticle(existing)) {
    throw new Error('Refusing to change an already-published DEV article back to a draft.');
  }

  const article = buildDevArticle(post, canonicalUrl, mode, openGraphImage);
  const action = existing ? 'updated' : 'created';
  const pathname = existing ? `/articles/${existing.id}` : '/articles';
  const method = existing ? 'PUT' : 'POST';
  const result = await devApiRequest(fetchImplementation, apiKey, pathname, {
    method,
    body: JSON.stringify({ article }),
  });

  if (!result?.id || !result?.url) {
    throw new Error('DEV API write succeeded but returned an unexpected article response.');
  }
  if (result.canonical_url && normalizedUrl(result.canonical_url) !== normalizedUrl(canonicalUrl)) {
    throw new Error(`DEV returned an unexpected canonical URL: ${result.canonical_url}`);
  }

  return { action, article: result };
}

export function createDryRunSummary(post, canonicalUrl, options) {
  return {
    source: post.path,
    title: post.data.title,
    canonicalUrl,
    bodyCharacters: post.body.length,
    dev: options.dev
      ? {
          mode: options.dev,
          tags: post.data.syndication?.dev?.tags ?? [],
          articleId: post.data.syndication?.dev?.articleId,
        }
      : undefined,
    medium: options.medium ? { topics: post.data.syndication?.medium?.topics ?? [] } : undefined,
  };
}
