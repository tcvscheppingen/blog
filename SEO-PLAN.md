# SEO Plan

Plan to make the site easier to find. Checkboxes track progress — update this file as steps are completed.

## 1. Register a domain

Currently hosted at `https://thymenvscheppingen.statichost.page/` — a subdomain of statichost.eu. A custom domain you own is the single biggest lever for trust and discoverability (search engines weight it more, and it's easier for people to remember/share).

**Suggestions:**

| Domain | Notes |
|---|---|
| `thymen.dev` | Short, memorable, `.dev` signals "developer" and forces HTTPS by default. Likely the strongest pick if available. |
| `thymenvanscheppingen.nl` | Full name, `.nl` fits a Dutch personal site, good if `thymen.dev` is taken. |
| `tvanscheppingen.dev` | Fallback if `thymen.dev` is unavailable. |
| `thymenvs.dev` | Short alternative using initials. |

**Steps:**
- [x] Check availability (e.g. via Porkbun, Namecheap, or a Dutch registrar like TransIP for `.nl`)
- [ ] Register the domain (~€10-15/yr for `.dev`, similar for `.nl`)
- [ ] Point DNS at statichost.eu (check their docs for the required CNAME/A records) or configure the custom domain in the statichost.eu dashboard
- [ ] Update `site` in `astro.config.mjs` to the new domain
- [ ] Update `public/robots.txt` sitemap URL to match
- [ ] Rebuild and redeploy
- [ ] Verify `og:image`, canonical URLs, and RSS feed all resolve to the new domain

## 2. Register with Google & Bing

### Google Search Console
- [ ] Go to [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Add property as **URL prefix** (or **Domain** once a custom domain with DNS access exists)
- [ ] Verify via HTML file upload (drop the file Google gives you into `public/`, redeploy) or DNS record if using domain verification
- [ ] Submit sitemap: `sitemap-index.xml`
- [ ] Use URL Inspection → "Request indexing" on the homepage and a few posts

### Bing Webmaster Tools
- [ ] Go to [bing.com/webmasters](https://www.bing.com/webmasters)
- [ ] Use "Import from Google Search Console" to skip separate verification, or verify manually
- [ ] Confirm the sitemap imported/submitted correctly

*(Redo verification if the domain changes per step 1.)*

## 3. Other SEO improvements

Already done:
- [x] Sitemap generated via `@astrojs/sitemap`
- [x] `robots.txt` referencing the sitemap
- [x] Per-post `og:image`/`twitter:image` wired to `heroImage`
- [x] Specific `SITE_TITLE`/`SITE_DESCRIPTION` (was generic placeholder text)
- [x] JSON-LD structured data (`Person` on homepage, `BlogPosting` per post)

Remaining ideas, roughly in priority order:

- [ ] **Per-page `<title>` branding** — post titles currently render as just the post title; suffixing with `| Thymen van Scheppingen` (in `BaseHead.astro`) reinforces brand recognition in search results and browser tabs.
- [ ] **`og:type` for posts** — `BaseHead.astro` always sets `og:type` to `"website"`; blog posts should use `"article"` (with `article:published_time`) for richer social previews.
- [ ] **Backlinks / distribution** — for a personal blog, sharing new posts on Hacker News, Lobsters, relevant subreddits, or Mastodon/Bluesky tends to move rankings more than on-page tweaks alone.
- [ ] **Internal linking** — link related posts to each other where relevant (e.g. the privacy/security-themed posts); helps both crawlers and readers discover more content.
- [ ] **Alt text audit** — confirm all images (hero images especially) have descriptive `alt` text, not just decorative empty strings, where the image conveys meaning.
- [ ] **Page load performance** — run the site through Lighthouse/PageSpeed Insights once on a custom domain; Core Web Vitals are a (minor) ranking factor and static Astro sites usually score well already.
- [ ] **Consistent asset paths** — `what-window-managers-taught-me-about-screen-addiction.mdx` references a hero image outside `src/assets/hero-images/` (`../../assets/dwm-screenshot.png`); not an SEO issue but worth tidying for consistency.
