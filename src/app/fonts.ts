import localFont from "next/font/local";

/**
 * Google Sans and Google Sans Code, open-sourced by Google under the SIL Open
 * Font License 1.1 and self-hosted from @fontsource (Latin subset, includes
 * ñ and Ñ). One 36 KB variable file covers every heading and body weight.
 */
export const googleSans = localFont({
  src: "../../node_modules/@fontsource-variable/google-sans/files/google-sans-latin-wght-normal.woff2",
  variable: "--font-google-sans",
  weight: "400 700",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export const googleSansCode = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/google-sans-code/files/google-sans-code-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/google-sans-code/files/google-sans-code-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-google-sans-code",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});
