var documents = [
	{
		categoryName: 'Welcome',
		links: [
			{
				label: 'About Snap',
				route: '/',
				type: 'markdown',
				url: './docs/ABOUT.md',
				searchable: false,
			},
		],
	},
	{
		categoryName: 'Getting Started',
		links: [
			{
				label: 'Setup',
				route: '/start-setup',
				type: 'markdown',
				url: './docs/SETUP.md',
				searchable: true,
			},
			{
				label: 'Github Setup',
				route: '/start-github',
				type: 'markdown',
				url: './docs/GITHUB.md',
				searchable: true,
			},
			{
				label: 'Preact',
				route: '/start-preact',
				type: 'markdown',
				url: './docs/PREACT.md',
				searchable: true,
				links: [
					{
						label: 'Configuration',
						route: '/start-preact-config',
						type: 'markdown',
						url: './docs/PREACT_CONFIG.md',
						searchable: true,
					},
					{
						label: 'Controller Props',
						route: '/start-preact-controller-props',
						type: 'markdown',
						url: './docs/PREACT_CONTROLLER_PROPS.md',
						searchable: true,
					},
					{
						label: 'Displaying Data',
						route: '/start-preact-displaying-data',
						type: 'markdown',
						url: './docs/PREACT_DISPLAYING_DATA.md',
						searchable: true,
					},
					{
						label: 'Events',
						route: '/start-preact-events',
						type: 'markdown',
						url: './docs/PREACT_EVENTS.md',
						searchable: true,
					},
					{
						label: 'Recommendations',
						route: '/start-preact-recommendations',
						type: 'markdown',
						url: './docs/PREACT_RECOMMENDATIONS.md',
						searchable: true,
					},
					{
						label: 'Badges',
						route: '/start-preact-badges',
						type: 'markdown',
						url: './docs/PREACT_BADGES.md',
						searchable: true,
					},
				],
			},
			{
				label: 'Advanced',
				route: '/advanced',
				type: 'markdown',
				url: './docs/ADVANCED.md',
				searchable: true,
				links: [
					{
						label: 'Installation',
						route: '/advanced-installation',
						type: 'markdown',
						url: './docs/ADVANCED_INSTALLATION.md',
						searchable: true,
					},
					{
						label: 'Client',
						route: '/advanced-client',
						type: 'markdown',
						url: './docs/ADVANCED_CLIENT.md',
						searchable: true,
					},
					{
						label: 'Tracker',
						route: '/advanced-tracker',
						type: 'markdown',
						url: './docs/ADVANCED_TRACKER.md',
						searchable: true,
					},
					{
						label: 'Search',
						route: '/advanced-search',
						type: 'markdown',
						url: './docs/ADVANCED_SEARCH.md',
						searchable: true,
					},
					{
						label: 'Autocomplete',
						route: '/advanced-autocomplete',
						type: 'markdown',
						url: './docs/ADVANCED_AUTOCOMPLETE.md',
						searchable: true,
					},
					{
						label: 'Finder',
						route: '/advanced-finder',
						type: 'markdown',
						url: './docs/ADVANCED_FINDER.md',
						searchable: true,
					},
				],
			},
			{
				label: 'Integration',
				route: '/integration',
				type: 'markdown',
				url: './docs/INTEGRATION.md',
				searchable: true,
				links: [
					{
						label: 'Context Variables',
						route: '/integration-context',
						type: 'markdown',
						url: './docs/INTEGRATION_CONTEXT.md',
						searchable: true,
					},
					{
						label: 'Background Filters',
						route: '/integration-backgroundFilters',
						type: 'markdown',
						url: './docs/INTEGRATION_BACKGROUND_FILTERS.md',
						searchable: true,
					},
					{
						label: 'Foreground Filters',
						route: '/integration-foregroundFilters',
						type: 'markdown',
						url: './docs/INTEGRATION_FOREGROUND_FILTERS.md',
						searchable: true,
					},
					{
						label: 'Recommendations',
						route: '/integration-recommendations',
						type: 'markdown',
						url: './docs/INTEGRATION_RECOMMENDATIONS.md',
						searchable: true,
					},
					{
						label: 'Recommendations (legacy)',
						route: '/integration-legacy-recommendations',
						type: 'markdown',
						url: './docs/INTEGRATION_LEGACY_RECOMMENDATIONS.md',
						searchable: true,
						hidden: true,
					},
					{
						label: 'Tracking',
						route: '/integration-tracking',
						type: 'markdown',
						url: './docs/INTEGRATION_TRACKING.md',
						searchable: true,
					},
					{
						label: 'Debugging',
						route: '/integration-debugging',
						type: 'markdown',
						url: './docs/INTEGRATION_DEBUGGING.md',
						searchable: true,
					},
				],
			},
			{
				label: 'Troubleshooting',
				route: '/troubleshooting',
				type: 'markdown',
				url: './docs/TROUBLESHOOTING.md',
				searchable: true,
			},
		],
	},
	{
		categoryName: 'Packages',
		links: [
			{
				label: 'Preact',
				route: '/package-preact',
				type: 'markdown',
				url: './packages/snap-preact/README.md',
				searchable: true,
				links: [
					{
						label: 'Instantiators',
						route: '/package-preact-instantiator',
						type: 'markdown',
						url: './packages/snap-preact/src/Instantiators/README.md',
						searchable: true,
					},
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-preact/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Controller',
				route: '/package-controller',
				type: 'markdown',
				url: './packages/snap-controller/README.md',
				searchable: true,
				links: [
					{
						label: 'Abstract',
						route: '/package-controller-abstract',
						type: 'markdown',
						url: './packages/snap-controller/src/Abstract/README.md',
						searchable: true,
					},
					{
						label: 'Autocomplete',
						route: '/package-controller-autocomplete',
						type: 'markdown',
						url: './packages/snap-controller/src/Autocomplete/README.md',
						searchable: true,
					},
					{
						label: 'Finder',
						route: '/package-controller-finder',
						type: 'markdown',
						url: './packages/snap-controller/src/Finder/README.md',
						searchable: true,
					},
					{
						label: 'Recommendation',
						route: '/package-controller-recommendation',
						type: 'markdown',
						url: './packages/snap-controller/src/Recommendation/README.md',
						searchable: true,
					},
					{
						label: 'Search',
						route: '/package-controller-search',
						type: 'markdown',
						url: './packages/snap-controller/src/Search/README.md',
						searchable: true,
					},
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-controller/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Client',
				route: '/package-client',
				type: 'markdown',
				url: './packages/snap-client/README.md',
				searchable: true,
				links: [
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-client/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Store',
				route: '/package-storeMobx',
				type: 'markdown',
				url: './packages/snap-store-mobx/README.md',
				searchable: true,
				links: [
					{
						label: 'Abstract',
						route: '/package-storeMobx-abstract',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Abstract/README.md',
						searchable: true,
					},
					{
						label: 'Autocomplete',
						route: '/package-storeMobx-autocomplete',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Autocomplete/README.md',
						searchable: true,
					},
					{
						label: 'Finder',
						route: '/package-storeMobx-finder',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Finder/README.md',
						searchable: true,
					},
					{
						label: 'Recommendation',
						route: '/package-storeMobx-recommendation',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Recommendation/README.md',
						searchable: true,
					},
					{
						label: 'Search',
						route: '/package-storeMobx-search',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Search/README.md',
						searchable: true,
					},
					{
						label: 'Meta',
						route: '/package-storeMobx-meta',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Meta/README.md',
						searchable: true,
					},
					{
						label: 'Storage',
						route: '/package-storeMobx-storage',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Storage/README.md',
						searchable: true,
					},
					{
						label: 'Cart',
						route: '/package-storeMobx-cart',
						type: 'markdown',
						url: './packages/snap-store-mobx/src/Cart/README.md',
						searchable: true,
					},
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-store-mobx/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Url Manager',
				route: '/package-urlManager',
				type: 'markdown',
				url: './packages/snap-url-manager/README.md',
				searchable: true,
				links: [
					{
						label: 'Translators',
						route: '/package-urlManager-translators',
						type: 'markdown',
						url: './packages/snap-url-manager/src/Translators/README.md',
						searchable: true,
					},
					{
						label: 'QueryString Translator',
						route: '/package-urlManager-translators-queryString',
						type: 'markdown',
						url: './packages/snap-url-manager/src/Translators/QueryString/README.md',
						searchable: true,
					},
					{
						label: 'Url Translator',
						route: '/package-urlManager-translators-url',
						type: 'markdown',
						url: './packages/snap-url-manager/src/Translators/Url/README.md',
						searchable: true,
					},
					{
						label: 'Linkers',
						route: '/package-urlManager-linkers',
						type: 'markdown',
						url: './packages/snap-url-manager/src/linkers/README.md',
						searchable: true,
					},
					{
						label: 'React Linker',
						route: '/package-urlManager-linkers-react',
						type: 'markdown',
						url: './packages/snap-url-manager/src/linkers/react/README.md',
						searchable: true,
					},
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-url-manager/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Event Manager',
				route: '/package-eventManager',
				type: 'markdown',
				url: './packages/snap-event-manager/README.md',
				searchable: true,
				links: [
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-event-manager/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Platforms',
				route: '/package-platforms',
				type: 'markdown',
				url: './packages/snap-platforms/README.md',
				searchable: true,
				links: [
					{
						label: 'BigCommerce',
						route: '/package-platforms-bigcommerce',
						type: 'markdown',
						url: './packages/snap-platforms/bigcommerce/README.md',
						searchable: true,
					},
					{
						label: 'Magento2',
						route: '/package-platforms-magento2',
						type: 'markdown',
						url: './packages/snap-platforms/magento2/README.md',
						searchable: true,
					},
					{
						label: 'Shopify',
						route: '/package-platforms-shopify',
						type: 'markdown',
						url: './packages/snap-platforms/shopify/README.md',
						searchable: true,
					},
				],
			},
			{
				label: 'Profiler',
				route: '/package-profiler',
				type: 'markdown',
				url: './packages/snap-profiler/README.md',
				searchable: true,
				links: [
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-profiler/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Logger',
				route: '/package-logger',
				type: 'markdown',
				url: './packages/snap-logger/README.md',
				searchable: true,
				links: [
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-logger/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Tracker',
				route: '/package-tracker',
				type: 'markdown',
				url: './packages/snap-tracker/README.md',
				searchable: true,
				links: [
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-tracker/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
			{
				label: 'Toolbox',
				route: '/package-toolbox',
				type: 'markdown',
				url: './packages/snap-toolbox/README.md',
				searchable: true,
				links: [
					{
						label: 'Cookies',
						route: '/package-toolbox-cookies',
						type: 'markdown',
						url: './packages/snap-toolbox/src/cookies/README.md',
						searchable: true,
					},
					{
						label: 'DomTargeter',
						route: '/package-toolbox-domTargeter',
						type: 'markdown',
						url: './packages/snap-toolbox/src/DomTargeter/README.md',
						searchable: true,
					},
					{
						label: 'Feature Flags',
						route: '/package-toolbox-featureFlags',
						type: 'markdown',
						url: './packages/snap-toolbox/src/featureFlags/README.md',
						searchable: true,
					},
					{
						label: 'Filters',
						route: '/package-toolbox-filters',
						type: 'markdown',
						url: './packages/snap-toolbox/src/filters/README.md',
						searchable: true,
					},
					{
						label: 'Script Context',
						route: '/package-toolbox-getContext',
						type: 'markdown',
						url: './packages/snap-toolbox/src/getContext/README.md',
						searchable: true,
					},
					{
						label: 'Until',
						route: '/package-toolbox-until',
						type: 'markdown',
						url: './packages/snap-toolbox/src/until/README.md',
						searchable: true,
					},
					{
						label: 'Typedocs',
						type: 'external',
						url: 'https://searchspring.github.io/snap/packages/snap-toolbox/docs/',
						icon: 'fas fa-external-link-alt fa-1x',
						searchable: false,
					},
				],
			},
		],
	},
	{
		categoryName: 'Components',
		searchable: false,
		links: [
			{
				label: 'Preact',
				route: '/components-preact',
				type: 'iframe',
				url: './packages/snap-preact-components/docs/',
				searchable: false,
			},
		],
	},
	// {
	// 	categoryName: 'API',
	// 	searchable: false,
	// 	links: [
	// 		{
	// 			label: 'Documentation',
	// 			route: '/api-docs',
	// 			type: 'iframe',
	// 			url: 'https://searchspring.github.io/snapi-oas/',
	// 			searchable: false,
	// 		},
	// 		{
	// 			label: 'Explorer',
	// 			route: '/api-explorer',
	// 			type: 'iframe',
	// 			url: 'https://searchspring.github.io/snapi-explorer/',
	// 			searchable: false,
	// 		},
	// 	],
	// },
	{
		categoryName: 'Development',
		searchable: false,
		links: [
			{
				label: 'Change Log',
				route: '/dev-changelog',
				type: 'markdown',
				url: './CHANGELOG.md',
				searchable: false,
			},
		],
	},
	{
		categoryName: 'Links',
		searchable: false,
		links: [
			/* TODO
            {
                label: 'Demo',
                type: 'external',
                url: 'http://try.searchspring.com',
                icon: 'fas fa-external-link-alt fa-1x',
                searchable: false
            },
        */
			{
				label: 'Accessibility Statement',
				route: '/about-accessibility',
				type: 'markdown',
				url: './docs/ACCESSIBILITY_STATEMENT.md',
				searchable: true,
			},
			{
				label: 'Github Repository',
				type: 'external',
				url: 'https://github.com/searchspring/snap',
				icon: 'fas fa-external-link-alt fa-1x',
				searchable: false,
			},
			{
				label: 'Discussions',
				type: 'external',
				url: 'https://github.com/searchspring/snap/discussions',
				icon: 'fas fa-external-link-alt fa-1x',
				searchable: false,
			},
			{
				label: 'Report an Issue',
				type: 'external',
				url: 'https://github.com/searchspring/snap/issues',
				icon: 'fas fa-external-link-alt fa-1x',
				searchable: false,
			},
		],
	},
];
export default documents;
