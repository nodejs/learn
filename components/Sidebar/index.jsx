import SideBar from '@node-core/ui-components/Containers/Sidebar';
import { sidebar } from '../../site.json' with { type: 'json' };
import { useRef, useLayoutEffect } from 'react';
import useScrollToElement from '../../hooks/useScrollToElement';

/** @param {string} url */
const redirect = url => (window.location.href = url);

const PrefetchLink = props => <a {...props} rel="prefetch" />;

/**
 * Sidebar component for MDX documentation with page navigation
 */
export default ({ metadata }) => {
  const sidebarRef = useRef(null);

  // SideBar from @node-core/ui-components does not support forwardRef,
  // so ref={sidebarRef} is silently ignored. useLayoutEffect runs before
  // useEffect, so by the time useScroll's effect attaches the scroll
  // listener, sidebarRef.current already points to the real <aside> element.
  useLayoutEffect(() => {
    sidebarRef.current = document.querySelector('aside');
  }, []);

  useScrollToElement('sidebar', sidebarRef);

  return (
    <SideBar
      pathname={`/learn${metadata.path.replace('/index', '')}`}
      groups={sidebar}
      onSelect={redirect}
      as={PrefetchLink}
      title="Navigation"
    />
  );
};
