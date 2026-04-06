import Footer from '@node-core/ui-components/Containers/Footer';
import NavItem from '@node-core/ui-components/Containers/NavBar/NavItem';

import { footer } from '../../site.json' with { type: 'json' };

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

    <p>
      {footer.links.map(({ link, text }) => (
        <NavItem key={link} type="footer" href={link}>
          {text}
        </NavItem>
      ))}
    </p>
  </>
);

/**
 * Footer component for MDX documentation pages
 */
export default ({ metadata }) => (
  <Footer
    pathname={metadata.path}
    navigation={{ socialLinks: footer.social }}
    slots={{ legal: LegalSlot }}
  />
);
