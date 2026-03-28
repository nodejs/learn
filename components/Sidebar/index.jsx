import SideBar from '@node-core/ui-components/Containers/Sidebar';

import { sideNav } from '../config.json' with { type: 'json' };

/**
 * Redirect to a URL
 * @param {string} url URL
 */
const redirect = url => (window.location.href = url);

/**
 * Sidebar component for MDX documentation with page navigation
 * @param {{ pathname: string }} props
 */
export default ({ pathname }) => (
  <SideBar
    pathname={pathname}
    groups={sideNav}
    onSelect={redirect}
    as={props => <a {...props} rel="prefetch" />}
    title="Navigation"
  />
);
