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
const TARGET_FILE = path.resolve(
  process.cwd(),
  "apps/interests/src/data/githubProjectsInterests.ts",
);

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
  const mapped = repos.map((repo) => {
    const hasDescription = typeof repo.description === "string" && repo.description.trim().length > 0;
    const description = hasDescription
      ? repo.description
      : "Description pending. TODO: add description.";

    return {
      id: `g${repo.id}-${Math.random().toString(36).slice(2, 8)}`,
      name: repo.name,
      description,
      type: "project",
      image: repo.owner?.avatar_url || "",
      link: repo.html_url,
      tags: (Array.isArray(repo.topics) ? repo.topics.concat(repo.language) : []).filter(Boolean),
    };
  });
  console.log(`Mapped ${mapped.length} interests.`);
  return mapped;
}

function readExistingFile() {
  console.log(`Reading existing file: ${TARGET_FILE}...`);
  if (!fs.existsSync(TARGET_FILE)) {
    console.log("Target file does not exist, will create it.");
    return { content: null, existingLinks: new Set() };
  }

  const content = fs.readFileSync(TARGET_FILE, "utf8");
  const existingLinks = new Set();

  // Extract links from the existing file using regex
  // Looking for link: "https://github.com/..." patterns
  const linkRegex = /link:\s*["'](https:\/\/github\.com\/[^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    // Normalize link (remove query params and fragments)
    const normalizedLink = match[1].split("?")[0].split("#")[0];
    existingLinks.add(normalizedLink);
  }

  console.log(`Found ${existingLinks.size} existing projects in file.`);
  return { content, existingLinks };
}

function formatInterestEntry(interest, isLast = false) {
  const indent = "    ";
  const propIndent = "        ";
  const comma = isLast ? "" : ",";
  
  let entry = `${indent}{\n`;
  entry += `${propIndent}id: ${JSON.stringify(interest.id)},\n`;
  
  if (interest.name) {
    entry += `${propIndent}name: ${JSON.stringify(interest.name)},\n`;
  }
  
  if (interest.description) {
    entry += `${propIndent}description: ${JSON.stringify(interest.description)},\n`;
  }
  
  if (interest.image) {
    entry += `${propIndent}image: ${JSON.stringify(interest.image)},\n`;
  }
  
  entry += `${propIndent}link: ${JSON.stringify(interest.link)},\n`;
  
  if (interest.tags && interest.tags.length > 0) {
    const tagsStr = interest.tags.map(t => JSON.stringify(t)).join(", ");
    entry += `${propIndent}tags: [${tagsStr}],\n`;
  }
  
  if (interest.isCurrent !== undefined) {
    entry += `${propIndent}isCurrent: ${interest.isCurrent},\n`;
  }
  
  entry += `${indent}}${comma}\n`;
  return entry;
}

function writeToTypeScriptFile(existingContent, newInterests) {
  console.log(`Writing ${newInterests.length} new interests to TypeScript file...`);
  
  if (!existingContent) {
    // Create new file
    let content = 'import type { Interest } from "./interests";\n\n';
    content += 'const baseGithubProjectsInterests: Omit<Interest, "type">[] = [\n';
    
    newInterests.forEach((interest, index) => {
      content += formatInterestEntry(interest, index === newInterests.length - 1);
    });
    
    content += ']\n\n';
    content += 'export const githubProjectsInterests: Interest[] = baseGithubProjectsInterests.map(interest => ({\n';
    content += '    ...interest,\n';
    content += '    type: "project",\n';
    content += '}))\n';
    
    fs.writeFileSync(TARGET_FILE, content, "utf8");
    console.log(`Created new file with ${newInterests.length} interests.`);
    return;
  }

  // Find the insertion point (before the closing bracket of the array, before the export)
  // Look for the pattern: ]\n\nexport const githubProjectsInterests
  const arrayEndPattern = /(\]\s*\n\s*export const githubProjectsInterests)/;
  const match = existingContent.match(arrayEndPattern);
  
  if (!match) {
    throw new Error("Could not find array end pattern in existing file. File structure may have changed.");
  }

  const beforeArrayEnd = existingContent.substring(0, match.index);
  const afterArrayEnd = existingContent.substring(match.index);

  // Check if we need a comma before the new entries
  // Look at the last character before the closing bracket
  const lastCharBeforeBracket = beforeArrayEnd.trimEnd().slice(-1);
  const needsComma = lastCharBeforeBracket !== "," && lastCharBeforeBracket !== "[";

  // Format new entries
  let newEntries = "";
  if (needsComma && beforeArrayEnd.trim().length > 0) {
    newEntries += ",\n";
  }
  newInterests.forEach((interest, index) => {
    const isLast = index === newInterests.length - 1;
    newEntries += formatInterestEntry(interest, isLast);
  });

  // Insert new entries before the closing bracket
  const updatedContent = beforeArrayEnd + newEntries + afterArrayEnd;
  
  fs.writeFileSync(TARGET_FILE, updatedContent, "utf8");
  console.log(`Appended ${newInterests.length} new interests to file.`);
}

async function main() {
  try {
    const token = ensureEnv();
    const repos = await fetchStarredRepos(token);
    const allInterests = mapToInterests(repos);

    // Read existing file and extract existing links
    const { content: existingContent, existingLinks } = readExistingFile();

    // Filter out projects that already exist
    const newInterests = allInterests.filter((interest) => {
      // Normalize the link (remove query params, fragments, etc.)
      const normalizedLink = interest.link.split("?")[0].split("#")[0];
      return !existingLinks.has(normalizedLink);
    });

    console.log(
      `Filtered: ${allInterests.length} total, ${existingLinks.size} existing, ${newInterests.length} new`,
    );

    if (newInterests.length === 0) {
      console.log("No new projects to add. Done.");
      return;
    }

    writeToTypeScriptFile(existingContent, newInterests);
    console.log("Done.");
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
