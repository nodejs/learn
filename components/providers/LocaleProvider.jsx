import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

import { defaultLocale } from '../../site.json' with { type: 'json' };

const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Replaces the default locale prefix in a link with the given locale.
 *
 * @param {string} link
 * @param {string} locale
 * @returns {string}
 */
const localizeLink = (link, locale) =>
  link.replace(new RegExp(`^/${defaultLocale}(?=/|$)`), `/${locale}`);

/**
 * Detects the locale from the NEXT_LOCALE cookie.
 * Falls back to the default locale when the cookie is missing.
 *
 * @returns {string}
 */
export const detectLocaleFromCookies = () => {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const match = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${LOCALE_COOKIE}=`));

  return match
    ? decodeURIComponent(match.slice(LOCALE_COOKIE.length + 1))
    : defaultLocale;
};

const LocaleContext = createContext({
  locale: defaultLocale,
  localizeLink: link => link,
});

export const useLocale = () => useContext(LocaleContext);

/**
 * Provides locale and a pre-bound localizeLink fn to the component tree.
 *
 * @param {{ locale?: string, children: import('preact').ComponentChildren }} props
 */
export default function LocaleProvider({ locale, children }) {
  const [detectedLocale, setDetectedLocale] = useState(defaultLocale);

  useEffect(() => {
    setDetectedLocale(locale ?? detectLocaleFromCookies());
  }, [locale]);

  const value = {
    locale: detectedLocale,
    localizeLink: link => localizeLink(link, detectedLocale),
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
