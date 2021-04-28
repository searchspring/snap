<h2 id="SearchTypicalUsage">Search</h2>

To set up Search using Snap, we'll need to utilize a `SearchController` which requires `SearchControllerConfig` and `ControllerServices` objects to instantiate.
```typescript
const searchController = new SearchController(searchConfig, searchControllerServices);
```
### Config (SearchControllerConfig)
Lets define a `SearchControllerConfig` object:
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

Note that the `UrlManager` is utilizing the `UrlTranslator` which will use `'q'` as the default URL query parameter. This can be overwritten by providing a `queryParameter` config such as in this example:

```typescript
const searchControllerServices = {
	client,
	store: new SearchStore(),
	urlManager: new UrlManager(new UrlTranslator({ queryParameter: 'search_query' }), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

<h3 id="SearchMiddleware">Middleware</h3>

Now that our `SearchController` is defined (using `search` variable), we can optionally attach middleware to hook into various [events](/packages/snap-controller/#searchcontroller-event-lifecycle). There are two ways of doing this, using the Controller's `on` or `use` methods.

#### via `on` method:

```typescript
searchController.on('afterStore', async ({ controller }, next) => {
	controller.log.debug('store', controller.store.toJSON());
	await next();
})
```

#### via `use` method (to attach groups of middleware):

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

searchController.use(middleware);
```

<h3 id="SearchDomTargeter">DomTargeter</h3>

`DomTargeter` is a utility for rending components in specified DOM targets. The following example shows how to use the DomTargeter inside of the 'init' middleware of the `SearchController`.

For further usage and documentation, see [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter)

```typescript
searchController.on('init', async ({ controller }, next) => {
	const contentTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-content', // change me!
				component: <Content store={controller.store} />,
			},
		],
		(target, elem) => {
			// run search after finding target
			controller.search();
		}
	);

	// add a listener to re-target on DOMContentLoaded
	window.addEventListener('DOMContentLoaded', () => {
		contentTarget.retarget();
	});

	await next();
})
```

### Initialize
Initializing the controller by invoking its `init` method will subscribe to any URL state changes and fire the `init` event and any attached middleware.

```typescript
searchController.init();
```

### Perform Search

Invoking the SearchController `search` method will perform a search. In this example, this is being done in the `init` middleware after the Domtargeter finds the element selector `#searchspring-content`. Simultaneously the `Content` component will be rendered into the element selector.
