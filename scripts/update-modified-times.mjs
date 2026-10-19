// Records when each blog post was last modified, based on git history.
// The host builds without git history, so the result is committed to the repo
// and read by remark-modified-time.mjs at build time.
// Runs from the pre-commit hook in .githooks/; posts staged in the commit being
// made get the current time.
import { execFileSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';

const BLOG_DIR = 'src/content/blog';
const OUTPUT = 'src/content/modified-times.json';

function git(args) {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

const staged = new Set(git(['diff', '--cached', '--name-only', '--', BLOG_DIR]).split('\n'));
const now = new Date().toISOString();

const modifiedTimes = {};
for (const name of readdirSync(BLOG_DIR, { recursive: true }).sort()) {
    if (!/\.mdx?$/.test(name)) continue;
    const path = `${BLOG_DIR}/${name}`;
    const lastCommit = git(['log', '-1', '--format=%aI', '--', path]);
    const date = staged.has(path) ? now : lastCommit;
    if (date) modifiedTimes[path] = date;
}

writeFileSync(OUTPUT, JSON.stringify(modifiedTimes, null, '\t') + '\n');
