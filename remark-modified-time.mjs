import { readFileSync } from 'node:fs';
import { relative } from 'node:path';

// Generated from git history by scripts/update-modified-times.mjs, because the
// host builds without access to it.
const modifiedTimes = JSON.parse(readFileSync('./src/content/modified-times.json', 'utf8'));

export function remarkModifiedTime() {
    return function (tree, file) {
        const path = relative(process.cwd(), file.history[0]);
        const lastModified = modifiedTimes[path];
        if (lastModified) file.data.astro.frontmatter.lastModified = lastModified;
    };
}
