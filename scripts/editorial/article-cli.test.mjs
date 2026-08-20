import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const newArticleScript = path.join(projectRoot, 'scripts/editorial/new-article.mjs');
const checkArticleScript = path.join(projectRoot, 'scripts/editorial/check-article.mjs');

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

async function createTestRepository() {
  const root = await mkdtemp(path.join(tmpdir(), 'personal-page-editorial-'));
  const templateDirectory = path.join(root, 'apps/blog/editorial/templates');
  await mkdir(templateDirectory, { recursive: true });
  await cp(path.join(projectRoot, 'apps/blog/editorial/templates'), templateDirectory, {
    recursive: true,
  });

  return root;
}

async function pathExists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

test('article:new creates a complete editorial workspace for a valid slug', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  const { stdout } = await execFileAsync(
    process.execPath,
    [newArticleScript, 'transaction-isolation', '--root', root],
    { cwd: root }
  );

  const workspace = path.join(
    root,
    'apps/blog/editorial/articles/transaction-isolation'
  );
  assert.match(stdout, /Created editorial workspace/);
  assert.equal(await pathExists(path.join(workspace, 'status.yaml')), true);

  for (const artifactName of artifactTemplates.values()) {
    assert.equal(await pathExists(path.join(workspace, artifactName)), true, artifactName);
  }

  const status = await readFile(path.join(workspace, 'status.yaml'), 'utf8');
  assert.match(status, /^schemaVersion: 1$/m);
  assert.match(status, /^slug: transaction-isolation$/m);
  assert.match(status, /^stage: brief$/m);
  assert.match(status, /^  brief: false$/m);
  assert.match(status, /^  image: false$/m);
});

test('article:new rejects slugs that are not kebab-case', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [newArticleScript, 'Not Valid', '--root', root], { cwd: root }),
    (error) => {
      assert.match(error.stderr, /lowercase kebab-case/);
      return true;
    }
  );

  assert.equal(
    await pathExists(path.join(root, 'apps/blog/editorial/articles/Not Valid')),
    false
  );
});

test('article:new never overwrites an existing workspace', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  const args = [newArticleScript, 'retry-safety', '--root', root];

  await execFileAsync(process.execPath, args, { cwd: root });
  const brief = path.join(root, 'apps/blog/editorial/articles/retry-safety/00-brief.md');
  await writeFile(brief, 'Human work that must survive.\n', 'utf8');

  await assert.rejects(execFileAsync(process.execPath, args, { cwd: root }), (error) => {
    assert.match(error.stderr, /already exists|EEXIST/);
    return true;
  });
  assert.equal(await readFile(brief, 'utf8'), 'Human work that must survive.\n');
});

test('article:new removes an incomplete workspace when a required template is missing', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await rm(path.join(root, 'apps/blog/editorial/templates/draft.md'));

  await assert.rejects(
    execFileAsync(process.execPath, [newArticleScript, 'partial-article', '--root', root], {
      cwd: root,
    })
  );

  assert.equal(
    await pathExists(path.join(root, 'apps/blog/editorial/articles/partial-article')),
    false
  );
});

test('article:check reports the stage and approvals for a complete workspace', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(
    process.execPath,
    [newArticleScript, 'transaction-isolation', '--root', root],
    { cwd: root }
  );

  const { stdout } = await execFileAsync(
    process.execPath,
    [checkArticleScript, 'transaction-isolation', '--root', root],
    { cwd: root }
  );

  assert.match(stdout, /Article: transaction-isolation/);
  assert.match(stdout, /Stage: brief/);
  assert.match(stdout, /Approvals: 0\/6/);
  assert.match(stdout, /Workspace is structurally valid/);
});

test('article:check identifies a missing required artifact', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'missing-draft', '--root', root], {
    cwd: root,
  });
  await rm(path.join(root, 'apps/blog/editorial/articles/missing-draft/06-draft.md'));

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, 'missing-draft', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /Missing required artifact: 06-draft\.md/);
      return true;
    }
  );
});

test('article:check rejects status that belongs to a different article', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'expected-slug', '--root', root], {
    cwd: root,
  });
  const statusPath = path.join(
    root,
    'apps/blog/editorial/articles/expected-slug/status.yaml'
  );
  const status = await readFile(statusPath, 'utf8');
  await writeFile(statusPath, status.replace('slug: expected-slug', 'slug: another-slug'), 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, 'expected-slug', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /Status slug "another-slug" does not match "expected-slug"/);
      return true;
    }
  );
});

test('article:check rejects an unknown editorial stage', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'unknown-stage', '--root', root], {
    cwd: root,
  });
  const statusPath = path.join(
    root,
    'apps/blog/editorial/articles/unknown-stage/status.yaml'
  );
  const status = await readFile(statusPath, 'utf8');
  await writeFile(statusPath, status.replace('stage: brief', 'stage: improvising'), 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, 'unknown-stage', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /Unknown editorial stage: improvising/);
      return true;
    }
  );
});

test('article:check requires every human approval gate', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'approval-gates', '--root', root], {
    cwd: root,
  });
  const statusPath = path.join(
    root,
    'apps/blog/editorial/articles/approval-gates/status.yaml'
  );
  const status = await readFile(statusPath, 'utf8');
  await writeFile(statusPath, status.replace('  claims: false\n', ''), 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, 'approval-gates', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /Missing or invalid approval gate: claims/);
      return true;
    }
  );
});

test('article:check rejects a slug that could escape the articles directory', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, '../editorial', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /lowercase kebab-case/);
      return true;
    }
  );
});

test('article:check rejects a stage whose human approval prerequisites are unmet', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'premature-review', '--root', root], {
    cwd: root,
  });
  const statusPath = path.join(
    root,
    'apps/blog/editorial/articles/premature-review/status.yaml'
  );
  const status = await readFile(statusPath, 'utf8');
  await writeFile(statusPath, status.replace('stage: brief', 'stage: review'), 'utf8');

  await assert.rejects(
    execFileAsync(process.execPath, [checkArticleScript, 'premature-review', '--root', root], {
      cwd: root,
    }),
    (error) => {
      assert.match(error.stderr, /Stage "review" requires approval: brief/);
      return true;
    }
  );
});

test('article:check requires image approval before publish-ready', async (t) => {
  const root = await createTestRepository();
  t.after(() => rm(root, { recursive: true, force: true }));
  await execFileAsync(process.execPath, [newArticleScript, 'missing-image-approval', '--root', root], {
    cwd: root,
  });
  const statusPath = path.join(
    root,
    'apps/blog/editorial/articles/missing-image-approval/status.yaml'
  );
  const status = await readFile(statusPath, 'utf8');
  await writeFile(
    statusPath,
    status
      .replace('stage: brief', 'stage: publish-ready')
      .replace('  brief: false', '  brief: true')
      .replace('  outline: false', '  outline: true')
      .replace('  claims: false', '  claims: true')
      .replace('  draft: false', '  draft: true')
      .replace('  review: false', '  review: true'),
    'utf8'
  );

  await assert.rejects(
    execFileAsync(
      process.execPath,
      [checkArticleScript, 'missing-image-approval', '--root', root],
      { cwd: root }
    ),
    (error) => {
      assert.match(error.stderr, /Stage "publish-ready" requires approval: image/);
      return true;
    }
  );
});
