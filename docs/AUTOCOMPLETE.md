## Autocomplete
To set up autocomplete using Snap, we'll need to utilize an `AutocompleteController` which just like the `SearchController`, requires `AutocompleteControllerConfig` and `ControllerServices` objects to instantiate.
```typescript
const autocompleteController = new AutocompleteController(autocompleteConfig, autocompleteControllerServices);
```

### Config (AutocompleteControllerConfig)
Lets define an `AutocompleteControllerConfig` object:

```typescript
const autocompleteConfig = {
	id: 'autocomplete',
	selector: '#search_query',
	globals: {
		suggestions: {
			count: 4,
		},
		pagination: {
			pageSize: 6,
		},
	},
	settings: {
		initializeFromUrl: true,
		syncInputs: false,
		facets: {
			trim: true
		},
	},
}
```

### Autocomplete Controller Services
The `ControllerServices` object contains all of the controller's dependencies. Note the difference between SearchController's ControllerServices is the different store. Here we are using `AutocompleteStore`

Note that the `UrlManager` is utilizing the `UrlTranslator` which will use `'q'` as the URL query parameter. This can be overwritten by providing a `queryParameter` config such as in this example:

```typescript
const autocompleteControllerServices = {
	client,
	store: new AutocompleteStore(),
	urlManager: new UrlManager(new UrlTranslator({ queryParameter: 'search_query' }), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

The translator type should be the same between Autocomplete and Search Controllers in order for compatible URLs to be generated.

### Middleware
Autocomplete supports middleware to hook into various events using `use` and `on` methods. See [Search Middlewear](https://github.com/searchspring/snap/blob/main/docs/SEARCH.md) for usage


## DomTargeter
Similar to Search DomTargeter, we'll use middleware to hook into AutocompleteController's init event to render autocomplete.

For further usage and documentation, see [DomTargeter](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/DomTargeter)

```typescript
autocompleteController.on('init', async ({ controller }) => {
	new DomTargeter(
		[
			{
				selector: controller.config.selector,
				component: Autocomplete,
				inject: {
					action: 'after', // before, after, append, prepend
					element: (target, origElement) => {
						const acContainer = document.createElement('div');
						acContainer.id = 'ss-ac-target';
						acContainer.addEventListener('click', (e) => {
							e.stopPropagation();
						});
						return acContainer;
					},
				},
			},
		],
		(target, injectedElem, inputElem) => {
			// bind to config selector
			controller.bind();

			const acComponent = <target.component store={controller.store} input={inputElem} />;
			render(acComponent, injectedElem);
		}
	);
});
```

### Initialize
Initializing the controller by invoking its `init` method will subscribe to any URL state changes and fire the `init` event and any attached middleware.

```typescript
autocompleteController.init();
```

### Bind inputs

Invoking the AutocompleteController `bind` method will bind the controller instance to all selector elements found. In this example, this occurs in the DomTargeter callback method when a selector is found.
