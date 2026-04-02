import SideBar from '@node-core/ui-components/Containers/Sidebar';
import { relative } from '@node-core/doc-kit/src/utils/url.mjs';
import { pages } from '#theme/config';

/** @type {Array<[string, string]>} */
const categories = [
  ['getting-started', 'Getting Started'],
  ['command-line', 'Command Line'],
  ['http', 'HTTP'],
  ['file-system', 'File System'],
  ['asynchronous-work', 'Asynchronous Work'],
  ['typescript', 'TypeScript'],
  ['package-management', 'Package Management'],
  ['diagnostics', 'Diagnostics'],
  ['testing', 'Testing'],
  ['security', 'Security'],
];

/** @type {Map<string, Array<{ heading: string, path: string }>>} */
const byDir = new Map();
for (const [heading, path] of pages) {
  const dir = path.split('/')[1];
  if (!byDir.has(dir)) byDir.set(dir, []);
  byDir.get(dir).push({ heading, path });
}

/** @param {string} url */
const redirect = url => (window.location.href = url);

const PrefetchLink = props => <a {...props} rel="prefetch" />;

/**
 * Sidebar component for MDX documentation with page navigation
 */
export default ({ metadata }) => {
  const { path: currentPath, basename } = metadata;
  const pathname = `${basename}.html`;

  const groups = categories.map(([dir, title]) => ({
    groupName: title,
    items: byDir.get(dir).map(({ heading, path }) => ({
      label: heading,
      link:
        currentPath === path ? pathname : `${relative(path, currentPath)}.html`,
    })),
  }));

  return (
    <SideBar
      pathname={pathname}
      groups={groups}
      onSelect={redirect}
      as={PrefetchLink}
      title="Navigation"
    />
  );
};
