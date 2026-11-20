import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["scripts/**", "e2e/**"],
    rules: { "no-console": "off" },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      ".content-collections/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
      ".lighthouseci/**",
      "next-env.d.ts",
    ],
  },
];

export default config;
