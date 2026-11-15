import { chromium } from 'file:///C:/Users/kaleb/Documents/Github/Animancy/node_modules/playwright/index.mjs';
import http from 'http';
import fs from 'fs';
import path from 'path';

const DIST_DIR = 'C:/Users/kaleb/Documents/Github/Animancy/dist';

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
server.listen(4501, async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await page.goto('http://localhost:4501/', { waitUntil: 'networkidle' });

	const pDims = await page.evaluate(() => {
		const decos = Array.from(document.querySelectorAll('.decoration'));
		return decos.map((d, i) => {
			const p = d.querySelector('p');
			return {
				i,
				text: p?.innerText,
				offsetWidth: p?.offsetWidth,
				offsetHeight: p?.offsetHeight,
				lineHeight: p ? window.getComputedStyle(p).lineHeight : null,
				fontSize: p ? window.getComputedStyle(p).fontSize : null,
				rect: p?.getBoundingClientRect(),
				parentRect: p?.parentElement?.getBoundingClientRect()
			};
		});
	});

	console.log(JSON.stringify(pDims, null, 2));
	await browser.close();
	server.close();
});
