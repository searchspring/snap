function flattenDocumentLinks(docs) {
	const flattened = [];
	function traverse(links) {
		if (!Array.isArray(links)) return;
		links.forEach((link) => {
			flattened.push(link);
			if (link.links && Array.isArray(link.links)) {
				traverse(link.links);
			}
		});
	}
	docs.forEach((doc) => {
		if (doc.links && Array.isArray(doc.links)) {
			traverse(doc.links);
		}
	});
	return flattened;
}

import('./docs/documents.js').then(function (_) {
	const documents = _.default;
	const replaces = flattenDocumentLinks(documents)
		.filter((link) => link.type === 'markdown')
		.map((link) => {
			return { a: `(https://searchspring.github.io/snap${link.route}`, b: `(.${link.route}` };
		})
		.flat()
		.concat([
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search)', b: '(./reference-store-search)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Autocomplete)', b: '(./reference-store-autocomplete)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Recommendation)', b: '(./reference-store-recommendation)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Finder)', b: '(./reference-store-finder)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Storage)', b: '(./reference-store-storage)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)', b: '(./reference-store-abstract)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Cart)', b: '(./reference-store-cart)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Meta)', b: '(./reference-store-meta)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Search)', b: '(./reference-controller-search)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Autocomplete)', b: '(./reference-controller-autocomplete)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Finder)', b: '(./reference-controller-finder)' },
			{
				a: '(https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation)',
				b: '(./reference-controller-recommendation)',
			},
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-url-manager)', b: '(./reference-url-manager)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-event-manager)', b: '(./reference-event-manager)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-logger)', b: '(./reference-logger)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-tracker)', b: '(./reference-tracker)' },
			{ a: '(https://github.com/searchspring/snap/tree/main/docs/SNAP_TRACKING.md)', b: '(./snap-tracking)' },
			{
				a: '(https://github.com/searchspring/snap/tree/main/docs/SNAP_TRACKING.md#cart-attribute-tracking)',
				b: '(./snap-tracking#cart-attribute-tracking)',
			},
			{ a: '(https://github.com/searchspring/snap/tree/main/packages/snap-client)', b: '(./snap-client)' },
			{
				a: '(https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url)',
				b: '(./reference-snap-preact-url-translator)',
			},
			{
				a: '(https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/QueryString)',
				b: '(./reference-url-manager-query-string-translator)',
			},
			{
				a: '(https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/linkers/react)',
				b: '(./reference-url-manager-react-linker)',
			},
			{ a: '(https://github.com/searchspring/snap/tree/main/docs/REFERENCE_CONFIGURATION_MIDDLEWARE.md)', b: '(./reference-snap-preact-middleware)' },
			{ a: '(https://searchspring.github.io/snap/preact-components)', b: '(./preact-components)' },
			{ a: '(https://searchspring.github.io/snap/preact-components?params=', b: '(./preact-components?params=' },
		]);

	const modifyLinks = (markdown) => {
		replaces.forEach(function (replace) {
			markdown = markdown.replaceAll(replace.a, replace.b);
		});
		return markdown;
	};
	const App = {
		data() {
			return {
				documents,
			};
		},
		computed: {
			routes() {
				const routeMap = this.documents.reduce((acc, section) => {
					section?.links?.forEach((link) => {
						if (link.route) {
							acc[link.route] = link;
						}

						link?.links?.forEach((sublink) => {
							if (sublink.route) {
								acc[sublink.route] = sublink;
							}
							if (sublink?.links) {
								sublink.links.forEach((subsublink) => {
									if (subsublink.route) {
										acc[subsublink.route] = subsublink;
									}
								});
							}
						});
					});

					return acc;
				}, {});

				return routeMap;
			},
		},
		template: `
            <Navigation :documents="documents"></Navigation>

			<div id="content-wrapper">
				<router-view :routes="routes"></router-view>
			</div>
            <div id="ac-overlay"></div>
        `,
	};

	const app = Vue.createApp(App);

	app.component('Content', {
		props: ['routes'],
		template: `
            <div id="content" :class="{ 'markdown': routeData.type === 'markdown' }">
                <iframe v-if="routeData.type == 'iframe'" :src="routeData.url" id="frame" @load="onLoad"></iframe>
                <Markdown v-else-if="routeData.type == 'markdown'" :src="routeData.url" />
                <div id="searchWrapper"></div>
            </div>
        `,
		computed: {
			currentRoute() {
				return this.$route.path;
			},
			routeData() {
				const params = this.$route.query.params || '';

				if (params && this.routes[this.currentRoute] && this.routes[this.currentRoute].url && this.routes[this.currentRoute].type === 'iframe') {
					const currentiFrameSrc = document.querySelector('iframe')?.src;
					let url = currentiFrameSrc || `${this.routes[this.currentRoute].url}${params}`;
					if (params.includes('&ac')) {
						url = `${this.routes[this.currentRoute].url}${params}`;
					}
					if (url.startsWith('http') && url.includes('/packages/')) {
						url = `./packages/${url.split('/packages/')[1]}`;
					}
					return { type: 'iframe', url };
				}

				return this.routes[this.currentRoute] || { type: 'markdown', url: './docs/404.md' };
			},
		},

		methods: {
			onLoad() {
				const mutations = [];
				// Select the node that will be observed for mutations
				const targetNode = document.getElementById('frame').contentWindow.document.querySelector('title');
				if (!targetNode) return;

				// Options for the observer (which mutations to observe)
				const config = { characterData: true, attributes: true, childList: true, subtree: true };

				// Callback function to execute when mutations are observed
				const callback = function (mutationsList) {
					mutations.push(mutationsList[0]);
					if (mutationsList.length && mutations.length > 1) {
						const url = mutationsList[0].target.baseURI;
						const params = encodeURIComponent(`?${url.split('?')[1]}`);
						const currentPath = window.location.pathname; // '/components-preact'
						const newRoute = `${currentPath}?params=${params}`;
						window.history.pushState({}, '', newRoute);
					}
				};

				// Create an observer instance linked to the callback function
				const observer = new MutationObserver(callback);

				// Start observing the target node for configured mutations
				observer.observe(targetNode, config);
			},
		},
	});

	app.component('Markdown', {
		props: ['src'],
		template: `
            <div id="markdown" v-html="markedHTML"></div>
        `,
		data() {
			return {
				markdown: '',
			};
		},
		watch: {
			src() {
				this.getMarkdown(this.src);
			},
		},
		computed: {
			markedHTML() {
				return marked(this.markdown).replace(/<a\s+href=['"]https:\/\/[^'"]*['"]/g, (match) => {
					// external links should open in a new tab
					return match.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ');
				});
			},
		},
		created() {
			this.getMarkdown(this.src);
		},
		updated() {
			window.postRenderModifications();
		},
		methods: {
			async getMarkdown(file) {
				if (Array.isArray(file)) {
					this.markdown = '';
					const markdowns = await Promise.all(
						file.map(async (file) => {
							const response = await fetch(file);
							let text = await response.text();
							return modifyLinks(text);
						})
					);
					this.markdown = markdowns.join('\n');
				} else {
					this.markdown = '';
					const response = await fetch(file);
					let text = await response.text();
					this.iframe = '';
					this.markdown = modifyLinks(text);
				}
			},
		},
	});

	app.component('Link', {
		props: ['link', 'active'],
		template: `
            <router-link v-if="link.route && !link.hidden" :key="link.route" :to="'' + link.route" :class="{ 'active': active }">
                {{link.label}}
            </router-link>
    
            <a v-else-if="link.type == 'external'" :href="link.url" target="_blank">
                {{link.label}}
                <i v-if="link.icon" :class="link.icon"></i>
            </a>
        `,
	});

	app.component('Navigation', {
		props: ['documents'],
		components: ['Link'],
		data() {
			return {
				navVisible: window.innerWidth < 768 ? false : true,
			};
		},
		computed: {
			currentRoute() {
				return this.$route.path;
			},
		},
		methods: {
			toggleNav() {
				this.navVisible = !this.navVisible;
			},
			inRoute(link) {
				if (link?.route) {
					const includedRoutes = [link.route];

					link.links?.forEach((sublink) => {
						includedRoutes.push(sublink.route);
						if (sublink?.links) {
							sublink.links.forEach((subsublink) => includedRoutes.push(subsublink.route));
						}
					});

					return includedRoutes.includes(this.currentRoute);
				}
			},
		},
		template: `
            <div id="navigation-wrapper">
                <router-link :key="'/'" :to="'/'">
                    <div id="header">
                        <div class="logo-container">
                            <img src="./images/logo-snap.svg"/>
                        </div>
                    </div>
                </router-link>
				<span class="collapseNav" @click="toggleNav"><i class="fas fa-bars fa-2x"></i></span>
                <div id="search-container">
				</div>
                <div id="navigation" :class="{ visible: navVisible }" >
                    <div v-for="section in documents" class="section">
                        <h3>{{ section.categoryName }}</h3>
                        <ul class="links">
                            <li v-for="link in section.links">
                                <Link :link="link" :active="inRoute(link)" />

                                <ul v-if="link.links && inRoute(link)" class="sublinks">
                                    <li v-for="sublink in link.links">
                                        <Link :link="sublink" :active="inRoute(sublink)"/>
                                        <ul v-if="sublink?.links && inRoute(sublink)" class="sublinks">
                                            <li v-for="subsublink in sublink.links">
                                                <Link :link="subsublink" :active="inRoute(subsublink)"/>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `,
	});

	const routes = [
		{ path: '/', component: app.component('Content') },
		{ path: '/:path', component: app.component('Content') },
		{ path: '/:pathMatch(.*)', component: app.component('Content') },
	];

	const router = VueRouter.createRouter({
		history: VueRouter.createWebHistory(window.location.hostname !== 'localhost' ? `/${window.location.pathname.split('/')[1]}/` : undefined),
		routes,
	});
	router.afterEach((to, from) => {
		if (to.path !== from.path) {
			// close navigation on mobile upon changing routes (not applicable to initial load)
			if (window.innerWidth < 768 && document.getElementById('navigation')?.classList.contains('visible')) {
				document.querySelector('.collapseNav')?.click();
			}

			// invoked here to handle removal when iframe is rendered
			document.querySelector('.legend')?.remove();
		}
	});

	app.use(router);

	app.mount('#app');

	const SCROLL_TO_HEADING_DELAY = 2000;
	const DEBOUNCE_DELAY = 100;
	window.postRenderModifications = function () {
		let headingIdsInView = [];
		let lastScrolledUp = true;
		let lastScrollY = window.scrollY;
		let hashId = window.location.hash.split('#')[1];
		let preventLegendUpdate = Boolean(hashId); // if there is a hash id, prevent the legend from updating while scrolling
		if (hashId) {
			// scroll to heading if it exists in the url
			const heading = document.getElementById(hashId);
			if (heading && createHeadingId(heading) === hashId) {
				heading.scrollIntoView({ behavior: 'smooth' });
				heading.classList.add('scrolled-to');
				window.setTimeout(function () {
					heading.classList.remove('scrolled-to');
					preventLegendUpdate = false;
				}, SCROLL_TO_HEADING_DELAY);
			} else {
				// handle redirects of old routes
				if (hashId === '/') {
					router.replace('/');
				} else if (hashId.match(/^\/components-preact/)) {
					router.replace(hashId.replace(/^\/components-preact/, '/preact-components'));
				} else if (hashId.match(/^\/integration-recommendations/)) {
					router.replace('/snap-recommendations-integration');
				} else if (hashId.match(/^\/snap-recommendations-legacy/)) {
					router.replace('/snap-recommendations-legacy');
				} else if (hashId.match(/^\/start-preact/)) {
					router.replace('/getting-started');
				} else if (hashId.match(/^\/start-preact-events/)) {
					router.replace('/reference-snap-preact-middleware');
				} else if (hashId.match(/^\/start-github/)) {
					router.replace('/build-deploy');
				} else if (hashId.match(/^\/start-setup/)) {
					router.replace('/snap-setup');
				}
			}
		}

		// highlight code blocks
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightElement(block);
		});

		const handleScroll = debounce(() => {
			if (window.scrollY > lastScrollY) {
				lastScrolledUp = false;
			} else {
				lastScrolledUp = true;
			}
			lastScrollY = window.scrollY;
		}, DEBOUNCE_DELAY);

		window.addEventListener('scroll', handleScroll);

		function updateLegend(id) {
			if (preventLegendUpdate && !id) return;

			document.querySelectorAll(`.legend a`).forEach((item) => {
				item.classList.remove('active');
			});
			const activeHeadingId = id || headingIdsInView[lastScrolledUp ? 0 : headingIdsInView.length - 1];
			const legendItem = document.querySelector(`.legend a[data-id="${activeHeadingId}"]`);
			if (legendItem) {
				legendItem.classList.add('active');
			}
		}

		// update active legend item when clicked
		// setTimeout is needed to prevent the legend from updating if observer fires
		window.updateLegend = (id) => {
			router.push({ hash: '#' + id });
			document.getElementById(id).scrollIntoView({ behavior: 'instant' });
			setTimeout(() => updateLegend(id), 1);
		};

		// adds ids to headings for permalinks and handles clicks to copy to clipboard
		const headingsRaw = Array.from(document.querySelectorAll('#content h2, #content h3, #content h4, #content h5, #content h6'));
		const headings = headingsRaw.map((heading) => {
			heading.role = 'link';
			const id = createHeadingId(heading);
			heading.id = id;
			heading.addEventListener('click', () => {
				const url = window.location.origin + window.location.pathname + '#' + id;
				navigator.clipboard.writeText(url);
				router.push({ hash: '#' + id });
				const span = document.createElement('span');
				span.textContent = 'Permalink copied!';
				span.classList.add('permalink');
				heading.prepend(span);
				window.setTimeout(function () {
					span.remove();
				}, SCROLL_TO_HEADING_DELAY);
			});
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						headingIdsInView.push(entry.target.id);
					} else {
						headingIdsInView = headingIdsInView.filter((item) => item !== entry.target.id);
					}
					headingIdsInView.sort((a, b) => {
						const aIndex = headingsRaw.findIndex((h) => h.id === a);
						const bIndex = headingsRaw.findIndex((h) => h.id === b);
						return aIndex - bIndex;
					});
					updateLegend();
				});
			});
			observer.observe(heading);
			return heading;
		});

		// adds a legend to the top of the page with links to the headings
		if (headings.length) {
			const legend = document.createElement('div');
			legend.classList.add('legend');
			const title = document.querySelector('#content h1')?.textContent;
			legend.innerHTML =
				`<div class="legend-container">` +
				(title ? `<div class="legend-title">${title}</div>` : '') +
				`
						<ul>
							${headings
								.map((h) => {
									const id = h.id;
									const text = h.textContent;
									const level = h.tagName.toLowerCase();
									return `<li class="${level}" onclick="updateLegend('${id}')"><a href="javascript:void(0)" data-id="${id}" class="${
										hashId === id ? 'active' : ''
									}">${text}</a></li>`;
								})
								.join('')}
						</ul>
				</div>`;
			document.getElementById('content').prepend(legend);
			// scroll active legend item into view
			const activeLegendItem = document.querySelector('.legend a.active');
			if (activeLegendItem) {
				activeLegendItem.scrollIntoView({ behavior: 'instant' });
			}
		}
	};

	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	function createHeadingId(heading) {
		return heading.id || 'id-' + heading.textContent.toLowerCase().replace(/ /g, '-');
	}
});
