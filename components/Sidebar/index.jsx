import SideBar from '@node-core/ui-components/Containers/Sidebar';
import { sidebar } from '../../site.json' with { type: 'json' };

/** @param {string} url */
const redirect = url => (window.location.href = url);

const PrefetchLink = props => <a {...props} rel="prefetch" />;

/**
 * Sidebar component for MDX documentation with page navigation
 */
export default ({ metadata }) => (
  <SideBar
    pathname={`/learn${metadata.path.replace('/index', '')}`}
    groups={sidebar}
    onSelect={redirect}
    as={PrefetchLink}
    title="Navigation"
  />
);
