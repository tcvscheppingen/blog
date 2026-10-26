// The dwm layout picked with []= or t (NavBar.astro), and whether windows are
// open next to the page (Keybinds.astro), restored before the page is drawn
// so it doesn't jump. A file rather than an inline script, because
// the Content-Security-Policy only allows scripts from this site.
try {
	const layout = localStorage.getItem("layout");
	if (layout) document.documentElement.dataset.layout = layout;
} catch {}
try {
	const windows = JSON.parse(sessionStorage.getItem("windows") || "{}");
	if (windows.open && windows.open.length) {
		document.documentElement.dataset.stack = String(windows.open.length);
		document.documentElement.dataset.focus = windows.focused === "master" ? "master" : "stack";
	}
} catch {}
