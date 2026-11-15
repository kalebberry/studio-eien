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
server.listen(4488, async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await page.goto('http://localhost:4488/work/kangae', { waitUntil: 'networkidle' });

	const cardData = await page.evaluate(() => {
		const card = document.querySelector('.cs-highlights__card');
		const title = card?.querySelector('.cs-highlights__card-title');
		const sub = card?.querySelector('.cs-highlights__subtitle');
		const desc = card?.querySelector('.cs-highlights__desc');

		const get = (el) => {
			if (!el) return null;
			const cs = window.getComputedStyle(el);
			return {
				fontSize: cs.fontSize,
				lineHeight: cs.lineHeight,
				marginTop: cs.marginTop,
				marginBottom: cs.marginBottom,
			};
		};

		return {
			cardPadding: card ? window.getComputedStyle(card).padding : null,
			cardGap: card ? window.getComputedStyle(card).gap : null,
			title: get(title),
			sub: get(sub),
			desc: get(desc),
		};
	});

	console.log('Updated Card Computed Styles:', JSON.stringify(cardData, null, 2));

	const highlights = await page.$('.cs-highlights');
	if (highlights) {
		await highlights.scrollIntoViewIfNeeded();
		await new Promise((r) => setTimeout(r, 200));
		await highlights.screenshot({ path: path.join(OUT_DIR, 'card-spacing-verified.png') });
		console.log('Saved card-spacing-verified.png');
	}

	await browser.close();
	server.close();
	console.log('Done checking cards.');
});
