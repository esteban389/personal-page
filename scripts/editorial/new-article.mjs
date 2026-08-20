#!/usr/bin/env node

import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const artifactTemplates = new Map([
  ['brief.md', '00-brief.md'],
  ['raw-notes.md', '01-raw-notes.md'],
  ['outline.md', '02-outline.md'],
  ['objections.md', '03-objections.md'],
  ['claim-register.md', '04-claims.md'],
  ['seeds.md', '05-seeds.md'],
  ['draft.md', '06-draft.md'],
  ['image-brief.md', '07-image-brief.md'],
  ['review.md', '08-review.md'],
  ['publish-checklist.md', '09-publish-checklist.md'],
]);

function readArguments(args) {
  const slug = args[0];
  const rootFlagIndex = args.indexOf('--root');
  const root = rootFlagIndex === -1 ? process.cwd() : args[rootFlagIndex + 1];

  if (!slug || !root) {
    throw new Error('Usage: pnpm article:new <slug> [--root <repository-path>]');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('The article slug must use lowercase kebab-case (for example: retry-safety).');
  }

  return { slug, root: path.resolve(root) };
}

function createStatus(slug) {
  return `schemaVersion: 1
slug: ${slug}
workingTitle: ''
language: en
stage: brief
articleType: ''

approved:
  brief: false
  outline: false
  claims: false
  draft: false
  image: false
  review: false

publish:
  category: ''
  heroImage: null
  pubDate: null
`;
}

async function main() {
  const { slug, root } = readArguments(process.argv.slice(2));
  const editorialRoot = path.join(root, 'apps/blog/editorial');
  const templateDirectory = path.join(editorialRoot, 'templates');
  const articlesDirectory = path.join(editorialRoot, 'articles');
  const workspace = path.join(articlesDirectory, slug);

  await mkdir(articlesDirectory, { recursive: true });
  let workspaceCreated = false;
  try {
    await mkdir(workspace);
    workspaceCreated = true;
    await writeFile(path.join(workspace, 'status.yaml'), createStatus(slug), 'utf8');

    for (const [templateName, artifactName] of artifactTemplates) {
      await copyFile(
        path.join(templateDirectory, templateName),
        path.join(workspace, artifactName)
      );
    }
  } catch (error) {
    if (workspaceCreated) await rm(workspace, { recursive: true, force: true });
    throw error;
  }

  console.log(`Created editorial workspace: ${path.relative(root, workspace)}`);
  console.log(`Next: complete ${path.relative(root, path.join(workspace, '00-brief.md'))}`);
}

main().catch((error) => {
  console.error(`article:new failed: ${error.message}`);
  process.exitCode = 1;
});
