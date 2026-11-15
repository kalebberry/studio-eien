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
server.listen(4492, async () => {
	const browser = await chromium.launch();

	// 1. Desktop Test (1440x900)
	const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await pageDesktop.goto('http://localhost:4492/work/kangae', { waitUntil: 'networkidle' });

	await pageDesktop.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));

	const desktopInfo = await pageDesktop.evaluate(() => {
		const sections = Array.from(document.querySelectorAll('.cs-section')).map((s) => ({
			eyebrow: s.querySelector('.cs-section__eyebrow')?.textContent?.trim(),
			title: s.querySelector('.cs-section__title')?.textContent?.trim(),
		}));
		const hasGallery = !!document.querySelector('.cs-gallery');
		return {
			sections,
			hasGallery,
			hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth: window.innerWidth,
		};
	});
	console.log('Desktop Sections Info:', JSON.stringify(desktopInfo, null, 2));

	// Capture Section 4 specifically
	const allSections = await pageDesktop.$$('.cs-section');
	if (allSections.length >= 4) {
		const section4 = allSections[3];
		await section4.scrollIntoViewIfNeeded();
		await new Promise((r) => setTimeout(r, 300));
		await section4.screenshot({ path: path.join(OUT_DIR, 'kangae-section-interaction.png') });
		console.log('Saved kangae-section-interaction.png');
	}

	await pageDesktop.screenshot({ path: path.join(OUT_DIR, 'full-desktop.png'), fullPage: true });
	console.log('Saved full-desktop.png');

	// 2. Mobile Test (375x812)
	const pageMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
	await pageMobile.goto('http://localhost:4492/work/kangae', { waitUntil: 'networkidle' });

	await pageMobile.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 60));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 800));

	const mobileInfo = await pageMobile.evaluate(() => ({
		hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
	}));
	console.log('Mobile Info:', mobileInfo);

	await pageMobile.screenshot({ path: path.join(OUT_DIR, 'full-mobile.png'), fullPage: true });
	console.log('Saved full-mobile.png');

	// 3. Tablet Test (768x1024)
	const pageTablet = await browser.newPage({ viewport: { width: 768, height: 1024 } });
	await pageTablet.goto('http://localhost:4492/work/kangae', { waitUntil: 'networkidle' });
	const tabletInfo = await pageTablet.evaluate(() => ({
		hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
	}));
	console.log('Tablet Info:', tabletInfo);

	await browser.close();
	server.close();
	console.log('Editorial Kangae verification completed.');
});
