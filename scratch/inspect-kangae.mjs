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
server.listen(4498, async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	await page.goto('http://localhost:4498/work/kangae', { waitUntil: 'networkidle' });

	// Force scroll down to load everything
	await page.evaluate(async () => {
		for (let i = 0; i < document.body.scrollHeight; i += 400) {
			window.scrollTo(0, i);
			await new Promise((r) => setTimeout(r, 50));
		}
		window.scrollTo(0, 0);
	});
	await new Promise((r) => setTimeout(r, 600));

	// Capture individual sections
	const sections = [
		{ sel: '.cs-hero', name: '01-hero.png' },
		{ sel: '.cs-meta', name: '02-meta.png' },
		{ sel: '.cs-section:nth-of-type(1)', name: '03-section-idea.png' },
		{ sel: '.cs-visual', name: '04-visual-feature.png' },
		{ sel: '.cs-section:nth-of-type(2)', name: '05-section-approach.png' },
		{ sel: '.cs-section:nth-of-type(3)', name: '06-section-system.png' },
		{ sel: '.cs-gallery', name: '07-gallery-artifacts.png' },
		{ sel: '.cs-highlights', name: '08-highlights-tenets.png' },
		{ sel: '.cs-reflection', name: '09-reflection.png' },
		{ sel: '.cs-next', name: '10-next.png' },
	];

	for (const s of sections) {
		const el = await page.$(s.sel);
		if (el) {
			// scroll element into view avoiding sticky nav
			await el.scrollIntoViewIfNeeded();
			await new Promise((r) => setTimeout(r, 200));
			await el.screenshot({ path: path.join(OUT_DIR, s.name) });
			console.log(`Captured ${s.name}`);
		} else {
			console.log(`Could not find ${s.sel}`);
		}
	}

	// Also check computed styles for gallery & text
	const info = await page.evaluate(() => {
		const gallery = document.querySelector('.cs-gallery');
		const galleryTitle = gallery?.querySelector('.cs-gallery__title');
		const imgs = Array.from(gallery?.querySelectorAll('img') || []).map((img) => ({
			src: img.src,
			naturalWidth: img.naturalWidth,
			naturalHeight: img.naturalHeight,
			clientWidth: img.clientWidth,
			clientHeight: img.clientHeight,
		}));

		const paragraphs = Array.from(document.querySelectorAll('.cs-section p')).map((p) => ({
			fontSize: window.getComputedStyle(p).fontSize,
			lineHeight: window.getComputedStyle(p).lineHeight,
			color: window.getComputedStyle(p).color,
			marginBottom: window.getComputedStyle(p).marginBottom,
		}));

		return {
			galleryTitleSize: galleryTitle ? window.getComputedStyle(galleryTitle).fontSize : null,
			imgs,
			paragraphs: paragraphs.slice(0, 3),
		};
	});

	console.log('Page info:', JSON.stringify(info, null, 2));

	await browser.close();
	server.close();
	console.log('Finished section captures.');
});
