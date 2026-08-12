import config from '../astro-theme-config';

export const supportedLocales = ['en', 'es'] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale = config.i18n.defaultLocale as Locale;

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function getLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function getLocaleConfig(locale: Locale) {
  return config.i18n.locales[locale];
}

export function localizedPath(locale: Locale, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? normalizedPath : `/${locale}${normalizedPath}`;
}

export function localizedPostSlug(id: string, locale: Locale) {
  const localePrefix = `${locale}/`;
  return id.startsWith(localePrefix) ? id.slice(localePrefix.length) : id;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}
