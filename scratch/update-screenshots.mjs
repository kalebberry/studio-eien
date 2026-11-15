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
	};
	res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
	fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(serveStatic);
server.listen(4487, async () => {
	const browser = await chromium.launch();

	// Desktop 1440
	const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await pageDesktop.goto('http://localhost:4487/work/kangae', { waitUntil: 'networkidle' });
	await pageDesktop.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));
	await pageDesktop.screenshot({ path: path.join(OUT_DIR, 'full-desktop.png'), fullPage: true });

	// Mobile 375
	const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
	await pageMobile.goto('http://localhost:4487/work/kangae', { waitUntil: 'networkidle' });
	await pageMobile.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));
	await pageMobile.screenshot({ path: path.join(OUT_DIR, 'full-mobile.png'), fullPage: true });

	await browser.close();
	server.close();
	console.log('Updated full screenshots saved.');
});
