/**
 * Runs before first paint so the page never flashes the wrong theme.
 * Light is the default; dark applies only when the visitor chose it.
 * Kept static so its SHA-256 hash can be allowed in the CSP.
 */
export const THEME_STORAGE_KEY = "fph-theme";

export const themeScript = `(()=>{try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}})()`;
