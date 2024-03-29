## Configuration

Let's define our config. The config that is provided to Snap will create and return controllers that are specified in the config. In this example, we will be creating a Search and Autocomplete controller.

```typescript
const config = {
	features: {
        integratedSpellCorrection: {
            enabled: true,
        },
    },
	url: {
		parameters: {
			core: {
				query: { name: 'query' }
			}
		}
	},
	client: {
		globals: {
			siteId: 'xxxxxx',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
				},
				targeters: [
					{
						selector: '#searchspring-content',
						component: () => Content,
						skeleton: () => ContentSkel,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: () => Sidebar,
						skeleton: () => SidebarSkel,
						hideTarget: true,
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: 'input.searchspring-ac',
					settings: {
						trending: {
							limit: 5,
						},
					},
				},
				targeters: [
					{
						selector: 'input.searchspring-ac',
						component: () => Autocomplete,
						hideTarget: true,
					},
				],
			},
		],
	},
};
```

Let's go over a few things.

`config.url` is optional and contains a [`UrlTranslator` config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) object that is passed to the core [@searchspring/snap-url-manager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager) package used by all controllers. This parameter configuration will be applied to all controllers created via Snap, but can be specified per controller for specific customization.

`config.client` is required and contains a config object that is passed to the core [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) package. This service handles the network requests to our APIs to retrieve data to be displayed.

`config.client.globals` specifies base query parameters to the API; these are parameters that will ALWAYS be included on every request. At the bare minimum, `siteId` is required and can be obtained in the [Searchspring Management Console](https://manage.searchspring.net/)

`config.controllers` specifies all of the controllers that we wish to create. In this this example we are creating a Search and Autocomplete controller. In addition, Finder and Recommendation services can also be specified.

### Search

Lets look at the Search controller that we are creating.

The `config` object contains all controller configurations. The most notable property here is the required `id` with a given value of `'search'`. This will be the name of the search controller that we can then interface with the return of the `new Snap()` instance via the `getController` method. In snap-preact controllers are created only as needed (typically when a targeter has found a target), their creation is an asynchronous process. The `getController` method will return a promise that will resolve to the controller object requested immediately after its creation.

For example:

```typescript
const snap = new Snap(config);
snap.getController('search').then((search) => {
	// do things with controller
});
```

If multiple controllers are needed at the same time, usage of the `getControllers` method is necessary. The `getControllers` method returns a promise that resolves to an array of controllers in the order requested by the parameters. The promise only resolves when ALL of the controllers have been created - if a controller is specified that is never created the promise will never resolve. For this reason this method should only be used when all controllers are needed simultaneously.

```typescript
const snap = new Snap(config);
snap.getControllers('search', 'autocomplete').then(([search, autocomplete]) => {
	// do things with controllers
});
```

We also have a `targeters` array of DomTargeter `targeter` configuration objects. Each object defines an entry point on the page where a component will be rendered. 

`targeter.selector` specifies the DOM selector to target

`targeter.component` specifies a function that returns a reference to the component to render at the target selector. 

`targeter.hideTarget` boolean that specifies if the target node should be hidden before the component is mounted and rendered. It is recommended to enable this to prevent flashy behaviour. 

`targeter.autoRetarget` (optional) boolean that specificies if the targeter should continuously query for the selector in the DOM until it finds it and triggers a retarget. This is useful for dynamically generated selectors that might not exist at dom ready.

`targeter.skeleton` (optional) meant to be used as a "loading" component. This specifies a function that returns a reference to the component to render immediately at the target selector to show briefly while the data is returning and the real component is rendering. You can use any component you want for this, although `snap-preact-components` provides a `skeleton` component for you to use if preferred.

`targeter.props` (optional) convenient way of passing additional props to the component, by default we pass `controller`

`targeter.onTarget` (optional) callback that fires after a target is found

`targeter.name` (optional) name to give the targeter for later reference using `controller.targeters`

In our example, we are rendering a `<Content>` component into `<div id="searchspring-content">` and the `<Sidebar>` component into `<div id="searchspring-sidebar">`



### Autocomplete

We're also creating an Autocomplete controller in a similar function.

One notable thing to mention as you may see a duplicate `selector` property in both the `config` and `targeter`.

The `config.selector` specifies the `<input/>` element(s) to attach events to that respond to Autocomplete actions. This supports a selector that targets many elements. 

The `targeter.selector` specifies the DOM node where the `targeter.component` will be rendered into.

However in our example, since they are both the same value, the Autocomplete component will rendered as a child DOM node below the `<input/>` element that is currently focused. 


### Feature Flags

`config.features` is optional and defines features to enable.

#### Integrated Spell Correction

Integrated spell correction is disabled by default. When disabled and a query is typed into autocomplete, a request is made to the suggest API to retrieve a list of terms. The highest scoring term is then used to query the search API for results.

Enabling integrated spell correction `config.features.integratedSpellCorrection.enabled = true` will still retrieve terms from the suggest API to display, however the query that was entered will be used as the term sent to the search API. Spell correction will occur within the search API. The correction and original query is returned in the response and available to be render. Upon submitting the autocomplete form, a `fallbackQuery` parameter is also submitted. This contains a value of the highest scoring suggested term and will be searched for if the initial query yields 0 results.

Note: Enabling integrated spell correction modifies [AutocompleteController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Autocomplete)'s config by setting `config.settings.integratedSpellCorrection = true`
