import Footer from '@node-core/ui-components/Containers/Footer';
import NavItem from '@node-core/ui-components/Containers/NavBar/NavItem';

const SOCIAL_LINKS = [
  { icon: 'github', link: 'https://github.com/nodejs/node', alt: 'GitHub' },
  { icon: 'discord', link: 'https://discord.gg/nodejs', alt: 'Discord' },
  { icon: 'mastodon', link: 'https://social.lfx.dev/@nodejs', alt: 'Mastodon' },
  {
    icon: 'bluesky',
    link: 'https://bsky.app/profile/nodejs.org',
    alt: 'Bluesky',
  },
  { icon: 'twitter', link: 'https://twitter.com/nodejs', alt: 'Twitter' },
  { icon: 'slack', link: 'https://slack-invite.openjsf.org/', alt: 'Slack' },
  {
    icon: 'linkedin',
    link: 'https://www.linkedin.com/company/node-js',
    alt: 'LinkedIn',
  },
];

const FOOTER_LINKS = [
  {
    link: 'https://openjsf.org/',
    text: 'OpenJS Foundation',
  },
  {
    link: 'https://terms-of-use.openjsf.org/',
    text: 'Terms of Use',
  },
  {
    link: 'https://privacy-policy.openjsf.org/',
    text: 'Privacy Policy',
  },
  {
    link: 'https://bylaws.openjsf.org/',
    text: 'Bylaws',
  },
  {
    link: 'https://github.com/openjs-foundation/cross-project-council/blob/main/CODE_OF_CONDUCT.md',
    text: 'Code of Conduct',
  },
  {
    link: 'https://trademark-policy.openjsf.org/',
    text: 'Trademark Policy',
  },
  {
    link: 'https://trademark-list.openjsf.org/',
    text: 'Trademark List',
  },
  {
    link: 'https://www.linuxfoundation.org/cookies/',
    text: 'Cookie Policy',
  },
  {
    link: 'https://github.com/nodejs/node/security/policy',
    text: 'Security Policy',
  },
];

// The Node.js Project is legally obligated to include the following text.
// It should not be modified unless explicitly requested by OpenJS staff.
const LegalSlot = (
  <>
    <p>
      Copyright <a href="https://openjsf.org/">OpenJS Foundation</a> and Node.js
      contributors. All rights reserved. The{' '}
      <a href="https://openjsf.org/">OpenJS Foundation</a> has registered
      trademarks and uses trademarks. For a list of trademarks of the{' '}
      <a href="https://openjsf.org/">OpenJS Foundation</a>, please see our{' '}
      <a href="https://trademark-policy.openjsf.org/">Trademark Policy</a> and{' '}
      <a href="https://trademark-list.openjsf.org/">Trademark List</a>.
      Trademarks and logos not indicated on the{' '}
      <a href="https://trademark-list.openjsf.org/">
        list of OpenJS Foundation trademarks
      </a>{' '}
      are trademarks™ or registered® trademarks of their respective holders. Use
      of them does not imply any affiliation with or endorsement by them.
    </p>

    {FOOTER_LINKS.map(({ link, text }) => (
      <NavItem key={link} type="footer" href={link}>
        {text}
      </NavItem>
    ))}
  </>
);

/**
 * Footer component for MDX documentation pages
 */
export default ({ metadata }) => (
  <Footer
    pathname={metadata.path}
    navigation={{ socialLinks: SOCIAL_LINKS }}
    slots={{ legal: LegalSlot }}
  />
);
