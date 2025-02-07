import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "public/",
      "*.config.js" // Ignore Webpack, ESLint, and Babel config files
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      "semi": ["warn", "always"],
      "quotes": ["warn", "double", {"avoidEscape": true}],
      "no-var": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "prefer-const": "error",
      "@/block-scoped-var": "error",
      "eqeqeq": "error",
      "eol-last": "warn",
      "prefer-arrow-callback": "error",
      "no-restricted-properties": [
        "error",
        {
          "object": "describe",
          "property": "only"
        },
        {
          "object": "it",
          "property": "only"
        }
      ],
    },
    }
];

export default eslintConfig;
