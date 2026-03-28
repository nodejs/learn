import { readFile, writeFile, glob } from 'node:fs/promises';
import { join } from 'node:path';
import { OUTPUT_FILE, INDEX_FILE, PAGES_DIR } from './constants.mjs';
import config from '../doc-kit.config.mjs';
import { populate } from '@node-core/doc-kit/src/utils/configuration/templates.mjs';
import {
  extractGroupOrder,
  fetchAuthorsMap,
  fetchTopNav,
  parsePage,
  resolveAuthor,
  slugToTitle,
} from './utils.mjs';

/**
 * @typedef {Object} AuthorEntry
 * @property {string} id GitHub username used as a unique key.
 * @property {string} [name] Display name (falls back to `id`).
 * @property {string} [website] Personal URL (falls back to GitHub profile).
 */

/**
 * @typedef {Object} ResolvedAuthor
 * @property {string} image GitHub avatar URL.
 * @property {string} name Display name.
 * @property {string} nickname GitHub username.
 * @property {string} fallback Uppercase initials used as an avatar fallback.
 * @property {string} url Link to the author's website or GitHub profile.
 */

/**
 * @typedef {Object} NavItem
 * @property {string} link Destination URL.
 * @property {string} text Visible label.
 * @property {string} [target] Optional link target (e.g. `"_blank"`).
 */

/**
 * @typedef {Object} SideNavGroup
 * @property {string} groupName Human-readable group heading.
 * @property {{ label: string, link: string }[]} items Pages in this group.
 */

/**
 * @typedef {Object} ParsedPage
 * @property {string} group Top-level directory slug (first path segment).
 * @property {string} pathname URL pathname derived from the file path.
 * @property {string} label Page title extracted from the first H1.
 * @property {Array<string>} authorIds GitHub usernames listed in the YAML front-matter.
 */

/**
 * @typedef {Object} BuildOutput
 * @property {SideNavGroup[]} sideNav Grouped sidebar navigation.
 * @property {Record<string, ResolvedAuthor[]>} authors Authors keyed by edit URL.
 */

/**
 * Builds the edit-URL key used to index into the authors map.
 * @param {string} pathname URL pathname of the page.
 * @returns {string} Fully-qualified edit URL.
 */
const toEditUrl = pathname =>
  populate(config['jsx-ast'].editURL, { path: pathname });

/**
 * Reads every markdown page under {@link PAGES_DIR} and produces the sidebar
 * navigation groups and a per-page authors mapping.
 * @param {Map<string, AuthorEntry>} authorsById Lookup map of known authors.
 * @returns {Promise<BuildOutput>}
 */
const buildPages = async authorsById => {
  const [files, indexContent] = await Promise.all([
    Array.fromAsync(glob('**/*.md', { cwd: PAGES_DIR, exclude: ['index.md'] })),
    readFile(INDEX_FILE, 'utf-8'),
  ]);

  const groupOrder = extractGroupOrder(indexContent);

  const pages = await Promise.all(
    files.map(async file => {
      const content = await readFile(join(PAGES_DIR, file), 'utf-8');
      return parsePage(file, content);
    })
  );
  const groups = Map.groupBy(pages, p => p.group);

  // Sort entries by their position in index.md (unknown groups go to the end)
  const sortedEntries = [...groups.entries()].sort(
    (a, b) =>
      (groupOrder.indexOf(a[0]) >>> 0) - (groupOrder.indexOf(b[0]) >>> 0)
  );

  const sideNav = sortedEntries.map(([key, items]) => ({
    groupName: slugToTitle(key),
    items: items.map(({ label, pathname }) => ({
      label,
      link: `/learn${pathname}.html`,
    })),
  }));

  const authors = Object.fromEntries(
    pages
      .filter(({ authorIds }) => authorIds.length > 0)
      .map(({ pathname, authorIds }) => [
        toEditUrl(pathname),
        authorIds.map(id => resolveAuthor(id, authorsById)),
      ])
  );

  return { sideNav, authors };
};

const [authorsById, topNav] = await Promise.all([
  fetchAuthorsMap(),
  fetchTopNav(),
]);

const { sideNav, authors } = await buildPages(authorsById);

await writeFile(
  OUTPUT_FILE,
  JSON.stringify({ topNav, sideNav, authors }, null, 2)
);
