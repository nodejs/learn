import web from '@node-core/doc-kit/src/generators/web/index.mjs';
import { join } from 'node:path';

/** @type {import('@node-core/doc-kit/src/utils/configuration/types.d.ts').Configuration} */
export default {
  global: {
    output: 'out/learn',
    input: ['pages/**/*.md'],
  },
  web: {
    title: '',
    pageURL: 'https://nodejs.org/learn{path}.html',
    editURL: 'https://github.com/nodejs/learn/edit/main/pages{path}.md',
    imports: {
      ...web.defaultConfiguration.imports,
      '#theme/Layout': join(import.meta.dirname, 'components/Layout/index.jsx'),
    },
  },
};
