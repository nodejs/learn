import { useEffect, useState } from 'preact/hooks';

import { defaultLocale } from '../site.json' with { type: 'json' };

const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Retrieves the locale from the NEXT_LOCALE cookie.
 *
 * @returns {string|null} The locale from the NEXT_LOCALE cookie, or null if not found.
 */
const getNextLocaleFromCookie = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const localeCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${LOCALE_COOKIE}=`));

  if (!localeCookie) {
    return null;
  }

  return decodeURIComponent(localeCookie.slice(LOCALE_COOKIE.length + 1));
};

/**
 * Replaces the default locale in a link with the provided locale.
 *
 * @param {string} link - The link to be localized.
 * @param {string|null} nextLocale - The locale to apply to the link.
 * @returns {string} - The localized link.
 */
const replaceLocaleInLink = (link, nextLocale) => {
  if (!link.startsWith('/') || !link.startsWith(`/${defaultLocale}`)) {
    return link;
  }

  const localizedPrefix = nextLocale ? `/${nextLocale}` : '';

  if (link === `/${defaultLocale}`) {
    return localizedPrefix || '/';
  }

  return link.replace(`/${defaultLocale}/`, `${localizedPrefix}/`);
};

/**
 * Localizes a given link based on the provided locale.
 *
 * @param {string} link - The link to be localized.
 * @param {string|null} nextLocale - The locale to apply to the link.
 * @returns {string} - The localized link.
 */
const localizeLink = (link, nextLocale) => {
  if (nextLocale === null) {
    return link;
  }

  return replaceLocaleInLink(link, nextLocale);
};

/**
 * Custom hook to get a function that localizes links based on the NEXT_LOCALE cookie.
 * @returns {function(string): string} A function that takes a link and returns the localized version of that link.
 */
const useLocalizedLink = () => {
  const [nextLocale, setNextLocale] = useState(null);

  useEffect(() => {
    setNextLocale(getNextLocaleFromCookie());
  }, []);

  return (link) => localizeLink(link, nextLocale);
};

export default useLocalizedLink;
