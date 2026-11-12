import { useLayoutEffect } from 'react';
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
const Sidebar = ({ pathname }) => {
  // Each navigation is a full page load, so the sidebar always starts at the
  // top. Scroll the active link into view (stateless, no storage needed).
  useLayoutEffect(() => {
    const active = document.querySelector(`aside a[href="${pathname}"]`);
    const aside = active?.closest('aside');

    if (!aside || !active) {
      return;
    }

    const asideRect = aside.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    // Only scroll if the active link is outside the visible area
    if (
      activeRect.top < asideRect.top ||
      activeRect.bottom > asideRect.bottom
    ) {
      aside.scrollTop +=
        activeRect.top - asideRect.top - aside.clientHeight / 2;
    }
  }, [pathname]);

  return (
    <SideBar
      pathname={pathname}
      groups={sidebar}
      onSelect={redirect}
      as={PrefetchLink}
      title="Navigation"
    />
  );
};

export default withIsland(Sidebar, { name: 'Sidebar', on: { idle: true } });
