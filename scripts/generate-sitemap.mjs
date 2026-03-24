import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteUrl = process.env.SITE_URL || 'https://gif.localtool.tech';
const useLocalePath = path.join(root, 'src', 'i18n', 'useLocale.ts');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

const useLocaleSrc = fs.readFileSync(useLocalePath, 'utf8');
const match = useLocaleSrc.match(/SUPPORTED_LOCALES\s*:\s*Locale\[]\s*=\s*\[([^\]]+)\]/m);
if (!match) {
  console.error('Could not find SUPPORTED_LOCALES in useLocale.ts');
  process.exit(1);
}

const locales = match[1]
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(s => s.replace(/^['"]|['"]$/g, ''));

const urls = [];
urls.push('/');
urls.push('/about');
for (const loc of locales) {
  if (!loc) continue;
  urls.push(`/${loc}/`);
  urls.push(`/${loc}/about`);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(u => `  <url>\n    <loc>${siteUrl}${u}</loc>\n  </url>`),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`sitemap.xml updated with ${urls.length} urls`);
