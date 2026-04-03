import ThemeToggle from '@node-core/ui-components/Common/ThemeToggle';
import NavBar from '@node-core/ui-components/Containers/NavBar';
import styles from '@node-core/ui-components/Containers/NavBar/index.module.css';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import SearchBox from '@node-core/doc-kit/src/generators/web/ui/components/SearchBox';
import { useTheme } from '@node-core/doc-kit/src/generators/web/ui/hooks/useTheme.mjs';

import Logo from '#theme/Logo';

/**
 * NavBar component that displays the headings, search, etc.
 */
export default ({ metadata }) => {
  const [theme, toggleTheme] = useTheme();

  return (
    <NavBar
      Logo={Logo}
      sidebarItemTogglerAriaLabel="Toggle navigation menu"
      navItems={[
        { link: '/learn', text: 'Learn' },
        { link: '/about', text: 'About' },
        { link: '/download', text: 'Download' },
        { link: '/blog', text: 'Blog' },
        { link: 'https://nodejs.org/docs/latest/api/', text: 'Docs' },
        {
          link: 'https://github.com/nodejs/node/blob/main/CONTRIBUTING.md',
          text: 'Contribute',
          target: '_blank',
        },
        {
          link: 'https://training.linuxfoundation.org/openjs/',
          text: 'Courses',
          target: '_blank',
        },
      ]}
    >
      <SearchBox pathname={metadata.path} />
      <ThemeToggle
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
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
