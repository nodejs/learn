import SideBar from '@node-core/ui-components/Containers/Sidebar';
import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';
import { sidebar } from '../../site.json' with { type: 'json' };

/** @param {string} url */
const redirect = url => (window.location.href = url);

const PrefetchLink = props => <a {...props} rel="prefetch" />;

/**
 * Sidebar component for MDX documentation with page navigation.
 *
 * On small screens the sidebar collapses into a dropdown, which only opens
 * once hydrated. doc-kit 2.x hydrates islands and nothing else, so the sidebar
 * is registered as one (see `components` in doc-kit.config.mjs).
 *
 * @param {{ pathname: string }} props
 */
const Sidebar = ({ pathname }) => (
  <SideBar
    pathname={pathname}
    groups={sidebar}
    onSelect={redirect}
    as={PrefetchLink}
    title="Navigation"
  />
);

export default withIsland(Sidebar, { name: 'Sidebar', on: { idle: true } });
