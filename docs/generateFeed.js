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
				route: '/preact-components',
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
			// Process the current link if it's searchable
			if (link.searchable) {
				// Handle single URL or array of URLs
				const urls = Array.isArray(link.url) ? link.url : [link.url];

				urls.forEach((url) => {
					if (url) {
						try {
							const markdown = fs.readFileSync(`${url}`, 'utf8');
							if (markdown) {
								// Parse markdown into sections
								const sections = parseMarkdownSections(markdown, link.label, link.route);

								sections.forEach((section) => {
									docEntries.push({
										name: section.title,
										route: link.route + (section.anchor ? `#${section.anchor}` : ''),
										price: 0,
										description: section.content,
										image: '',
										sku: `sku${link.route}${section.anchor ? `-${section.anchor}` : ''}`,
										id: link.route + (section.anchor ? `-${section.anchor}` : ''),
										categoryHierarchy: `${catRoot} > ${link.hierarchyLabel || link.label}${
											section.title !== link.label ? ` > ${section.title}` : ''
										}`,
									});
								});
							}
						} catch (err) {
							console.error(`Error reading file ${url}:`, err);
						}
					}
				});
			}

			// Recursively process nested links
			if (link.links && Array.isArray(link.links)) {
				generateLinks(link.links, `${catRoot} > ${link.label}`);
			}
		});
	}

	function parseMarkdownSections(markdown, fileTitle, fileRoute) {
		const sections = [];
		const lines = markdown.split('\n');
		let currentSection = null;
		let currentContent = [];
		let sectionLevel = 0;

		// Helper function to create anchor from title
		function createAnchor(title) {
			return title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.replace(/^-|-$/g, '');
		}

		// Helper function to save current section
		function saveCurrentSection() {
			if (currentSection && currentContent.length > 0) {
				sections.push({
					title: currentSection,
					content: currentContent.join('\n').trim(),
					anchor: createAnchor(currentSection),
				});
			}
		}

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

			if (headingMatch) {
				// Save previous section if it exists
				saveCurrentSection();

				// Start new section
				const level = headingMatch[1].length;
				const title = headingMatch[2].trim();

				// Only process h1-h3 headings as main sections
				if (level <= 3) {
					currentSection = title;
					currentContent = [line];
					sectionLevel = level;
				} else {
					// For deeper headings, add to current section content
					if (currentSection) {
						currentContent.push(line);
					}
				}
			} else {
				// Add line to current section content
				if (currentSection) {
					currentContent.push(line);
				} else {
					// If we haven't found a heading yet, treat the whole file as one section
					if (i === 0) {
						currentSection = fileTitle;
						currentContent = [line];
					}
				}
			}
		}

		// Save the last section
		saveCurrentSection();

		// If no sections were found, treat the entire content as one section
		if (sections.length === 0) {
			sections.push({
				title: fileTitle,
				content: markdown.trim(),
				anchor: null,
			});
		}

		return sections;
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
			// Handle both absolute and relative paths
			let packagePath;
			if (path.includes('/snap/packages/')) {
				packagePath = path.split('/snap/packages/')[1];
			} else if (path.includes('/packages/')) {
				packagePath = path.split('/packages/')[1];
			} else {
				console.warn(`Path does not contain expected package structure: ${path}`);
				return null;
			}

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
			links: links.filter((link) => link !== null),
		};

		return componentLibrary;
	}
})();
