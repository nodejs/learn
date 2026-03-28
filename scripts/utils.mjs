import { sep } from 'node:path';
import {
  AUTHORS_LINE_RE,
  AUTHORS_URL,
  GROUP_SLUG_RE,
  HEADING_RE,
  I18N_URL,
  NAV_URL,
  YAML_BLOCK_RE,
} from './constants.mjs';

/**
 * Extracts the first H1 heading from markdown content.
 * @param {string} content Raw markdown string.
 * @returns {string} The heading text, or an empty string if none is found.
 */
export const extractTitle = content =>
  content.match(HEADING_RE)?.[1]?.trim() ?? '';

/**
 * Extracts the ordered list of group slugs from index.md links.
 * @param {string} content Raw markdown of the index file.
 * @returns {Array<string>} Ordered, deduplicated group slugs.
 */
export const extractGroupOrder = content => [
  ...new Set([...content.matchAll(GROUP_SLUG_RE)].map(match => match[1])),
];

/**
 * Extracts author IDs from a `<!-- YAML authors: id1, id2->` block.
 * @param {string} content Raw markdown string.
 * @returns {Array<string>} An array of trimmed, non-empty author IDs.
 */
export const extractAuthorIds = content => {
  const yaml = content.match(YAML_BLOCK_RE)?.[1] ?? '';
  const line = yaml.match(AUTHORS_LINE_RE)?.[1] ?? '';
  return line
    .split(',')
    .map(authorId => authorId.trim())
    .filter(Boolean);
};

/**
 * Converts a kebab-case slug to a title-cased string.
 * @param {string} slug e.g. `"getting-started"`.
 * @returns {string} e.g. `"Getting Started"`.
 */
export const slugToTitle = slug =>
  slug.replace(
    /(^|-)(\w)/g,
    (_, _sep, ch) => (_sep ? ' ' : '') + ch.toUpperCase()
  );

/**
 * Derives a URL pathname from a markdown file path.
 * @param {string} file Relative file path (e.g. `"guides/intro.md"`).
 * @returns {string} URL pathname (e.g. `"/guides/intro"`).
 */
export const toPathname = file => {
  const path = file.split(sep).join('/');
  const withoutExtension = path.replace(/\.mdx?$/, '');

  return '/' + withoutExtension;
};

/**
 * Fetches and parses JSON from a URL.
 * @param {string} url The URL to fetch.
 * @returns {Promise<any>} Parsed JSON response.
 */
export const fetchJson = url => fetch(url).then(r => r.json());

/**
 * Fetches author data from {@link AUTHORS_URL} and returns an id-keyed lookup.
 * @returns {Promise<Map<string, any>>}
 */
export const fetchAuthorsMap = async () => {
  const raw = await fetchJson(AUTHORS_URL);
  return new Map(Object.values(raw).map(entry => [entry.id, entry]));
};

/**
 * Fetches navigation and i18n data, then assembles the top navigation items.
 * @returns {Promise<Array<any>>}
 */
export const fetchTopNav = async () => {
  const [nav, i18n] = await Promise.all([
    fetchJson(NAV_URL),
    fetchJson(I18N_URL),
  ]);

  /**
   * Resolves a dot-separated key path against the i18n object.
   * @param {string} path e.g. `"nav.home.label"`.
   * @returns {string | undefined}
   */
  const resolve = path =>
    path.split('.').reduce((obj, key) => obj?.[key], i18n);

  return Object.values(nav.topNavigation).map(({ link, label, target }) => ({
    link,
    text: resolve(label),
    ...(target && { target }),
  }));
};

/**
 * Resolves a GitHub author ID into a full author object,
 * enriching it with data from the authors map when available.
 * @param {string} id GitHub username.
 * @param {Map<string, any>} authorsById Lookup map of known authors.
 * @returns {any}
 */
export const resolveAuthor = (id, authorsById) => {
  const entry = authorsById.get(id);
  const name = entry?.name ?? id;
  const initials = (name.match(/\b\w/g) ?? []).join('').toUpperCase();

  return {
    image: `https://avatars.githubusercontent.com/${id}`,
    name,
    nickname: id,
    fallback: initials,
    url: entry?.website ?? `https://github.com/${id}`,
  };
};

/**
 * Parses a single markdown page into its metadata.
 * @param {string} file Relative path to the markdown file.
 * @param {string} content Raw file content.
 * @returns {any}
 */
export const parsePage = (file, content) => {
  const pathname = toPathname(file);
  const [group] = file.split(sep);

  return {
    group,
    pathname,
    label: extractTitle(content),
    authorIds: extractAuthorIds(content),
  };
};
