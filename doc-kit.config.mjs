import web from '@node-core/doc-kit/src/generators/web/index.mjs';
import { join } from 'node:path';

const origin =
  process.env.VERCEL_ENV === 'preview' ? process.env.VERCEL_URL : 'nodejs.org';

/** @type {import('@node-core/doc-kit/src/utils/configuration/types.d.ts').Configuration} */
export default {
  global: {
    output: 'out/learn',
    input: ['pages/**/*.md'],
  },
  web: {
    // Important Configuration
    project: 'Node.js',
    title: '{project} Learn',
    baseURL: `https://${origin}/learn`,
    pageURL: '{baseURL}{path}.html',
    editURL: 'https://github.com/nodejs/learn/edit/main/pages{path}.md',
    useAbsoluteURLs: true,
    templatePath: join(import.meta.dirname, 'template.html'),

    // Imports
    imports: {
      ...web.defaultConfiguration.imports,
      '#theme/Layout': join(import.meta.dirname, 'components/Layout/index.jsx'),
    },
  },
};
