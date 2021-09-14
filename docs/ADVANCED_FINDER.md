## Finder
To set up a product Finder using Snap, we'll need to create a `FinderController` instance, which requires `FinderControllerConfig` and `ControllerServices` objects to instantiate. For more details see the [`FinderController docs`](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Finder).

### Config (FinderControllerConfig)
There are two types of Finder configurations, a Hierarchy and Non-Hierarchy. The difference is the type of field being used and how it is configured in the Searchspring Management Console.

#### Hierarchy Config
To use a Hierarchy configuration, ensure that the config's `fields` array contain a single entry, and that the field is of type `hierarchy` in the Searchspring Management Console. Here is an example of a Hierarchy `FinderControllerConfig` object:

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search'
	fields: [{
		field: 'ss_tire',
		label: 'Wheel Finder',
		levels: ['Year', 'Make', 'Model', 'Wheel Size']
	}]
}
```

#### Non-Hierarchy Config
To use a Non-Hierarchy configuration, multiple `fields` are specified. All fields must have a `type` or `value` and NOT `hierarchy`. Facet types can be configured in the Searchspring Management Console. Here is an example of a Non-Hierarchy `FinderControllerConfig` object:

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{ 
			field: 'custom_wheel_size',
			label: 'Size'
		}, 
		{ 
			field: 'custom_wheel_width',
			label: 'Width'
		}, 
		{ 
			field: 'custom_wheel_bolt_pattern',
			label: 'Bolt Pattern'
		}, 
		{ 
			field: 'custom_color',
			label: 'Color'
		}
	]
};
```

Note: When using fields that are not of hierarchy type, `levels` are not required.

### ControllerServices
The `ControllerServices` object contains all of the controller's dependencies.

Note that the `UrlManager` is created separately because it is a shared dependency; it is also a service needed for the `FinderStore`. The `UrlManager` is utilizing the `UrlTranslator` which will use `'q'` as the default URL query parameter. This can be overwritten to use `'search_query'` by providing a `parameters.core.query` [config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) such as in this example:

```typescript
const finderUrlManager = new UrlManager(new UrlTranslator({ parameters: core: { query: { name: 'search_query' } } }), reactLinker).detach(0);
const finderControllerServices = {
	client,
	store: new FinderStore(finderConfig, { urlManager: finderUrlManager }),
	urlManager: finderUrlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker
}
```

Note: `client` and `tracker` are shared services and are defined in previous steps.

### Instantiation
With the `FinderControllerConfig` and `ControllerServices` defined, we can now create an instance of a `FinderController`.

```typescript
const finderController = new FinderController(finderConfig, finderControllerServices);
```

### Middleware
Finders support middleware to hook into various events using `plugin` and `on` methods. See [Search Middlewear](https://github.com/searchspring/snap/blob/main/docs/SEARCH.md) for usage.


### DomTargeter
Similar to Search DomTargeter, the following example shows how to use the DomTargeter with a `FinderController` and passing that controller as a prop to a `Finder` UI component (not shown). It uses the Preact render function to render the component after the target has been found.

For further usage and documentation, see [DomTargeter](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/DomTargeter).

```typescript
const finderTarget = new DomTargeter(
	[
		{
			selector: '#finder-target-selector', // CSS selector for element to render component into
		},
	],
	async (target, elem) => {
		// await search after target element is found
		await finderController.search();

		render(<Finder controller={finderController} />, elem);
	}
);
```

### Initialize
Optionally initialize the controller by invoking its `init` method. This will subscribe to any `UrlManager` state changes and fire the `init` event and any attached middleware. This will happen automatically when invoking the `search` method for the first time.

```typescript
finderController.init();
```

### Search
After the controller has been initialized, the search method must be invoked for the finder to fetch its initial data. In the example above, this is being invoked in the DomTargeter.

```typescript
finderController.search();
```

### Find
After selection(s) have been made, the user will click on a 'Find' button. This click event should invoke the `find` method of the Finder controller which will redirect to the specified `url` in the config with it's selection parameters attached.

```typescript
finderController.find();
```
