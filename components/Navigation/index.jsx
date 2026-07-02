import ThemeToggle from '@node-core/ui-components/Common/ThemeToggle';
import NavBar from '@node-core/ui-components/Containers/NavBar';
import styles from '@node-core/ui-components/Containers/NavBar/index.module.css';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import SearchBox from '@node-core/doc-kit/src/generators/web/ui/components/SearchBox';
import { useTheme } from '@node-core/doc-kit/src/generators/web/ui/hooks/useTheme.mjs';
import { navigation } from '../../site.json' with { type: 'json' };
import Logo from '#theme/Logo';

/**
 * NavBar component that displays the headings, search, etc.
 */
export default ({ metadata }) => {
  const [themePreference, setThemePreference] = useTheme();

  return (
    <NavBar
      Logo={Logo}
      sidebarItemTogglerAriaLabel="Toggle navigation menu"
      navItems={navigation}
    >
      <SearchBox pathname={metadata.path} />
      <ThemeToggle
        onChange={setThemePreference}
        currentTheme={themePreference}
      />
      <a
        href={`https://github.com/nodejs/learn`}
        className={styles.ghIconWrapper}
      >
        <GitHubIcon />
      </a>
    </NavBar>
  );
};
