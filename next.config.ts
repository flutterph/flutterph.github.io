import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";
import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * flutter.ph is hosted on GitHub Pages, so the site is exported as static
 * files (`out/`). That means no server: no ISR, no runtime redirects and no
 * response headers. See docs/hosting.md for how each of those is handled.
 */
const nextConfig: NextConfig = {
  output: "export",
  // `/events` is written to `out/events.html`, which GitHub Pages serves at
  // both `/events` and `/events.html`. Legacy URLs like `/join.html` keep working.
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    // next-image-export-optimizer generates responsive WebP files at build time.
    loader: "custom",
    imageSizes: [64, 128, 256, 384],
    deviceSizes: [360, 640, 768, 1080, 1280, 1920],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_exportFolderName: "_optimized",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImagesFilename: "remoteOptimizedImages.js",
  },
};

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

export default withContentCollections(withBundleAnalyzer(nextConfig));
