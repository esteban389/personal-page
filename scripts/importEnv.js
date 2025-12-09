#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Load .env manually (zero dependencies)
function importEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  const envFile = fs.readFileSync(envPath, "utf8");

  envFile.split("\n").forEach(line => {
    if (!line || line.startsWith("#")) return;
    const [key, value] = line.split("=");
    process.env[key] = value;
  });
}

export default importEnv;