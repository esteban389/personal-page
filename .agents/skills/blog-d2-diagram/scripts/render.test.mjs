import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = resolve(dirname(fileURLToPath(import.meta.url)), "render.mjs");

async function fakeD2(directory, version = "0.9.0") {
  const executable = join(directory, "fake-d2.mjs");
  await writeFile(
    executable,
    `#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
if (args[0] === 'version') {
  console.log('v${version}');
} else if (args[0] === 'fmt' || args[0] === 'validate') {
  process.exit(0);
} else {
  writeFileSync(args.at(-1), '<svg data-fake="true"></svg>\\n');
}
`,
  );
  await chmod(executable, 0o755);
  return executable;
}

function run(directory, d2Binary, ...args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: directory,
    encoding: "utf8",
    env: { ...process.env, D2_BIN: d2Binary },
  });
}

test("write and check use the pinned renderer contract", async () => {
  const directory = await mkdtemp(join(tmpdir(), "blog-d2-render-"));
  const d2Binary = await fakeD2(directory);
  const source = join(directory, "flow.d2");
  const output = join(directory, "flow.svg");
  await writeFile(source, "a -> b\n");

  const writeResult = run(directory, d2Binary, "write", source, output);
  assert.equal(writeResult.status, 0, writeResult.stderr);
  assert.match(await readFile(output, "utf8"), /data-fake="true"/);

  const checkResult = run(directory, d2Binary, "check", source, output);
  assert.equal(checkResult.status, 0, checkResult.stderr);

  await writeFile(output, '<svg data-stale="true"></svg>\n');
  const staleResult = run(directory, d2Binary, "check", source, output);
  assert.equal(staleResult.status, 1);
  assert.match(staleResult.stderr, /rendered SVG is stale/);
});

test("rejects a renderer version change", async () => {
  const directory = await mkdtemp(join(tmpdir(), "blog-d2-version-"));
  const d2Binary = await fakeD2(directory, "0.9.1");
  const source = join(directory, "flow.d2");
  const output = join(directory, "flow.svg");
  await writeFile(source, "a -> b\n");

  const result = run(directory, d2Binary, "write", source, output);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /expected D2 0\.9\.0, found 0\.9\.1/);
});
