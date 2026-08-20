#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  buildCanonicalUrl,
  createDryRunSummary,
  DEFAULT_SITE,
  loadPost,
  parseArguments,
  upsertDevArticle,
  verifyLiveCanonical,
} from './lib.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function printUsage() {
  console.log(`Usage:
  pnpm syndicate -- <slug> [--lang en|es] [--dev draft|publish] [--medium] [--dry-run]

Examples:
  pnpm syndicate -- my-post --dev publish --medium --dry-run
  pnpm syndicate -- my-post --dev publish --medium
  pnpm syndicate -- mi-post --lang es --dev draft`);
}

function requireDestinationMetadata(post, options) {
  if (options.dev && !post.data.syndication?.dev) {
    throw new Error('The post needs syndication.dev metadata before using --dev.');
  }
  if (options.medium && !post.data.syndication?.medium) {
    throw new Error('The post needs syndication.medium metadata before using --medium.');
  }
}

function printMediumHandoff(post, canonicalUrl) {
  const topics = post.data.syndication.medium.topics;
  console.log('\nMedium handoff (manual, supported import flow)');
  console.log(`1. Open https://medium.com/p/import`);
  console.log(`2. Import ${canonicalUrl}`);
  console.log('3. Review formatting, links, code blocks, and the featured image.');
  console.log(`4. Add topics: ${topics.join(', ')}`);
  console.log('5. Confirm the canonical link in story settings, preview, and publish.');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  const post = await loadPost(projectRoot, options.slug, options.lang);
  requireDestinationMetadata(post, options);
  const canonicalUrl = buildCanonicalUrl(
    options.site ?? process.env.ASTRO_SITE_URL ?? DEFAULT_SITE,
    post.slug,
    options.lang,
    process.env.ASTRO_SITE_BASE
  );

  if (options.dryRun) {
    console.log(JSON.stringify(createDryRunSummary(post, canonicalUrl, options), null, 2));
    return;
  }

  console.log(`Verifying ${canonicalUrl}`);
  const livePage = await verifyLiveCanonical(fetch, canonicalUrl);
  console.log('Canonical page is live and self-referencing.');

  if (options.dev) {
    const result = await upsertDevArticle({
      fetchImplementation: fetch,
      apiKey: process.env.DEVTO_API_KEY,
      post,
      canonicalUrl,
      mode: options.dev,
      openGraphImage: livePage.openGraphImage,
    });
    console.log(`DEV article ${result.action}: ${result.article.url}`);
    console.log(`DEV state: ${options.dev === 'publish' ? 'published' : 'draft'}`);
  }

  if (options.medium) {
    printMediumHandoff(post, canonicalUrl);
  }
}

main().catch((error) => {
  console.error(`Syndication failed: ${error.message}`);
  process.exitCode = 1;
});
