import CrossLink from '@node-core/ui-components/Common/BaseCrossLink';

import { sidebar } from '../../site.json' with { type: 'json' };

import styles from './index.module.css';

const flattenItems = items =>
  items.flatMap(item =>
    item.items?.length ? flattenItems(item.items) : [item]
  );

const articles = sidebar.flatMap(({ items }) => flattenItems(items));

/**
 * Previous/next article navigation following the same order as the sidebar.
 *
 * @param {{ pathname: string }} props
 */
const ArticleNavigation = ({ pathname }) => {
  const currentIndex = articles.findIndex(({ link }) => link === pathname);

  if (currentIndex === -1) {
    return null;
  }

  const previous = articles[currentIndex - 1];
  const next = articles[currentIndex + 1];

  if (!previous && !next) {
    return null;
  }

  return (
    <nav className={styles.crossLinks} aria-label="Article navigation">
      {(previous && (
        <CrossLink
          type="previous"
          label="Previous"
          text={previous.label}
          link={previous.link}
        />
      )) || <div />}

      {next && (
        <CrossLink
          type="next"
          label="Next"
          text={next.label}
          link={next.link}
        />
      )}
    </nav>
  );
};

export default ArticleNavigation;
