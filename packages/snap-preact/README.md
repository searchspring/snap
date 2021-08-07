# Snap Preact

<a href="https://www.npmjs.com/package/@searchspring/snap-preact"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-preact.svg?style=flat"></a>

Snap Preact is an abstraction layer that provides a config based interface for creating a Searchspring integration quickly.


## Installation

To install the `snap-preact` package and it's dependencies:

```bash
npm install --save @searchspring/snap-preact
```

## Instantiation

```typescript
import { Snap } from '@searchspring/snap-preact';

const snap = new Snap(config);
```

## Configuration
A configuration object provided to Snap will determin the services that will be created. 

Full example:

```typescript
const config = {
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
					settings: {
						redirects: {
							merchandising: false,
						},
					},
				},
				targets: [
					{
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: Sidebar,
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
				targets: [
					{
						selector: 'input.searchspring-ac',
						component: Autocomplete,
						hideTarget: true,
					},
				],
			},
		],
	},
};
```

### config.client
A single client instance will be created and shared across all services using the provided config. 

See [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) documentation for full client config options.

```typescript
const config = {
    client: {
        globals: {
            siteId: 'xxxxxx'
        }
    }
}
```

### config.instantiators
The `instantiators` object must be defined if any Recommendation controllers have also been defined via `config.controllers.recommendation`

```typescript
const config = {
    instantiators: {
        recommendation: {
            components: {},
            config: {
                branch: BRANCHNAME
            },
            selector: '',
            services: {}
        }
    },
    controllers: {
        recommendation: []
    }
}
```

`recommendation.components` - required mapping of recommendation components.

`recommendation.config.branch` - required current git branch name. Defined via webpack during bundle build:

```typescript
const webpack = require('webpack');
const childProcess = require('child_process');
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

module.exports = {
	plugins: [
		new webpack.DefinePlugin({
			BRANCHNAME: `"${branchName}"`,
		}),
	],
}
```

`recommendation.selector` - optional selector to target recommendation instances if using a non-standard installation. Default selector: `script[type="searchspring/recommend"]`

`recommendation.services` - optional object of `ControllerServices` 



### config.parameters
The `parameters` object contains the config provided to each UrlTranslator

```typescript
const config = {
    parameters: {
        search: {
            name: 'q'
        }
    }
}
```

### config.controllers
The `controllers` object contains a list of controllers to create for each controller type. 

Available controllers:

- [SearchController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Search) 
- [AutocompleteController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Autocomplete)
- [FinderController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Finder)
- [RecommendationController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation)

```typescript
const config = {
    controllers: {
        search: [],
        autocomplete: [],
        finder: [],
        recommendation: [],
    }
}
```

Each array entry contains an object with the following properties:

`config` - required controller config for the corresponding controller. See Controller specific documentation for all available configuration options.

`targets` - optional array of Target objects. Targets thats have been found will have the corresponding controller provided to the target component `controller` prop and the controller's `search` method invoked.

```typescript
const target = {
	selector: string;
	inject?: {
		action: 'before' | 'after' | 'append' | 'prepend' | 'replace';
		element: Element | ((target: Target, element: Element) => Element);
	};
	hideTarget?: boolean;
	emptyTarget?: boolean;
	[any: string]: unknown;
}
```

`services` - optional object of `ControllerServices` to be used for this controller


An example creating a SearchController:

```typescript
const config = {
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
                },
                targets: [
					{
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: Sidebar,
						hideTarget: true,
					},
				],
                services: {}
            }
        ]
    }
}
```
The controller config `id` will be the name of the controller that you will then interface from the return of creating the `new Snap()` instance via the `controllers` object. 

For example, if using the `config` example above:

```typescript
const snap = new Snap(config);
const { search } = snap.controllers;
```

## properties

After instantiating an instance of Snap, the following properties can be accessed. 

### config
A reference to the config that was provided.

### logger
A reference to the shared [@searchspring/snap-logger](https://github.com/searchspring/snap/tree/main/packages/snap-logger) instance used by each controller.

### client
A reference to the shared [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) instance used by each controller.

### tracker
A reference to the shared [@searchspring/snap-tracker](https://github.com/searchspring/snap/tree/main/packages/snap-tracker) instance used by each controller.

### controllers
An object containing all controllers that have been created. 


### recommendations
A reference to `RecommendationInstantiator` instance if creating recommendation instances.

