import AvatarGroup from '@node-core/ui-components/Common/AvatarGroup';
import withIsland from '@doc-kit/generator-react/html/ui/islands/withIsland.jsx';

/**
 * The avatars for a page's authors.
 *
 * Radix's Avatar only emits its `<img>` once the browser has loaded the image,
 * so server-rendering this on its own yields empty circles. doc-kit 2.x
 * hydrates islands and nothing else, so the group is registered as one (see
 * `components` in doc-kit.config.mjs) and fills in once the page goes idle.
 *
 * @param {{ authors: Array<{ image: string, url: string, nickname: string }> }} props
 */
const Authors = ({ authors }) => (
  <AvatarGroup avatars={authors} as="a" limit={5} />
);

export default withIsland(Authors, { name: 'Authors', on: { idle: true } });
