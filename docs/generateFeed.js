import fs, { promises as fsp } from 'fs';
import path from 'path';
import documents from './documents.js';

const OUTPUT_FILE = 'snap-docs.json';

(async () => {
	let docEntries = [];

	try {
		// gather snap component readmes
		const componentLinks = {
			categoryName: 'Components',
			searchable: true,
			links: [],
		};

		const componentLibraries = [
			{
				name: 'Preact',
				route: '/components-preact',
				path: './packages/snap-preact-components/src/components',
			},
		];

		for await (const libraryLinks of componentLibraries) {
			componentLinks.links.push(await buildComponentLibraryLinks(libraryLinks));
		}
		// documents.filter(doc => doc.categoryName === 'Components')[0].links.push(componentLinks.links);
		documents.push(componentLinks);

		// generate links
		documents.forEach((category) => {
			const catRoot = category.categoryName;
			generateLinks(category.links, catRoot);
		});

		let writeStream = fs.createWriteStream(path.join('docs', OUTPUT_FILE));
		docEntries.forEach((entry) => {
			writeStream.write(JSON.stringify(entry) + '\n');
		});

		writeStream.on('finish', () => {
			console.log(`Generated feed file: ${OUTPUT_FILE}`);
		});

		writeStream.end();
	} catch (err) {
		console.log(err);
	}

	function generateLinks(links, catRoot) {
		links.forEach((link) => {
			if (link.searchable) {
				if (link.url) {
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
				}

				if (link.links) {
					generateLinks(link.links, `${catRoot}>${link.label}`);
				}
			}
		});
	}

	async function findMarkdownFiles(dir) {
		// get all markdown files found in a directory
		try {
			const details = await fsp.stat(dir);
			if (!details || !details.isDirectory) {
				throw 'Directory not provided.';
			}

			let markdownFiles = [];

			const contents = await fsp.readdir(dir);
			const readPromises = contents
				.filter((file) => {
					const filePath = path.resolve(dir, file);
					try {
						const fileStats = fs.statSync(filePath);

						if (!fileStats.isSymbolicLink() && fileStats.isDirectory()) {
							return file;
						} else if (file.match(/\.md$/)) {
							markdownFiles.push(filePath);
						}
					} catch (err) {
						// not doing anything currently...
					}
				})
				.map((file) => {
					return findMarkdownFiles(path.resolve(dir, file));
				});

			const dirContents = await Promise.all(readPromises);

			return [...markdownFiles, ...dirContents.flat(1)];
		} catch (err) {
			throw `Error: cannot find templates in: ${dir}`;
		}
	}

	async function buildComponentLibraryLinks(details) {
		const paths = await findMarkdownFiles(details.path);
		const links = paths.map((path) => {
			const packagePath = path.split('/snap/packages/')[1];
			const [libraryDir, _, __, type, componentName, ___] = packagePath.split('/');
			const lang = libraryDir.split('-')[1];

			const encodedParams = encodeURIComponent(`?path=/docs/${type}-${componentName}`);

			return {
				label: `${componentName} ${lang[0].toUpperCase() + lang.slice(1)} Component`,
				route: `/${libraryDir}?params=${encodedParams}`,
				type: 'iframe',
				url: `./packages/${libraryDir}/src/components/${type}/${componentName}/readme.md`,
				searchable: true,
			};
		});

		const componentLibrary = {
			label: details.name,
			route: details.route,
			searchable: true,
			links,
		};

		return componentLibrary;
	}
})();
