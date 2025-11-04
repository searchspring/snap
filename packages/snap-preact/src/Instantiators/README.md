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
| `config.middleware` | `object` | No | Event middleware configuration. |
| `config.plugins` | `PluginGrouping[]` | No | Plugin configurations. |
| `selector` | `string` | No | Custom selector for targeting script elements. Defaults to `'script[type="searchspring/recommend"], script[type="searchspring/personalized-recommendations"]'`. |
| `url` | `UrlTranslatorConfig` | No | URL translation configuration for state management. |
| `context` | `ContextVariables` | No | Context variables available to components. |


`*` Required if no corresponding service is provided in the constructor

<!-- TODO: Add Examples -->

## Branching
Branching allows for branch builds of templates. For production-ready templates, please ensure you are on the repository's default branch (typically `production`) before running `snapfu recs sync`.

If you plan to utilize template branching, `instantiators.recommendation.config.branch` must define the current git branch name. Otherwise, a fallback value with the repository default branch name (typically `production`) should be defined. The `BRANCHNAME` can be defined at runtime via webpack's `DefinePlugin`

```javascript
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

```typescript
// src/index.ts

const snap = new Snap({
    client: {
        globals: {
            siteId: 'abc123',
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