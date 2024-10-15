import globals from "globals";
import pluginJs from "@eslint/js";
import tsParser from "@typescript-eslint/parser"; // Import correct du parser
import tsPlugin from "@typescript-eslint/eslint-plugin"; // Import du plugin
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"], // Extensions à vérifier
    ignores: ["node_modules"], // Ignorer node_modules
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  pluginJs.configs.recommended, // Configuration recommandée pour JS
  {
    files: ["**/*.ts"], // Règles pour TypeScript
    languageOptions: {
      parser: tsParser, // Utilisation du parser TypeScript
      parserOptions: {
        project: "./tsconfig.json", // Optionnel si tsconfig.json est utilisé
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: tsPlugin.configs.recommended.rules, // Règles recommandées TypeScript
  },
  {
    files: ["**/*.vue"], // Règles pour Vue
    languageOptions: {
      parser: tsParser, // Utilisation du parser TypeScript dans Vue
    },
    plugins: {
      vue: pluginVue,
    },
    rules: pluginVue.configs["essential"].rules, // Règles essentielles Vue
  },
  // Intégration de Prettier
  prettier,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      "prettier/prettier": "error", // Forcer l'utilisation de Prettier
    },
  },
];
