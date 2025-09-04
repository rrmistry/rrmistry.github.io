
import fs from 'fs';
import svgToIco from 'svg-to-ico';

const domain = process.argv[2];

if (!domain) {
  console.error('Please provide a domain as an argument.');
  process.exit(1);
}

// Generate robots.txt
const robotsTxt = `User-Agent: *
Allow: /
Sitemap: https://${domain}/sitemap.xml
`;

fs.writeFile('build/robots.txt', robotsTxt, 'utf8', (err) => {
  if (err) console.error(err);
});

// Generate favicon.ico
svgToIco({
  input_name: 'static/icon.svg',
  output_name: 'build/favicon.ico'
});
