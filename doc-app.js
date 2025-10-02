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

            <div id="content">
                <router-view :routes="routes"></router-view>
            </div>
            <div id="ac-overlay"></div>
        `,
	};

	const app = Vue.createApp(App);

	app.component('Content', {
		props: ['routes'],
		template: `
            <iframe v-if="routeData.type == 'iframe'" :src="routeData.url" id="frame" @load="onLoad"></iframe>
            <Markdown v-else-if="routeData.type == 'markdown'" :src="routeData.url" />
            <div id="searchWrapper"></div>
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
				navVisible: true,
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
		history: VueRouter.createWebHistory(),
		routes,
	});

	app.use(router);

	app.mount('#app');

	window.postRenderModifications = function () {
		// highlight code blocks
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightBlock(block);
		});

		function createHeadingId(heading) {
			return heading.id || 'id-' + heading.textContent.toLowerCase().replace(/ /g, '-');
		}
		// add permalinks to headings and handle clicks to copy to clipboard
		document.querySelectorAll('#content h2, #content h3, #content h4, #content h5, #content h6').forEach((heading) => {
			heading.role = 'link';
			const id = createHeadingId(heading);
			if (id) {
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
					}, 1000);
				});
			}
		});

		// scroll to heading if it exists in the url
		const id = window.location.hash.split('#')[1];
		if (id) {
			const heading = document.getElementById(id);
			if (heading && createHeadingId(heading) === id) {
				heading.scrollIntoView({ behavior: 'smooth' });
				heading.classList.add('scrolled-to');
				window.setTimeout(function () {
					heading.classList.remove('scrolled-to');
				}, 1000);
			} else {
				// handle redirects of old routes
				if (id === '/') {
					router.replace('/');
				} else if (id.match(/^\/components-preact/)) {
					router.replace(id.replace(/^\/components-preact/, '/preact-components'));
				} else if (id.match(/^\/integration-recommendations/)) {
					router.replace('/snap-recommendations');
				} else if (id.match(/^\/integration-legacy-recommendations/)) {
					router.replace('/integration-legacy-recommendations');
				} else if (id.match(/^\/start-preact/)) {
					router.replace('/getting-started');
				} else if (id.match(/^\/start-preact-events/)) {
					router.replace('/reference-snap-preact-middleware');
				} else if (id.match(/^\/start-github/)) {
					router.replace('/build-deploy');
				} else if (id.match(/^\/start-setup/)) {
					router.replace('/setup');
				}

				// integration tracking
			}
		}
	};
});
