#!/usr/bin/env node

import { constants } from "node:fs";
import { access, mkdir, readFile, rename, rm } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const EXPECTED_D2_VERSION = "0.9.0";
const ALLOWED_LAYOUTS = new Set(["elk", "dagre"]);
const d2Binary = process.env.D2_BIN || "d2";

class CliError extends Error {}

function usage(exitCode = 0) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(`Usage:
  node render.mjs write <source.d2> <output.svg> [--layout=elk|dagre]
  node render.mjs check <source.d2> <output.svg> [--layout=elk|dagre]

The helper requires D2 CLI ${EXPECTED_D2_VERSION} and renders with fixed theme,
dark-theme, padding, and SVG metadata options.
`);
  process.exit(exitCode);
}

function fail(message) {
  throw new CliError(message);
}

function run(args, options = {}) {
  const result = spawnSync(d2Binary, args, {
    encoding: options.capture ? "utf8" : undefined,
    stdio: options.capture ? "pipe" : "inherit",
    env: { ...process.env, D2_TIMEOUT: "120000" },
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      fail(
        `D2 CLI was not found at "${d2Binary}". Install D2 ${EXPECTED_D2_VERSION} and run "d2 version".`,
      );
    }
    fail(result.error.message);
  }

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stderr || result.stdout || "");
    }
    fail(`D2 command failed: ${args.join(" ")}`);
  }

  return result;
}

function verifyVersion() {
  const result = run(["version"], { capture: true });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  const match = output.match(/v?(\d+\.\d+\.\d+)/);

  if (!match) {
    fail(
      `could not parse the D2 version from: ${output.trim() || "<empty output>"}`,
    );
  }

  if (match[1] !== EXPECTED_D2_VERSION) {
    fail(
      `expected D2 ${EXPECTED_D2_VERSION}, found ${match[1]}. Review a renderer upgrade before regenerating stored SVGs.`,
    );
  }
}

async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length === 1 && ["--help", "-h"].includes(rawArgs[0])) usage();
  if (rawArgs.length < 3 || rawArgs.length > 4) usage(1);

  const [mode, sourceArg, outputArg, layoutArg] = rawArgs;
  if (!["write", "check"].includes(mode))
    fail('mode must be "write" or "check".');

  let layout = "elk";
  if (layoutArg) {
    if (!layoutArg.startsWith("--layout=")) usage(1);
    layout = layoutArg.slice("--layout=".length);
  }
  if (!ALLOWED_LAYOUTS.has(layout))
    fail(`layout must be one of: ${[...ALLOWED_LAYOUTS].join(", ")}.`);

  const source = resolve(sourceArg);
  const output = resolve(outputArg);
  if (extname(source) !== ".d2") fail("source path must end in .d2.");
  if (extname(output) !== ".svg") fail("output path must end in .svg.");
  if (source === output) fail("source and output paths must differ.");

  await access(source, constants.R_OK).catch(() =>
    fail(`source does not exist or is unreadable: ${source}`),
  );
  if (mode === "check") {
    await access(output, constants.R_OK).catch(() =>
      fail(`rendered SVG is missing: ${output}`),
    );
  } else {
    await mkdir(dirname(output), { recursive: true });
  }

  verifyVersion();
  run(["fmt", "--check", source]);
  run(["validate", source]);

  const tempOutput = resolve(
    dirname(output),
    `.${basename(output, ".svg")}.${process.pid}.d2-render.svg`,
  );

  try {
    await rm(tempOutput, { force: true });
    run([
      `--layout=${layout}`,
      "--theme=0",
      "--dark-theme=200",
      "--pad=32",
      "--omit-version",
      source,
      tempOutput,
    ]);

    const rendered = await readFile(tempOutput);
    if (!rendered.includes(Buffer.from("<svg"))) {
      fail(`D2 did not produce an SVG file: ${tempOutput}`);
    }

    if (mode === "check") {
      const current = await readFile(output);
      if (!current.equals(rendered)) {
        fail(`rendered SVG is stale: ${output}`);
      }
      process.stdout.write(
        `D2 ${EXPECTED_D2_VERSION}: SVG is current (${layout}): ${output}\n`,
      );
    } else {
      const current = await readFile(output).catch(() => null);
      if (current?.equals(rendered)) {
        process.stdout.write(
          `D2 ${EXPECTED_D2_VERSION}: SVG unchanged (${layout}): ${output}\n`,
        );
      } else {
        await rename(tempOutput, output);
        process.stdout.write(
          `D2 ${EXPECTED_D2_VERSION}: wrote SVG (${layout}): ${output}\n`,
        );
      }
    }
  } finally {
    await rm(tempOutput, { force: true });
  }
}

main().catch((error) => {
  if (error instanceof CliError) {
    process.stderr.write(`blog-d2-diagram: ${error.message}\n`);
  } else {
    process.stderr.write(`${error.stack || error}\n`);
  }
  process.exitCode = 1;
});
