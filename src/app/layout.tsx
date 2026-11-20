import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { googleSans, googleSansCode } from "./fonts";
import { themeScript } from "./theme-script";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ebf0" },
    { media: "(prefers-color-scheme: dark)", color: "#e8ebf0" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-PH"
      className={`${googleSans.variable} ${googleSansCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme before paint. suppressHydrationWarning covers only this attribute. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-pill bg-ink px-5 py-3 text-on-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <SmoothScroll />
      </body>
    </html>
  );
}
