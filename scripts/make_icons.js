const sharp = require('sharp');
const fs = require('fs');

const svg192 = Buffer.from(`
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#0f172a"/>
  <circle cx="96" cy="96" r="76" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="16 8"/>
  <text x="96" y="128" font-size="96" font-weight="900" font-family="Arial, sans-serif" fill="#f59e0b" text-anchor="middle">T</text>
</svg>
`);

const svg512 = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#0f172a"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#f59e0b" stroke-width="20" stroke-dasharray="36 18"/>
  <text x="256" y="340" font-size="250" font-weight="900" font-family="Arial, sans-serif" fill="#f59e0b" text-anchor="middle">T</text>
</svg>
`);

Promise.all([
  sharp(svg192).png().toFile('public/icon-192.png'),
  sharp(svg512).png().toFile('public/icon-512.png'),
  sharp(svg192).png().toFile('public/icon-192-maskable.png'),
  sharp(svg512).png().toFile('public/icon-512-maskable.png')
]).then(() => {
  console.log('PWA icons created successfully!');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
