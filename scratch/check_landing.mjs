import { chromium } from 'file:///C:/Users/kaleb/Documents/Github/Animancy/node_modules/playwright/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = 'C:/Users/kaleb/Documents/Github/Animancy/dist';
const OUT_DIR = 'C:/Users/kaleb/.gemini/antigravity-cli/brain/53f7facc-e98d-46ae-bf26-eb8d2e8b83f5';

function serveStatic(req, res) {
	let reqPath = req.url.split('?')[0].replace(/^[/\\]+/, '');
	if (!reqPath) reqPath = 'index.html';
	if (!path.extname(reqPath)) reqPath = path.join(reqPath, 'index.html');
	const filePath = path.join(DIST_DIR, reqPath);
	if (!fs.existsSync(filePath)) {
		res.writeHead(404);
		res.end('Not Found');
		return;
	}
	const ext = path.extname(filePath).toLowerCase();
	const mimeTypes = {
		'.html': 'text/html',
		'.js': 'application/javascript',
		'.css': 'text/css',
		'.svg': 'image/svg+xml',
		'.png': 'image/png',
		'.woff2': 'font/woff2',
		'.woff': 'font/woff',
	};
	res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
	fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(serveStatic);
server.listen(4499, async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await page.goto('http://localhost:4499/', { waitUntil: 'networkidle' });

	const decoration = page.locator('.decoration').first();
	const hero = page.locator('section.hero');

	const heroBox = await hero.boundingBox();
	const decoBox = await decoration.boundingBox();

	console.log('Hero box:', heroBox);
	console.log('Deco box:', decoBox);

	await page.screenshot({
		path: path.join(OUT_DIR, 'landing-hero-decoration.png'),
		clip: {
			x: 0,
			y: Math.max(0, heroBox.y - 20),
			width: 1440,
			height: Math.ceil(decoBox.y + decoBox.height - (heroBox.y - 20) + 40),
		},
	});

	console.log('Screenshot captured successfully.');
	await browser.close();
	server.close();
});
