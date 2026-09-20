import { join } from 'node:path';

const origin =
  process.env.VERCEL_ENV === 'preview' ? process.env.VERCEL_URL : 'nodejs.org';

/** @type {import('@doc-kit/core/utils/configuration/types.d.ts').Configuration} */
export default {
  extends: '@node-core/doc-kit/config',

  target: ['html', 'orama-db', 'sitemap'],
  global: {
    output: 'out/learn',
    input: ['pages/**/*.md'],
    baseURL: `https://${origin}/learn`,

    // The preset documents the runtime itself, so it points these at
    // nodejs/node. Learn is its own repository, and it has no use for the
    // release history — leaving it set would fetch and parse the Node.js
    // CHANGELOG on every build to populate a version picker we never render.
    repository: 'nodejs/learn',
    ref: 'main',
    changelog: [],
  },
  'jsx-ast': {
    // Off by default in doc-kit 2.x, but the Metabar has always shown it.
    showReadingTime: true,
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

    // Registers the component as an island, so it hydrates client-side
    components: {
      Authors: join(import.meta.dirname, 'components/Authors/index.jsx'),
    },

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
