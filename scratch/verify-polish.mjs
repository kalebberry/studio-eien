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
server.listen(4494, async () => {
	const browser = await chromium.launch();

	// 1. Desktop Test (1440x900)
	const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await pageDesktop.goto('http://localhost:4494/work/kangae', { waitUntil: 'networkidle' });

	// Scroll down gradually to trigger lazy-load
	await pageDesktop.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));

	// Inspect paragraph styles
	const pStyle = await pageDesktop.evaluate(() => {
		const p = document.querySelector('.cs-section__content p');
		const cs = window.getComputedStyle(p);
		const quote = document.querySelector('.cs-section__callout');
		const quoteCs = window.getComputedStyle(quote);
		const cardDesc = document.querySelector('.cs-highlights__desc');
		const cardCs = window.getComputedStyle(cardDesc);

		// Check overflow
		const bodyOverflow = document.documentElement.scrollWidth > window.innerWidth;

		return {
			paragraph: {
				fontFamily: cs.fontFamily,
				fontSize: cs.fontSize,
				lineHeight: cs.lineHeight,
				color: cs.color,
				marginBottom: cs.marginBottom,
			},
			callout: {
				fontFamily: quoteCs.fontFamily,
				fontSize: quoteCs.fontSize,
				borderLeft: quoteCs.borderLeft,
			},
			cardDesc: {
				fontFamily: cardCs.fontFamily,
				fontSize: cardCs.fontSize,
				lineHeight: cardCs.lineHeight,
			},
			hasHorizontalScroll: bodyOverflow,
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth: window.innerWidth,
		};
	});

	console.log('Polished Styles Report:', JSON.stringify(pStyle, null, 2));

	// Capture Desktop Gallery
	const gallery = await pageDesktop.$('.cs-gallery');
	if (gallery) {
		await gallery.screenshot({ path: path.join(OUT_DIR, 'kangae-artifacts-polished.png') });
		console.log('Saved kangae-artifacts-polished.png');
	}

	// Capture Four Tenets
	const highlights = await pageDesktop.$('.cs-highlights');
	if (highlights) {
		await highlights.screenshot({ path: path.join(OUT_DIR, 'kangae-tenets-polished.png') });
		console.log('Saved kangae-tenets-polished.png');
	}

	// Capture Full Desktop Page
	await pageDesktop.screenshot({ path: path.join(OUT_DIR, 'full-desktop.png'), fullPage: true });
	console.log('Saved full-desktop.png');

	// 2. Mobile Test (375x812)
	const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
	await pageMobile.goto('http://localhost:4494/work/kangae', { waitUntil: 'networkidle' });

	await pageMobile.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));

	const mobileOverflow = await pageMobile.evaluate(() => ({
		hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
	}));
	console.log('Mobile Overflow Check:', mobileOverflow);

	await pageMobile.screenshot({ path: path.join(OUT_DIR, 'full-mobile.png'), fullPage: true });
	console.log('Saved full-mobile.png');

	// 3. Tablet Test (768x1024)
	const pageTablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
	await pageTablet.goto('http://localhost:4494/work/kangae', { waitUntil: 'networkidle' });
	const tabletOverflow = await pageTablet.evaluate(() => ({
		hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
	}));
	console.log('Tablet Overflow Check:', tabletOverflow);

	await browser.close();
	server.close();
	console.log('All verification checks complete.');
});
