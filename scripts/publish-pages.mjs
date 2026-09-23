import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");

if (!existsSync(join(docs, "index.html"))) {
  throw new Error("docs/index.html is missing. Run the Vite build first.");
}

rmSync(join(root, "assets"), { recursive: true, force: true });
cpSync(join(docs, "index.html"), join(root, "index.html"));
cpSync(join(docs, "assets"), join(root, "assets"), { recursive: true });
if (existsSync(join(docs, "favicon.svg"))) {
  cpSync(join(docs, "favicon.svg"), join(root, "favicon.svg"));
}
if (existsSync(join(docs, ".nojekyll"))) {
  cpSync(join(docs, ".nojekyll"), join(root, ".nojekyll"));
}

console.log("Published docs/ to the repository root for GitHub Pages (source: /).");
