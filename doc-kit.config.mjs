import { join } from 'node:path';

const origin =
  process.env.VERCEL_ENV === 'preview' ? process.env.VERCEL_URL : 'nodejs.org';

/** @type {import('@doc-kit/core/utils/configuration/types.d.ts').Configuration} */
export default {
  target: ['html', 'orama-db', 'sitemap'],
  global: {
    output: 'out/learn',
    input: ['pages/**/*.md'],
    baseURL: `https://${origin}/learn`,
  },
  html: {
    // Important Configuration
    project: 'Node.js',
    title: '{project} Learn',
    pageURL: '{baseURL}{path}.html',
    editURL: 'https://github.com/nodejs/learn/edit/main/pages{path}.md',
    useAbsoluteURLs: true,
    templatePath: join(import.meta.dirname, 'template.html'),
    generateAllPage: false,

    // Imports
    imports: {
      '#theme/Layout': join(import.meta.dirname, 'components/Layout/index.jsx'),
    },
  },
  sitemap: {
    indexURL: '{baseURL}',
    pageURL: '{baseURL}{path}',
  },
};
