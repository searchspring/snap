# Snap

Welcome to Snap - Searchspring's SDK for integrating into front end web apps.

---

# Contributing

We invite your participation through issues and pull requests! Please reference Searchspring's [Community Contribution Guidelines](https://github.com/searchspring/community/blob/main/CONTRIBUTING.md).

# Packages
Snap packages that are published to NPM's registry are found under the `/packages` directory. 

Documentation for each package can be found in its respective README file.

<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="images/snap-dependencies.jpg"/>
</details>

## Client

[@searchspring/snap-client-javascript](packages/snap-client-javascript) <a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a>

Simple Javascript client for communicating with Searchspring's API.

## Component Libraries

A collection of interface elements for front end libraries
### React / Preact

[@searchspring/snap-preact-components](packages/snap-preact-components) <a href="https://www.npmjs.com/package/@searchspring/snap-preact-components"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-preact-components.svg?style=flat"></a>


## Controller

[@searchspring/snap-controller](packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

The heart of controlling Search, Autocomplete, & Finder functionality.

## Demo Stores

A demo store utilizing all Snap packages and components.
### React / Preact
Check it out at [try.searchspring.com](http://try.searchspring.com/) or use it as a reference.
<!-- TODO: Update try.searchspring.com to Snap deployed demostore -->

[@searchspring/snap-preact-demo](packages/snap-preact-demo)

## Event Manager

[@searchspring/snap-event-manager](packages/snap-event-manager) <a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

Hook into custom events for modifying data.

## Logger

[@searchspring/snap-logger](packages/snap-logger) <a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a>

Simple logger for debugging

## Profiler

[@searchspring/snap-profiler](packages/snap-profiler) <a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a>

A utility for profiling the performance of Snap features

## Store

[@searchspring/snap-store-mobx](packages/snap-store-mobx) <a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

MobX state management

## Toolbox

[@searchspring/snap-toolbox](packages/snap-toolbox) <a href="https://www.npmjs.com/package/@searchspring/snap-toolbox"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-toolbox.svg?style=flat"></a>

A collection of utility tools such as DOM targetting, currency formatting & browser feature flags

## URL Manager

[@searchspring/snap-url-manager](packages/snap-url-manager) <a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a>

A standard API for URL management across all Snap products

# Quick Links

[Snap API docs](https://searchspring.github.io/snapi-oas/) - Search & Autocomplete API documentation

[Snapi Explorer](https://searchspring.github.io/snapi-explorer/) - a tool for making requests to Searchspring's API.

# Prerequisite

## NPM v7.x

Npm v7.x is required for its workspaces feature

Npm v7.7.0 is optional for executing scripts in workspaces
## ~/.npmrc

Only required if packages are still private. Replace `{token}` with a Github personal access token
```text
//npm.pkg.github.com/:_authToken={token}
registry=https://registry.npmjs.org/
```

# Commands
While at the <b>repo root</b>, the following commands are available:

## Install dependencies
```shell
npm install
```

## Dev
Executes `npm run dev` across all packages sequentially. All packages will be linked with hot reloading.
```shell
npm run dev
```
http://localhost:3333 Demo store

http://localhost:8888 Webpack bundle analyzer

## Commit
Instead of using `git commit`, use `npm run commit` to utilize Commitizen
```shell
npm run commit
```

## Storybook
http://localhost:6006
```shell
npm run storybook
```

## Unit Tests
```shell
npm run test
```

## Cypress E2E Tests
Only applies to `packages/snap-preact-demo`
```shell
npm run cypress
```

## Build
Executes `npm run build` across all packages sequentially. 
```shell
npm run build
```

## Clean
Removes all package and root `node_modules` directories
```shell
npm run clean
```

## Execute common package.json script in all workspaces
```shell
npm run <command> --workspaces
```

## Execute package.json script within single workspace
```shell
npm run <command> [--workspace=<package> | -w <package>] [--workspace=<package> | -w <package>]
```


<h1 id="TypicalUsage">Typical Usage</h1>

This section will provide an overview of how to get up and running with Snap

## Installation & Imports
First, we'll start by installing all Snap dependencies

```shell
npm install --save @searchspring/snap-client-javascript @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger @searchspring/snap-toolbox @searchspring/snap-controller @searchspring/snap-store-mobx
```

Then we'll import them in our main entry point `index.js`

```typescript
import SnapClient from '@searchspring/snap-client-javascript';
import { UrlManager, HybridTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { DomTargeter } from '@searchspring/snap-toolbox';
import { SearchController, AutocompleteController, FinderController } from '@searchspring/snap-controller';
import { SearchStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
```

## Snap Client
Next, let's define Snap Client as it is required and can be shared across multiple services

```typescript
const client = new SnapClient(globals, clientConfig);
```

The Snap Client requires two object config parameters:

### Client Config
In most cases, this will be an empty object. 

`apiHost` defines the Searchspring API endpoint to use

```typescript
const clientConfig = {
	// apiHost: 'http://localhost:8080/api/v1',
};
```

### Global Config
If the project has been created using `@searchspring/snapfu`, the `siteId` can be referenced from the `package.json`

```typescript
import { searchspring } from '../package.json';

const globals = {
	siteId: searchspring.siteId,
};
```

<!-- TODO: update smc link to find siteId -->
Otherwise, you can find your Searchspring `siteId` in the [Searchspring Management Console](https://manage.searchspring.net) and define it directly:

```typescript
const globals = {
	siteId: 'ga9kq2',
};
```


<h2 id="SearchTypicalUsage">Search</h2>

To set up Search using Snap, we'll need to utilize a `SearchController` which requires two objects:  `SearchControllerConfig` and `ControllerServices`
```typescript
const search = new SearchController(searchConfig, searchControllerServices);
```
### Config (SearchControllerConfig)
Lets define a `SearchControllerConfig` object:
```typescript
const searchConfig : SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
		merchanding: {
			disabled: false
		}
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
Optionally, apply filters from the page's content to the SearchControllerConfig `globals.filters` property.
This can be used to configure category pages.

For example, if migrating an exisiting Searchspring AJAX V3 implementation:

```typescript
const getV3ScriptAttrs = () => {
	const scriptElement = document.querySelector('script[src*="searchspring.catalog.js"]');

	if (scriptElement) {
		const attributes = {};

		scriptElement.attributes.forEach((attribute) => {
			attributes[attribute.name] = attribute.value;
		});

		return attributes;
	}
};
```

```typescript
const v3Context = getV3ScriptAttrs();
if (v3Context?.category) {
	searchConfig.globals.filters.push({
		type: 'value',
		field: 'categories_hierarchy',
		value: v3Context.category,
		background: true,
	});
}
```


### ControllerServices
The `ControllerServices` object contains all of the controller's dependencies

Note that the `UrlManager` is utilizing a `HybridTranslator` which will use `'q'` as the URL query parameter. This can be overwritten by providing a `queryParameter` config such as in this example:

```typescript
const searchControllerServices = {
	client,
	store: new SearchStore(),
	urlManager: new UrlManager(new HybridTranslator({ queryParameter: 'search_query' }), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

<h3 id="SearchMiddleware">Middleware</h3>
Now that our SearchController is defined, we can optionally attach middleware to hook into various events. There are two ways of doing this, using the Controller's `use` or `on` methods

#### via `use` method:
```typescript
async function scrollToTop({ controller }, next) {
	// keep the same position when a user clicks on a facet
	if (controller.store.pagination.page != 1) {
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	}

	await next();
}

const middleware = (controller) => {
	
    controller.on('init', async({ controller }, next) => {
		const versionText = 'bbwheelsonline.com';

		controller.log.imageText({
			url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
			text: `${versionText}`,
			style: `color: ${controller.log.colors.indigo}; font-weight: bold;`,
		});

		await next();
	});

	// scroll to top
	controller.on('afterStore', scrollToTop);

	// log the store
	controller.on('afterStore', async({ controller }, next) => {
		controller.log.debug('store', controller.store.toJSON());
		await next();
	});
};


search.use(middleware);
```

#### via `on` method:
```typescript
search.on('afterStore', async ({ controller }, next) => {
    controller.log.debug('store', controller.store.toJSON());
	await next();
})
```

<h3 id="SearchDomTargeter">DomTargeter</h3>

`DomTargeter` is a utility for rending components in specified DOM targets. 

For further usage and documentation, see [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter)

```typescript
search.on('init', async ({ controller }, next) => {
    const searchPageTarget = new DomTargeter(
		[
			{
				selector: '.searchspring-container',
				component: <SearchPage />,
			},
		],
		(target, elem) => {
			render(target.component, elem);

			const breadcrumbTarget = document.querySelector('.page--searchresults ul.breadcrumbs');
			breadcrumbTarget && render(<BreadCrumbs />, breadcrumbTarget);
		}
	);

	const contentTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-content',
				component: <Content store={controller.store} />,
			},
		],
		(target, elem) => {
			// run search after finding target
			controller.search();

			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

	const sidebarTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-sidebar',
				component: <Sidebar store={controller.store} />,
			},
		],
		(target, elem) => {
			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

    window.addEventListener('DOMContentLoaded', () => {
		searchPageTarget.retarget();
		contentTarget.retarget();
		sidebarTarget.retarget();
	});

	await next();
})
```

### Initialize
Initializing the controller by invoking its `init` method will subscribe to any URL state changes.

```typescript
search.init();
```


## Autocomplete
To set up autocomplete using Snap, we'll need to utilize an `AutocompleteController` which requires two objects:  `AutocompleteControllerConfig` and `ControllerServices`
```typescript
const autocomplete = new AutocompleteController(autocompleteConfig, autocompleteControllerServices);
```

### Config (AutocompleteControllerConfig)
Lets define a `AutocompleteControllerConfig` object:

```typescript
const autocompleteConfig : AutocompleteControllerConfig = {
	id: 'autocomplete',
	selector: '#search_query',
    action: '',
	globals: {
		suggestions: {
			count: 4,
		},
		search: {
			query: {
				spellCorrection: true,
			},
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

### ControllerServices
The `ControllerServices` object contains all of the controller's dependencies. Note the difference between SearchController's ControllerServices is the different store. Here we are using `AutocompleteStore`

Note that the `UrlManager` is utilizing a `HybridTranslator` which will use `'q'` as the URL query parameter. This can be overwritten by providing a `queryParameter` config such as in this example:

```typescript
const autocompleteControllerServices = {
	client,
	store: new AutocompleteStore(),
	urlManager: new UrlManager(new HybridTranslator({ queryParameter: 'search_query' }), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

### Middleware
Autocomplete supports middleware to hook into various events. See [Search Middleware](#SearchMiddleware) above for same usage via `use` and `on` methods


## DomTargeter
Similar to [Search DomTargeter](#SearchDomTargeter), we'll use middle wear to hook into AutocompleteController's init event to render autocomplete.

For further usage and documentation, see [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter)

```typescript
autocomplete.on('init', async ({ controller }) => {
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
Initializing the controller by invoking its `init` method will subscribe to any URL state changes.

```typescript
autocomplete.init();
```


## Finder
To set up finder using Snap, we'll need to utilize a `FinderController` which requires two objects:  `FinderControllerConfig` and `ControllerServices`
```typescript
const finder = new FinderController(finderConfig, finderControllerServices);
```

### Config (FinderControllerConfig)
There are two types of Finder configurations, a Hierarchy and Non-Hierarchy. The difference is they type of field being used and how it is configured in the Searchspring Management Console.

#### Hierarchy Config
To use a Hierarchy configuration, ensure that the config's `fields` array contain a single entry, and `fields.field` is of type `hierarchy` in the Searchspring Management Console. Here is an example of a Hierarchy `FinderControllerConfig` object:

```typescript
const finderConfig : FinderControllerConfig = {
	id: 'finder',
    url: '/search',
	globals: {},
    fields: [{
        field: 'ss_tire',
        label: 'Wheel Finder',
        levels: ['Year', 'Make', 'Model', 'Wheel Size'],
    }],
}
```

#### Non-Hierarchy Config
To use a Non-Hierarchy configuration, each dropdown will contain its own field and can be of any type. Here is an example of a Non-Hierarchy `FinderControllerConfig` object:

Note if using fields that are not of hierarchy type, `levels` is not required

```typescript
const finderConfig: FinderControllerConfig = {
    id: 'finder',
    url: '/search',
	globals: {},
	fields: [
        { 
            field: 'custom_wheel_size',
            label: 'Size',
        }, 
        { 
            field: 'custom_wheel_width',
            label: 'Width',
        }, 
        { 
            field: 'custom_wheel_bolt_pattern',
            label: 'Bolt Pattern',
        }, 
        { 
            field: 'custom_color',
            label: 'Color',
        }
    ]
};
```


### ControllerServices
The `ControllerServices` object contains all of the controller's dependencies. Note the difference between SearchController's ControllerServices is the different store. Here we are using `FinderStore`

```typescript
const finderControllerServices = {
	client,
	store: new FinderStore(),
	urlManager: new UrlManager(new HybridTranslator(), reactLinker),
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger()
}
```

### Multiple Finder Instances
It is common to have multiple Finder instances on a page, each with its own configuration. Here is an example of how that may look:

```typescript
const finderConfigs = [
    {
        id: 'finder_wheel_finder',
        url: '/search',
        globals: {},
        fields: [{
            field: 'ss_tire',
            label: 'Wheel Finder',
            levels: ['Year', 'Make', 'Model', 'Wheel Size'],
        }],
    },
    {
        id: 'finder_size_finder',
        url: '/search',
        globals: {},
        fields: [
            { 
                field: 'custom_wheel_size' 
                label: 'Size',
            }, 
            { 
                field: 'custom_wheel_width' 
                label: 'Width',
            }, 
            { 
                field: 'custom_wheel_bolt_pattern' 
                label: 'Bolt Pattern',
            }, 
            { 
                field: 'custom_color'
                label: 'Color',
            }
        ]
    }
]
```

```typescript
finderConfigs.forEach((finderConfig) => {
	const finderInstance = new FinderController(finderConfig, {
		client,
		store: new FinderStore(),
		urlManager: new UrlManager(new HybridTranslator(), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger()
	});

	finderInstance.use(finderware);
    finderInstance.init();
});
```

### Middleware
Finder supports middleware to hook into various events. See [Search Middleware](#SearchMiddleware) above for same usage via `use` and `on` methods


## DomTargeter
Similar to [Search DomTargeter](#SearchDomTargeter), we'll use middle wear to hook into FinderController's init event to render autocomplete.

For further usage and documentation, see [@searchspring/snap-toolbox DomTargeter](../snap-toolbox/README.md#DomTargeter)

```typescript
finder.on('init', async ({ controller }) => {
	const finderTarget = new DomTargeter(
		[
			{
				selector: '.finder_target',
				component: Finder,
			},
		],
		async (target, elem) => {
			// search after target element is found
			await controller.search();

			// remove loading sibling element
			elem.parentElement.querySelector('.search-loading')?.remove();

			const finderComponent = <target.component store={controller.store} />;
			render(finderComponent, elem);
		}
	);

	window.addEventListener('DOMContentLoaded', () => {
		finderTarget.retarget();
	});

	await next();
});
```

### Initialize
Initializing the controller by invoking its `init` method will subscribe to any URL state changes.

```typescript
finder.init();
```


### Search
After the controller has been initialized, the search method must be invoked for the finder to fetch its initial data. In the example above, this is being invoked in the DomTargeter 

```typescript
finder.search();
```

### Find
After selection(s) have been made, the user will click on a 'Find' button. This click event should invoke the `find` method of the Finder controller which will redirect to the specified `url` in the config, along with its selection data.

```typescript
finder.find();
```



# Troubleshooting

## Target element is not present while invoking `init`
If you attempt to initialize a snap component before the target element exists on the page, it may not be fully initialized. We recommend calling init after the DOMContentLoaded event has been invoked. 

```typescript
window.addEventListener('DOMContentLoaded', () => {
	autocomplete.init();
});

window.addEventListener('DOMContentLoaded', () => {
    searchPageTarget.retarget();
    contentTarget.retarget();
    sidebarTarget.retarget();
});
```