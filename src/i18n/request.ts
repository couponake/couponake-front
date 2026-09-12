import {getRequestConfig} from 'next-intl/server';
import {defaultLocale} from './config';

// The locale is fixed to the site default (Arabic). Reading the NEXT_LOCALE
// cookie here made every route in the site dynamically rendered, which
// prevented ISR / edge caching of HTML (see PR "perf: unlock ISR").
export default getRequestConfig(async () => {
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
