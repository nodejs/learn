import TableOfContents from '@node-core/ui-components/Common/TableOfContents';
import Article from '@node-core/ui-components/Containers/Article';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import NavBar from '../Navigation';
import MetaBar from '../Metabar';
import SideBar from '../Sidebar';
import Footer from '../Footer';

/**
 * @typedef {Object} Props
 * @property {import('@node-core/doc-kit/src/generators/web/ui/types.d.ts').SerializedMetadata} metadata
 * @property {Array} headings
 * @property {string} readingTime
 * @property {import('preact').ComponentChildren} children
 */

/**
 * @param {Props} props
 */
export default ({ metadata, headings, readingTime, children }) => (
  <>
    <Analytics basePath="https://node-learn-pages.vercel.app/_vercel" />
    <SpeedInsights basePath="https://node-learn-pages.vercel.app/_vercel" />
    <NavBar />
    <Article>
      <SideBar metadata={metadata} />
      <div>
        <div>
          <TableOfContents headings={headings} summaryTitle="On this page" />
          <br />
          <main>{children}</main>
        </div>
        <MetaBar
          metadata={metadata}
          headings={headings}
          readingTime={readingTime}
        />
      </div>
    </Article>
    <Footer metadata={metadata} />
  </>
);
