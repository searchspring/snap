## Finder
To set up a product finder using Snap, we'll need to utilize a `FinderController` which like other controllers, requires a `FinderControllerConfig` and a `ControllerServices` object.

```typescript
const finderController = new FinderController(finderConfig, finderControllerServices);
```

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
The `ControllerServices` object contains all of the controller's dependencies. Note the difference between SearchController's ControllerServices is the different store. Here we are using `FinderStore`:

```typescript
const finderControllerServices = {
	client,
	store: new FinderStore(),
	urlManager: new UrlManager(new UrlTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

### Middleware
Finders support middleware to hook into various events using `use` and `on` methods. See [Search Middlewear](http://searchspring.github.io/snap/docs/#/search) for usage.


### DomTargeter
Similar to [Search DomTargeter](#SearchDomTargeter), we'll use middleware to hook into FinderController's init event to render the `Finder` UI component (not shown).

For further usage and documentation, see [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter)

```typescript
finderController.on('init', async ({ controller }) => {
	const finderTarget = new DomTargeter(
		[
			{
				selector: '#finder-target-selector',
				component: Finder,
			},
		],
		async (target, elem) => {
			// run search after target element is found
			await controller.search();

			const finderComponent = <target.component store={controller.store} />;
			render(finderComponent, elem);
		}
	);

	// in case the element did not exist at time of execution
	window.addEventListener('DOMContentLoaded', () => {
		finderTarget.retarget();
	});

	await next();
});
```

### Initialize
Initializing the controller by invoking its `init` method will subscribe to any URL state changes and fire the `init` event and any attached middleware.

```typescript
finderController.init();
```

### Search
After the controller has been initialized, the search method must be invoked for the finder to fetch its initial data. In the example above, this is being invoked in the DomTargeter 

```typescript
finderController.search();
```

### Find
After selection(s) have been made, the user will click on a 'Find' button. This click event should invoke the `find` method of the Finder controller which will redirect to the specified `url` in the config, along with its selection data.

```typescript
finderController.find();
```
