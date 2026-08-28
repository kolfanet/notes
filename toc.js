import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesDir = path.join(__dirname, "notes");
const outputFile = path.join(__dirname, "README.md");

function formatTitle(name) {
  return name
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function scanDir(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = {};

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result[entry.name] = scanDir(fullPath, baseDir);
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

      if (!result._files) result._files = [];

      result._files.push({
        title: formatTitle(entry.name),
        path: `notes/${relativePath}`,
      });
    }
  }

  return result;
}

function renderSection(tree, depth = 2) {
  let content = "";

  if (tree._files) {
    for (const file of tree._files.sort((a, b) => a.title.localeCompare(b.title))) {
      content += `- [${file.title}](${file.path})\n`;
    }

    content += "\n";
  }

  for (const key of Object.keys(tree).filter(key => key !== "_files").sort()) {
    const heading = "#".repeat(depth);

    content += `${heading} ${formatTitle(key)}\n\n`;
    content += renderSection(tree[key], depth + 1);
  }

  return content;
}

function generateReadme() {
  const tree = scanDir(notesDir);

  const content = `# My Notes

This repository contains my personal notes.

## Table of Contents

${renderSection(tree)}`;

  fs.writeFileSync(outputFile, content);
  console.log("README.md generated!");
}

generateReadme();