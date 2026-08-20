#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const requiredArtifacts = [
  'status.yaml',
  '00-brief.md',
  '01-raw-notes.md',
  '02-outline.md',
  '03-objections.md',
  '04-claims.md',
  '05-seeds.md',
  '06-draft.md',
  '07-image-brief.md',
  '08-review.md',
  '09-publish-checklist.md',
];
const allowedStages = new Set([
  'brief',
  'ingestion',
  'outline',
  'evidence',
  'seeds',
  'drafting',
  'editing',
  'image',
  'review',
  'publish-ready',
  'published',
]);
const approvalGates = ['brief', 'outline', 'claims', 'draft', 'image', 'review'];
const stageApprovalRequirements = {
  outline: ['brief'],
  evidence: ['brief', 'outline'],
  seeds: ['brief', 'outline', 'claims'],
  drafting: ['brief', 'outline', 'claims'],
  editing: ['brief', 'outline', 'claims'],
  image: ['brief', 'outline'],
  review: ['brief', 'outline', 'claims', 'draft'],
  'publish-ready': approvalGates,
  published: approvalGates,
};

function readArguments(args) {
  const slug = args[0];
  const rootFlagIndex = args.indexOf('--root');
  const root = rootFlagIndex === -1 ? process.cwd() : args[rootFlagIndex + 1];

  if (!slug || !root) {
    throw new Error('Usage: pnpm article:check <slug> [--root <repository-path>]');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('The article slug must use lowercase kebab-case (for example: retry-safety).');
  }

  return { slug, root: path.resolve(root) };
}

function readScalar(source, key) {
  return source.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}

function readApprovals(source) {
  const block = source.match(/^approved:\n((?: {2}.+\n?)*)/m)?.[1] ?? '';
  const values = new Map(
    [...block.matchAll(/^ {2}([a-zA-Z]+):\s*(true|false)$/gm)].map((match) => [
      match[1],
      match[2] === 'true',
    ])
  );

  for (const gate of approvalGates) {
    if (!values.has(gate)) throw new Error(`Missing or invalid approval gate: ${gate}`);
  }

  return {
    approved: approvalGates.filter((gate) => values.get(gate)).length,
    total: approvalGates.length,
    values,
  };
}

async function main() {
  const { slug, root } = readArguments(process.argv.slice(2));
  const workspace = path.join(root, 'apps/blog/editorial/articles', slug);

  for (const artifact of requiredArtifacts) {
    try {
      await access(path.join(workspace, artifact));
    } catch {
      throw new Error(`Missing required artifact: ${artifact}`);
    }
  }

  const status = await readFile(path.join(workspace, 'status.yaml'), 'utf8');
  const statusSlug = readScalar(status, 'slug');
  if (statusSlug !== slug) {
    throw new Error(`Status slug "${statusSlug}" does not match "${slug}".`);
  }
  const stage = readScalar(status, 'stage');
  if (!allowedStages.has(stage)) {
    throw new Error(`Unknown editorial stage: ${stage}`);
  }
  const approvals = readApprovals(status);
  for (const gate of stageApprovalRequirements[stage] ?? []) {
    if (!approvals.values.get(gate)) {
      throw new Error(`Stage "${stage}" requires approval: ${gate}`);
    }
  }

  console.log(`Article: ${slug}`);
  console.log(`Stage: ${stage}`);
  console.log(`Approvals: ${approvals.approved}/${approvals.total}`);
  console.log('Workspace is structurally valid.');
}

main().catch((error) => {
  console.error(`article:check failed: ${error.message}`);
  process.exitCode = 1;
});
