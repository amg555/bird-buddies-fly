export default function handler(req: any, res: any) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kadayadibird.vercel.app/</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/play</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/characters</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/sura</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/polayadi</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/flappy-sura</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/suresh-gopi-game</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/leaderboard</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://kadayadibird.vercel.app/about</loc>
    <lastmod>2025-01-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate');
  res.status(200).send(sitemap);
}