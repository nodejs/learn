import MetaBar from '@node-core/ui-components/Containers/MetaBar';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import Authors from '../Authors';

import { editURL } from '#theme/config';

export default ({ metadata, headings = [], readingTime }) => {
  const editThisPage = editURL.replace('{path}', metadata.path);
  const authors = metadata.authors?.split(',').map(rawId => {
    const id = rawId.trim();

    return {
      image: `https://avatars.githubusercontent.com/${id}`,
      url: `https://github.com/${id}`,
      nickname: id,
    };
  });

  return (
    <MetaBar
      heading="Table of Contents"
      headings={{ items: headings }}
      items={{
        'Reading Time': readingTime,
        ...(authors?.length ? { Authors: <Authors authors={authors} /> } : {}),
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
