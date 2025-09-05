
import fs from 'fs';
import svgToIco from 'svg-to-ico';

const page_url = process.argv[2];

if (!page_url) {
  console.error('Please provide a page_url as an argument.');
  process.exit(1);
}

// Generate robots.txt
const robotsTxt = `User-Agent: *
Allow: /
Sitemap: ${page_url}/sitemap.xml
`;

fs.writeFile('build/robots.txt', robotsTxt, 'utf8', (err) => {
  if (err) console.error(err);
});

// Generate favicon.ico
svgToIco({
  input_name: 'static/icon.svg',
  output_name: 'build/favicon.ico'
});
