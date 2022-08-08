<h2 id="SearchTypicalUsage">Search</h2>

To set up Search using Snap, we'll need to create a `SearchController` instance, which requires `SearchControllerConfig` and `ControllerServices` objects to instantiate. For more details see the [`SearchController docs`](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Search).

### Config (SearchControllerConfig)
Let's define a `SearchControllerConfig` object:
```typescript
const searchConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {
		redirects: {
			merchandising: true,
			singleResult: true,
		},
		facets: {
			trim: true,
		}
	},
};
```


### Category Pages / Background Filters
Optionally, apply filters from the page's content to the SearchControllerConfig `globals.filters` property. The controller globals are similar to the client globals in that all search requests will include the parameters specified. This can be used to configure category/brand pages, or other special filtering to apply to the current page's search requests.

For example, if a global variable `snapConfig` exists on the page (must be defined prior to our Snap script):

```html
<script>
	const snapConfig = {
		shopper: {
			id: 'shopper@emailprovider.com'
		},
		category: {
			name: 'Shirts',
			value: 'Clothing/Shirts'
		}
	}
</script>
```

```typescript
if (snapConfig?.category) {
	searchConfig.globals.filters.push({
		type: 'value',
		background: true,
		field: 'categories_hierarchy',
		value: snapConfig.category.value,
	});
}
```


### ControllerServices
The `ControllerServices` object contains all of the controller's dependencies.

Note that the `UrlManager` is created separately because it is a shared dependency; it is also a service needed for the `SearchStore`. The `UrlManager` is utilizing the `UrlTranslator` which will use `'q'` as the default URL query parameter. This can be overwritten to use `'search_query'` by providing a `parameters.core.query` [config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) such as in this example:

```typescript
const searchUrlManager = new UrlManager(new UrlTranslator({ parameters: core: { query: { name: 'search_query' } } }), reactLinker);
const searchControllerServices = {
	client,
	store: new SearchStore(searchConfig, { urlManager, searchUrlManager }),
	urlManager: searchUrlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker
}
```

Note: `client` and `tracker` are shared services and are defined in previous steps.

### Instantiation
With the `SearchControllerConfig` and `ControllerServices` defined, we can now create an instance of a `SearchController`.

```typescript
const searchController = new SearchController(searchConfig, searchControllerServices);
```

<h3 id="SearchMiddleware">Middleware</h3>

Now that our `SearchController` is instantiated (using `searchController` variable), we can optionally attach middleware to hook into various events. There are two ways of doing this, using the Controller's `on` or `plugin` methods.

#### via `on` method:

```typescript
searchController.on('afterStore', async ({ controller }, next) => {
	controller.log.debug('store', controller.store.toJSON());
	await next();
})
```

#### via `plugin` method (to attach groups of middleware):

```typescript
const middleware = (controller) => {
	controller.on('init', async({ controller }, next) => {
		controller.log.imageText({
			url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
			text: 'snap integration initialized',
			style: `color: ${controller.log.colors.indigo}; font-weight: bold;`,
		});

		await next();
	});
	// log the store
	controller.on('afterStore', async({ controller }, next) => {
		controller.log.debug('store', controller.store.toJSON());
		await next();
	});
};

searchController.plugin(middleware);
```

<h3 id="SearchDomTargeter">DomTargeter</h3>

`DomTargeter` is a utility for rending components in specified DOM targets. The following example shows how to use the DomTargeter with a `SearchController` and passing that controller as a prop to a `Content` component (not shown). It uses the Preact render function to render the component after the target has been found.

For further usage and documentation, see [DomTargeter](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/DomTargeter).

```typescript
const contentTarget = new DomTargeter(
	[
		{
			selector: '#searchspring-content', // CSS selector for element to render component into
		},
	],
	(target, elem) => {
		// run search after finding target
		controller.search();
		render(<Content controller={searchController} />, elem);
	}
);
```

### Initialize
Optionally initialize the controller by invoking its `init` method. This will subscribe to any `UrlManager` state changes and fire the `init` event and any attached middleware. This will happen automatically when invoking the `search` method for the first time.

```typescript
searchController.init();
```

### Perform Search

Invoking the SearchController `search` method will perform a search. In this example, this is being done after the Domtargeter finds the element selector `#searchspring-content`. Simultaneously the `Content` component will be rendered into the element selector.
