# Instantiators

## RecommendationInstantiator
The `RecommendationInstantiator` class handles the targeting and creation of recommendation controllers. The instantiator looks for targets in the DOM, creates a controller and injects components into the DOM.


## RecommendationInstantiatorConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `mode` | `keyof typeof AppMode \| AppMode` | No | Application mode (e.g., 'production', 'development'). Defaults to 'production'. |
| `client` | `object` | No | Client configuration for API communication. |
| `client.globals` | `ClientGlobals` | Yes* | Global client settings. Must include `siteId` if no services provided. |
| `client.globals.siteId` | `string` | Yes* | Searchspring site identifier. Required if no client service provided. |
| `client.config` | `ClientConfig` | No | Optional client configuration for cache settings, origins, etc. |
| `components` | `object` | Yes | Mapping of component names to component loaders. |
| `components[name]` | `() => Promise<any> \| any` | Yes | Function that loads a component. Keys should match template names (e.g., 'Default', 'Bundle'). |
| `config` | `object` | Yes | Core configuration for recommendation behavior. |
| `config.branch` | `string` | Yes | Git branch name for template branching. |
| `config.realtime` | `boolean` | No | Enable real-time recommendations. |
| `config.batched` | `boolean` | No | Enable batched recommendation requests. |
| `config.limit` | `number` | No | Default limit for recommendation results. |
| `config.variants` | `VariantConfig` | No | Configuration for variant handling. |
| `config.beacon` | `BeaconSettings` | No | Beacon tracking settings. |
| `config.middleware` | `object` | No | Event middleware configuration. |
| `config.plugins` | `PluginGrouping[]` | No | Plugin configurations. |
| `selector` | `string` | No | Custom selector for targeting script elements. Defaults to `'script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]'`. |
| `url` | `UrlTranslatorConfig` | No | URL translation configuration for state management. |
| `context` | `ContextVariables` | No | Context variables available to components. |


`*` Required if no corresponding service is provided in the constructor

## Integration Types

The `RecommendationInstantiator` supports two script block integration styles: **grouped** and **legacy**.

### Grouped Block

The grouped block uses a `script[type="searchspring/recommendations"]` tag containing a `profiles` array. Each entry in `profiles` specifies a `tag` (or `profile`) and a `selector` targeting where the component should render.

```html
<div class="ss__recs__trending"></div>
<div class="ss__recs__similar"></div>

<script type="searchspring/recommendations">
	globals = {
		products: ["SKU-123"],
		shopper: { id: "user_abc" },
	};
	profiles = [
		{
			tag: 'trending',
			selector: '.ss__recs__trending',
			options: {
				limit: 5,
			},
		},
		{
			tag: 'similar',
			selector: '.ss__recs__similar',
		},
	];
</script>
```

> [!IMPORTANT]
> Each profile entry in the `profiles` array creates exactly **one controller**, regardless of how many DOM elements match the `selector`. If a selector like `.ss__recs__trending` matches three elements, all three will render using the same shared controller. This means a single API request is made per profile, and all matched elements receive the same recommendation data.

### Legacy Block

The legacy block uses individual `script[type="searchspring/recommend"]` tags with a `profile` attribute. Each script tag results in its own controller.

```html
<script type="searchspring/recommend" profile="trending"></script>
<script type="searchspring/recommend" profile="similar">
	product = 'SKU-123';
</script>
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `client` | `Client` | The Searchspring API client instance. |
| `tracker` | `Tracker` | The tracker instance for analytics. |
| `logger` | `Logger` | The logger instance. |
| `controller` | `Record<string, RecommendationController>` | Map of created controllers keyed by controller ID (e.g. `recommend_trending_0`). |
| `config` | `RecommendationInstantiatorConfig` | The configuration passed to the constructor. |
| `context` | `ContextVariables` | Merged context from constructor and config. |
| `targeter` | `DomTargeter` | The DOM targeter instance that finds script block elements. |

## Methods

### `plugin(func, ...args)`
Registers a plugin to be applied to all controllers created by this instantiator. Plugins registered before controller creation are applied when the controller is created.

### `on(event, ...func)`
Registers middleware for a specific event (e.g. `beforeSearch`, `afterSearch`, `afterStore`) on all controllers.

### `use(attachments)`
Registers an `Attachments` object containing plugins and/or middleware to be applied to all controllers.

### `cleanupStaleControllers()`
Removes controllers whose targeted elements are no longer connected to the DOM. This is called automatically before each new controller is created, but can also be called manually for SPA navigation cleanup.

## Branching
Branching allows for branch builds of templates. For production-ready templates, please ensure you are on the repository's default branch (typically `production`) before running `snapfu recs sync`.

If you plan to utilize template branching, `instantiators.recommendation.config.branch` must define the current git branch name. Otherwise, a fallback value with the repository default branch name (typically `production`) should be defined. The `BRANCHNAME` can be defined at runtime via webpack's `DefinePlugin`

```js
const webpack = require('webpack');
const childProcess = require('child_process');
const branchName = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
module.exports = {
    ...
    plugins: [
		new webpack.DefinePlugin({
			BRANCHNAME: `"${branchName}"`,
		}),
	],
}
```

```js
// src/index.js

const snap = new Snap({
    client: {
        globals: {
            siteId: 'REPLACE_WITH_YOUR_SITE_ID',
        },
    },
    instantiators: {
		recommendation: {
			components: {
				Default: async () => {
					return (await import('./components/Recommendations/Recs')).Recs;
				},
			},
			config: {
				branch: BRANCHNAME || 'production',
			},
		},
	},
});
```