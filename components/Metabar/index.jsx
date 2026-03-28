import MetaBar from '@node-core/ui-components/Containers/MetaBar';
import AvatarGroup from '@node-core/ui-components/Common/AvatarGroup';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import { authors } from '../config.json' with { type: 'json' };

/**
 * @typedef MetaBarProps
 * @property {Array<import('@vcarl/remark-headings').Heading>} headings
 * @property {string} readingTime
 * @property {Array<[string, string]>} viewAs
 * @property {string} editThisPage
 */

/** @param {MetaBarProps} props */
export default ({ headings = [], readingTime, viewAs = [], editThisPage }) => {
  const pageAuthors = authors[editThisPage];

  return (
    <MetaBar
      heading="Table of Contents"
      headings={{ items: headings }}
      items={{
        'Reading Time': readingTime,
        ...(CLIENT && pageAuthors?.length
          ? {
              Authors: (
                <AvatarGroup avatars={pageAuthors} as="a" clickable limit={5} />
              ),
            }
          : {}),
        Contribute: (
          <>
            <GitHubIcon className="fill-neutral-700 dark:fill-neutral-100" />
            <a href={editThisPage}>Edit this page</a>
          </>
        ),
      }}
    />
  );
};
