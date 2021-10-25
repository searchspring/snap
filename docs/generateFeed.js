import fs from 'fs';
import path from 'path';
import documents from './documents.js';

let docEntries = [];

documents.forEach((category) => {
	const catRoot = category.categoryName;
	generateLinks(category.links, catRoot);
});

const OUTPUT_FILE = 'feed.json';
let writeStream = fs.createWriteStream(path.join('docs', OUTPUT_FILE));
docEntries.forEach((entry) => {
	writeStream.write(JSON.stringify(entry) + '\n');
});

writeStream.on('finish', () => {
	console.log(`Generated feed file: ${OUTPUT_FILE}`);
});

writeStream.end();

function generateLinks(links, catRoot) {
	links.forEach((link) => {
		if (link.searchable) {
			try {
				const markdown = fs.readFileSync(`${link.url}`, 'utf8');
				if (markdown) {
					docEntries.push({
						name: link.label,
						url: `https://raw.githubusercontent.com/searchspring/snap/main/docs/${link.url.replace('./docs/', '')}`,
						route: link.route,
						price: 0,
						description: markdown,
						image: '',
						sku: `sku${link.route}`,
						id: link.route,
						categoryHierarchy: `${catRoot}>${link.label}`,
					});
				}
			} catch (err) {
				console.error(err);
			}
			if (link.links) {
				generateLinks(link.links, `${catRoot}>${link.label}`);
			}
		}
	});
}
