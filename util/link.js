import { defaultLocale } from '../site.json' with { type: 'json' };

/**
 * Replaces the default locale in a link with the provided locale.
 *
 * @param {string} link - The link to be localized.
 * @param {string|null} locale - The locale to apply to the link.
 * @returns {string} - The localized link.
 */
const localizeLink = (link, locale) => {
  if (
    typeof document === 'undefined' ||
    !link.startsWith('/') ||
    !link.startsWith(`/${defaultLocale}`)
  ) {
    return link;
  }

  const localizedPrefix = locale ? `/${locale}` : '';
  const localizedLink = link.replace(
    `/${defaultLocale}/`,
    `${localizedPrefix}/`
  );

  return localizedLink;
};

export default { localizeLink };
