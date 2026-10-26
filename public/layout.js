// The dwm layout picked with []= or t (NavBar.astro), restored before the page
// is drawn so it doesn't jump. A file rather than an inline script, because
// the Content-Security-Policy only allows scripts from this site.
try {
	const layout = localStorage.getItem("layout");
	if (layout) document.documentElement.dataset.layout = layout;
} catch {}
