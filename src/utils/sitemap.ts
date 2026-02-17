export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapURL[]): string => {
  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

export const defaultSitemapUrls: SitemapURL[] = [
  {
    loc: 'https://yourdomain.com/',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: 'https://yourdomain.com/portfolio',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://yourdomain.com/reels',
    changefreq: 'daily',
    priority: 0.9
  }
];
