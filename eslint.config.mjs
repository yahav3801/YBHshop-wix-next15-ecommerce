import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import query from "@tanstack/eslint-plugin-query"; // Import the plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      "@tanstack/query": query,
    },
    rules: {
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/prefer-query-object": "error",
    },
  },
];

export default eslintConfig;
