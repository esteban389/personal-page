#!/usr/bin/env node
/**
 * Fetch the current user's starred GitHub repositories and save them as
 * @esteban/interests compatible "project" interests.
 *
 * Requirements:
 * - A `.env` file at the repo root containing GITHUB_TOKEN=xxxx
 * - Node 18+ (built-in fetch). No extra deps.
 *
 * Usage:
 *   pnpm starred-github-projects
 *   node scripts/getGithubStarredProjects.js
 */

import fs from "fs";
import path from "path";
import importEnv from "./importEnv.js";

const GITHUB_API = "https://api.github.com";
const PER_PAGE = 100;
const OUTPUT_FILE = path.resolve(process.cwd(), "starred-projects.json");

function ensureEnv() {
  console.log("Loading environment variables...");
  importEnv();
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required in .env");
  }
  console.log("GITHUB_TOKEN loaded.");
  return token;
}

async function fetchStarredRepos(token) {
  let page = 1;
  const results = [];

  while (true) {
    const url = `${GITHUB_API}/user/starred?per_page=${PER_PAGE}&page=${page}`;
    console.log(`Fetching page ${page}...`);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "personal-page-starred-script",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `GitHub API error (${res.status} ${res.statusText}): ${body}`,
      );
    }

    const data = await res.json();
    console.log(`Fetched ${data.length} repos on page ${page}.`);

    if (!Array.isArray(data) || data.length === 0) break;

    results.push(...data);

    if (data.length < PER_PAGE) break;
    page += 1;
  }

  console.log(`Total starred repos fetched: ${results.length}`);
  return results;
}

function mapToInterests(repos) {
  console.log("Mapping GitHub repos to interests format...");
  const mapped = repos.map((repo) => ({
    id: `g${repo.id}-${Math.random().toString(36).slice(2, 8)}`,
    name: repo.name,
    description: repo.description || "",
    type: "project",
    image: repo.owner?.avatar_url || "",
    link: repo.html_url,
    tags: (Array.isArray(repo.topics) ? repo.topics.concat(repo.language) : []).filter(Boolean),
  }));
  console.log(`Mapped ${mapped.length} interests.`);
  return mapped;
}

async function main() {
  try {
    const token = ensureEnv();
    const repos = await fetchStarredRepos(token);
    const interests = mapToInterests(repos);

    console.log(`Writing ${interests.length} interests to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(interests, null, 2), "utf8");
    console.log("Done.");
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
