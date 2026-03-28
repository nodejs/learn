import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import * as mdx from 'eslint-plugin-mdx';

export default defineConfig(
  { ignores: ['out'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  mdx.flatCodeBlocks,
  {
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
  },
  {
    files: ['**/*.{md,mdx}/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({ lintCodeBlocks: true }),
    rules: {
      ...mdx.flat.rules,
      'no-irregular-whitespace': 'off',
    },
  }
);
