import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getLocaleConfig, localizedPath, localizedPostSlug } from '../../i18n';
import { withBase } from '../../utils/paths';

export async function GET(context) {
  const locale = 'es';
  const site = getLocaleConfig(locale);
  const posts = (await getCollection('posts'))
    .filter((post) => !post.data.draft && post.data.lang === locale)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: site.title,
    description: site.description,
    site: new URL(withBase(localizedPath(locale, '/')), context.site),
    customData: '<language>es</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(
        localizedPath(locale, `/posts/${localizedPostSlug(post.id, locale)}/`)
      ),
    })),
  });
}
