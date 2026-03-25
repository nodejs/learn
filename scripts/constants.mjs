import { join } from 'node:path';

// Input
export const PAGES_DIR = join(import.meta.dirname, '..', 'pages');

// Output
export const OUTPUT_FILE = join(
  import.meta.dirname,
  '..',
  'components',
  'config.json'
);

// Index
export const INDEX_FILE = join(PAGES_DIR, 'index.md');

// Site navigation
export const NAV_URL =
  'https://raw.githubusercontent.com/nodejs/nodejs.org/main/apps/site/navigation.json';

// Site translations
export const I18N_URL =
  'https://raw.githubusercontent.com/nodejs/nodejs.org/main/packages/i18n/src/locales/en.json';

// Authors
// TODO(@avivkeller): What if we fetched this data from GitHub directly?
export const AUTHORS_URL =
  'https://raw.githubusercontent.com/nodejs/nodejs.org/refs/heads/main/apps/site/authors.json';

// Matches the first H1 heading in a markdown string (e.g. `# Title`)
export const HEADING_RE = /^#\s+(.+)$/m;

// Matches group slugs from index.md links (e.g. `](/guides/`)
export const GROUP_SLUG_RE = /\]\(\/([\w-]+)\//g;

// Matches an HTML comment YAML block (e.g. `<!-- YAML ... -->`)
export const YAML_BLOCK_RE = /<!--\s*YAML\s+([\s\S]*?)-->/;

// Matches the `authors:` line inside a YAML block
export const AUTHORS_LINE_RE = /^authors:\s*(.+)$/m;
