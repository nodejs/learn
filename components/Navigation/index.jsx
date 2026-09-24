import NavBar from '@node-core/ui-components/Containers/NavBar';
import styles from '@node-core/ui-components/Containers/NavBar/index.module.css';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import SearchBox from '@doc-kit/generator-react/html/ui/components/SearchBox/index.jsx';
// doc-kit's ThemeToggle is registered as an island, so it hydrates on the
// client. Rendering `@node-core/ui-components`' toggle directly here leaves a
// static button that never opens.
import ThemeToggle from '@doc-kit/generator-react/html/ui/components/ThemeToggle.jsx';
import { navigation } from '../../site.json' with { type: 'json' };
import Logo from '#theme/Logo';

/**
 * NavBar component that displays the headings, search, etc.
 */
export default ({ metadata }) => (
  <NavBar
    Logo={Logo}
    pathname="/learn"
    sidebarItemTogglerAriaLabel="Toggle navigation menu"
    navItems={navigation}
  >
    <SearchBox pathname={metadata.path} />
    <ThemeToggle />
    <a
      href={`https://github.com/nodejs/learn`}
      className={styles.ghIconWrapper}
    >
      <GitHubIcon />
    </a>
  </NavBar>
);
