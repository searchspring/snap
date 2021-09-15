## Autocomplete
To set up Autocomplete using Snap, we'll need to create a `AutocompleteController` instance, which requires `AutocompleteControllerConfig` and `ControllerServices` objects to instantiate. For more details see the [`AutocompleteController docs`](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Autocomplete).

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

Note that the `UrlManager` is utilizing the `UrlTranslator` which will use `'q'` as the URL query parameter. This can be overwritten to use `'search_query'` by providing a by providing a `parameters.core.query` [config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) such as in this example:

```typescript
const autocompleteUrlManager = new UrlManager(new UrlTranslator({ parameters: core: { query: { name: 'search_query' } } }), reactLinker).detach();
const autocompleteControllerServices = {
	client,
	store: new AutocompleteStore(autocompleteConfig, { urlManager: autocompleteUrlManager }),
	urlManager: new UrlManager(new UrlTranslator({ queryParameter: 'search_query' }), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker
}
```

The translator type should be the same between Autocomplete and Search Controllers in order for compatible URLs to be generated.

Note: `client` and `tracker` are shared services and are defined in previous steps.

### Instantiation
With the `AutocompleteControllerConfig` and `ControllerServices` defined, we can now create an instance of a `AutocompleteController`.

```typescript
const autocompleteController = new AutocompleteController(autocompleteConfig, autocompleteControllerServices);
```

### Middleware
Autocomplete supports middleware to hook into various events using `plugin` and `on` methods. See [Search Middlewear](https://github.com/searchspring/snap/blob/main/docs/SEARCH.md) for usage


### DomTargeter
Similar to Search DomTargeter, the following example shows how to use the DomTargeter with an `AutocompleteController` and passing that controller as a prop to a `Autocomplete` component (not shown). After the target has been found it injects a new element ('.ss-ac-target') and then uses the Preact render function to render the component into the newly created element.

For further usage and documentation, see [DomTargeter](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/DomTargeter).

```typescript
new DomTargeter(
	[
		{
			selector: autocompleteController.config.selector, // input element that we are binding to
			inject: {
				action: 'after', // injecting an element after the input
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
		autocompleteController.bind();
		render(<Autocomplete controller={autocompleteController} input={inputElem} />, injectedElem);
	}
);
```

### Initialize
Optionally initialize the controller by invoking its `init` method. This will subscribe to any `UrlManager` state changes and fire the `init` event and any attached middleware. This will happen automatically when invoking the `search` method for the first time.

```typescript
autocompleteController.init();
```

### Bind inputs

Invoking the AutocompleteController `bind` method will bind the controller instance to all selector elements found. In this example, this occurs in the DomTargeter callback method (`onTarget`) when a selector is found.
