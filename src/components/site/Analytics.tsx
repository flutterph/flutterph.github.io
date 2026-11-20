import Script from "next/script";

/**
 * Google Analytics 4. Replaces the old Universal Analytics tag
 * (UA-121652877-4), which Google shut down in 2023 and which collects nothing.
 *
 * Off unless NEXT_PUBLIC_GA_MEASUREMENT_ID (a "G-..." ID) is set at build time,
 * and never loaded in development. Ads storage is denied; no personal data is
 * sent by the site itself.
 */
const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  if (!id || process.env.NODE_ENV !== "production" || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"granted"});gtag("js",new Date());gtag("config","${id}",{anonymize_ip:true});`}
      </Script>
    </>
  );
}
