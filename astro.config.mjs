// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { unified } from '@astrojs/markdown-remark';
import { remarkReadingTime } from './remark-reading-time.mjs';
import { readFile, appendFile } from 'node:fs/promises';

function cspHeader() {
  return {
    name: 'csp-header',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const html = await readFile(new URL('index.html', dir), 'utf8');
        const match = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)">/);
        if (!match) throw new Error('csp-header: no CSP meta tag found in index.html');
        await appendFile(new URL('_headers', dir), `    Content-Security-Policy: ${match[1]}\n`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://thymenvscheppingen.statichost.page",
  integrations: [mdx(), sitemap(), cspHeader()],
  prefetch: {
    defaultStrategy: 'load'
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime]
    }),
    syntaxHighlight: "prism",
  },
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "object-src 'none'",
        "img-src 'self' https://i.ytimg.com",
        "frame-src https://www.youtube-nocookie.com",
        "connect-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
      ],
    },
  },
  build: {
    inlineStylesheets: "never",
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Atkinson",
      cssVariable: "--font-atkinson",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/atkinson-regular.woff"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/atkinson-bold.woff"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],
});
