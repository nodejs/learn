import MetaBar from '@node-core/ui-components/Containers/MetaBar';
import AvatarGroup from '@node-core/ui-components/Common/AvatarGroup';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import { editURL } from '#theme/config';

export default ({ metadata, headings = [], readingTime }) => {
  const editThisPage = editURL.replace('{path}', metadata.path);
  const authors = metadata.authors?.split(',').map(id => ({
    image: `https://avatars.githubusercontent.com/${id.trim()}`,
    url: `https://github.com/${id.trim()}`,
    nickname: id,
  }));

  return (
    <MetaBar
      heading="Table of Contents"
      headings={{ items: headings }}
      items={{
        'Reading Time': readingTime,
        ...(CLIENT && authors?.length
          ? {
              Authors: <AvatarGroup avatars={authors} as="a" limit={5} />,
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
