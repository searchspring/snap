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
				path: './packages/snap-preact-components/src/',
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
								route: link.route,
								price: 0,
								description: markdown,
								image: '',
								sku: `sku${link.route}`,
								id: link.route,
								categoryHierarchy: `${catRoot} > ${link.hierarchyLabel || link.label}`,
							});
						}
					} catch (err) {
						console.error(err);
					}
				}

				if (link.links) {
					generateLinks(link.links, `${catRoot} > ${link.label}`);
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
			// const [libraryDir, _, directory, type, componentName, markdownFile] = packagePath.split('/');
			const [libraryDir, _, grouping, ...remainingPaths] = packagePath.split('/');
			const [markdownFile, componentName, next, extra] = remainingPaths.reverse();
			// grouping = components / documentation / hooks
			// type = atom / molecule / organism or About / Theme / Usage
			let type;
			//if a component is nested inside an additional directory we need to grab the type from extra
			if (extra) {
				type = extra;
			} else {
				type = next;
			}

			const lang = libraryDir.split('-')[1];
			const route = libraryDir.split('-').reverse().slice(0, 2).join('-'); //.includes('snap-preact-components') ? 'components-preact' : ''; // TODO: refactor once more options
			const url = `./packages/${packagePath}`;
			const componentLibrary = `${lang[0].toUpperCase() + lang.slice(1)}`; // Preact
			let label = `${componentLibrary}`;
			let hierarchyLabel = componentName;

			switch (grouping) {
				case 'components': {
					// Preact Component: Results
					label += ` Component: ${componentName}`;
					hierarchyLabel = `${type} > ${componentName}`;
					break;
				}
				case 'documentation': {
					// Preact: About
					label += `: ${componentName}`;
					break;
				}
				case 'hooks': {
					// Preact Hook: useThingy
					label += ` Hook: ${componentName} Hook`;
					break;
				}
			}

			const encodedParams = encodeURIComponent(`?path=/docs/${type || grouping}-${componentName}`);

			return {
				label,
				displayName: componentName,
				hierarchyLabel,
				route: `/${route}?params=${encodedParams}`,
				type: 'iframe',
				url,
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
