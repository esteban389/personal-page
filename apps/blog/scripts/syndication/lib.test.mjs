import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCanonicalUrl,
  buildDevArticle,
  findRelativeImages,
  parseArguments,
  parsePostSource,
  upsertDevArticle,
  verifyLiveCanonical,
} from './lib.mjs';

const source = `---
title: Test post
description: A test description
pubDate: '2026-08-19'
lang: en
syndication:
  dev:
    tags: [astro, blogging]
  medium:
    topics: [Astro, Blogging]
---

This is the body.
`;

function postFromSource() {
  return {
    ...parsePostSource(source),
    slug: 'test-post',
    path: '/content/test-post.md',
  };
}

function jsonResponse(value, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('parses an explicit DEV and Medium command', () => {
  assert.deepEqual(
    parseArguments(['--', 'test-post', '--lang', 'es', '--dev=publish', '--medium', '--dry-run']),
    {
      slug: 'test-post',
      lang: 'es',
      dev: 'publish',
      medium: true,
      dryRun: true,
      site: undefined,
      help: false,
    }
  );
});

test('requires at least one destination', () => {
  assert.throws(() => parseArguments(['test-post']), /Choose at least one destination/);
});

test('builds locale-aware canonical URLs', () => {
  assert.equal(
    buildCanonicalUrl('https://blog.example.com', 'test-post', 'en'),
    'https://blog.example.com/posts/test-post/'
  );
  assert.equal(
    buildCanonicalUrl('https://blog.example.com', 'post-de-prueba', 'es'),
    'https://blog.example.com/es/posts/post-de-prueba/'
  );
});

test('identifies relative Markdown and HTML images', () => {
  const markdown = [
    '![local](../assets/local.webp)',
    '<img src="/images/root.png" alt="Root image">',
    '![remote](https://images.example.com/remote.png)',
  ].join('\n');

  assert.deepEqual(findRelativeImages(markdown), ['../assets/local.webp', '/images/root.png']);
});

test('verifies a self-referencing canonical page and reads its Open Graph image', async () => {
  const canonical = 'https://blog.example.com/posts/test-post/';
  const result = await verifyLiveCanonical(
    async () =>
      new Response(`
        <link href="${canonical}" rel="canonical">
        <meta content="/social/test.webp" property="og:image">
      `),
    canonical
  );

  assert.deepEqual(result, {
    canonicalUrl: canonical,
    openGraphImage: 'https://blog.example.com/social/test.webp',
  });
});

test('builds the DEV payload from post metadata', () => {
  const article = buildDevArticle(
    postFromSource(),
    'https://blog.example.com/posts/test-post/',
    'publish',
    'https://blog.example.com/social/test.webp'
  );

  assert.equal(article.published, true);
  assert.equal(article.canonical_url, 'https://blog.example.com/posts/test-post/');
  assert.deepEqual(article.tags, ['astro', 'blogging']);
  assert.equal(article.main_image, 'https://blog.example.com/social/test.webp');
});

test('creates a DEV article when no canonical match exists', async () => {
  const calls = [];
  const canonical = 'https://blog.example.com/posts/test-post/';
  const fetchImplementation = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.endsWith('/articles/me/all?per_page=1000')) return jsonResponse([]);
    return jsonResponse({
      id: 42,
      url: 'https://dev.to/example/test-post',
      canonical_url: canonical,
    });
  };

  const result = await upsertDevArticle({
    fetchImplementation,
    apiKey: 'not-a-real-key',
    post: postFromSource(),
    canonicalUrl: canonical,
    mode: 'publish',
  });

  assert.equal(result.action, 'created');
  assert.equal(calls[1].url, 'https://dev.to/api/articles');
  assert.equal(calls[1].init.method, 'POST');
  assert.equal(JSON.parse(calls[1].init.body).article.published, true);
});

test('updates the article matched by canonical URL', async () => {
  const calls = [];
  const canonical = 'https://blog.example.com/posts/test-post/';
  const fetchImplementation = async (url, init = {}) => {
    calls.push({ url, init });
    if (url.endsWith('/articles/me/all?per_page=1000')) {
      return jsonResponse([{ id: 73, canonical_url: canonical, published: false }]);
    }
    return jsonResponse({
      id: 73,
      url: 'https://dev.to/example/test-post',
      canonical_url: canonical,
    });
  };

  const result = await upsertDevArticle({
    fetchImplementation,
    apiKey: 'not-a-real-key',
    post: postFromSource(),
    canonicalUrl: canonical,
    mode: 'publish',
  });

  assert.equal(result.action, 'updated');
  assert.equal(calls[1].url, 'https://dev.to/api/articles/73');
  assert.equal(calls[1].init.method, 'PUT');
});

test('does not unpublish an existing DEV article', async () => {
  const canonical = 'https://blog.example.com/posts/test-post/';
  const fetchImplementation = async () =>
    jsonResponse([{ id: 73, canonical_url: canonical, published: true }]);

  await assert.rejects(
    upsertDevArticle({
      fetchImplementation,
      apiKey: 'not-a-real-key',
      post: postFromSource(),
      canonicalUrl: canonical,
      mode: 'draft',
    }),
    /Refusing to change an already-published DEV article back to a draft/
  );
});
