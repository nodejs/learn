import { IntlProvider } from 'react-intl';

import { defaultLocale } from '../site.json' with { type: 'json' };

const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * Detects the locale from the cookie.
 * Falls back to the default locale when the cookie is missing.
 *
 * @returns {string}
 */
export const detectLocaleFromCookies = () => {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const localeCookie = document.cookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${LOCALE_COOKIE}=`));

  if (!localeCookie) {
    return defaultLocale;
  }

  return decodeURIComponent(localeCookie.slice(LOCALE_COOKIE.length + 1));
};

/**
 * LocaleProvider component that provides the locale context to its children.
 *
 * @param {{ locale?: string, children: import('preact').ComponentChildren }} props
 */
export default function LocaleProvider({ locale, children }) {
  const detectedLocale = locale ?? detectLocaleFromCookies();

  return (
    <IntlProvider locale={detectedLocale} messages={{}}>
      {children}
    </IntlProvider>
  );
}
