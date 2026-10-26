import { getCollection } from "astro:content";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// The index for the dmenu search (d): every page and post with its
// text, so the search can match anything on the site. Built once, fetched
// the first time the search opens.

export interface SearchEntry {
	path: string;
	title: string;
	description: string;
	tags: string[];
	text: string;
}

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

const entities: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&nbsp;": " ",
	"&copy;": "©",
};

// Markdown to plain text, roughly: enough to search in and show a snippet
function markdownToText(markdown: string) {
	return collapse(
		markdown
			.replace(/^(import|export) .*$/gm, "")
			.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
			.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
			.replace(/<[^>]+>/g, " ")
			.replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
			.replace(/```\w*/g, "")
			.replace(/[*_`~]/g, ""),
	);
}

// The text inside <main> of an .astro page, without components, expressions,
// styles and scripts
function astroToText(source: string) {
	const main = source.match(/<main>([\s\S]*)<\/main>/)?.[1] ?? "";
	let text = main.replace(/<(style|script)[\s\S]*?<\/\1>/g, " ");
	// Expressions can nest ({posts.map((post) => (<li>{post.title}</li>))}),
	// so strip the innermost ones until none are left
	while (/\{[^{}]*\}/.test(text)) text = text.replace(/\{[^{}]*\}/g, " ");
	text = text.replace(/<[^>]+>/g, " ");
	return collapse(text.replace(/&[#\w]+;/g, (entity) => entities[entity] ?? " "));
}

async function pages(): Promise<SearchEntry[]> {
	const dir = join(process.cwd(), "src/pages");
	const files = (await readdir(dir)).filter((file) => file.endsWith(".astro"));
	const found = await Promise.all(
		files.map(async (file) => {
			const source = await readFile(join(dir, file), "utf8");
			const name = file.replace(/\.astro$/, "");
			const h1 = source.match(/<h1>([^<{]+)<\/h1>/)?.[1].trim();
			return {
				path: name === "index" ? "/" : `/${name}`,
				title: h1 ?? (name === "index" ? "Home" : name[0].toUpperCase() + name.slice(1).replace(/-/g, " ")),
				description: "",
				tags: [],
				text: astroToText(source),
			};
		}),
	);
	// The post list is all expressions, so it gets no text of its own
	const blog = { path: "/blog", title: "Posts", description: "", tags: [], text: "" };
	const [home, rest] = [found.filter((page) => page.path === "/"), found.filter((page) => page.path !== "/")];
	return [...home, blog, ...rest];
}

async function posts(): Promise<SearchEntry[]> {
	return (await getCollection("blog"))
		.filter((post) => post.data.pubDate.valueOf() <= Date.now())
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map((post) => ({
			path: `/blog/${post.id}/`,
			title: post.data.title,
			description: post.data.description,
			tags: post.data.tags ?? [],
			text: markdownToText(post.body ?? ""),
		}));
}

export async function GET() {
	const index = [...(await pages()), ...(await posts())];
	return new Response(JSON.stringify(index), {
		headers: { "Content-Type": "application/json" },
	});
}
