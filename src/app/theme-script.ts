/**
 * Runs before first paint (inline in <head>) so the page never flashes the
 * wrong theme. Kept tiny and static: its SHA-256 hash is allowed in the CSP.
 * Stored values: "light" | "dark". No stored value means follow the system.
 */
export const THEME_STORAGE_KEY = "fph-theme";

export const themeScript = `(()=>{try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;
