# Foreground Filters

> [!NOTE]
> Foreground filters are only usable with a SearchController

Foreground filters provide a way for pre-applying a filter on page load. The applied filter will be applied to the URL and can be removed as any other applied filter would. Foreground filtering is accomplished by setting the initial UrlManager state; this can be used for setting various states, but only filtering will be covered in this document.


| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `initial.settings` | Object | ➖ | - | Global configuration settings for initial state |
| `initial.settings.ignoreParameters` | string[] | ➖ | `['query', 'tag', 'oq', 'fallbackQuery']` | Parameters to ignore when determining whether to apply initial state |
| `initial.settings.useDefaultIgnoreParameters` | boolean | ➖ | `true` | Whether to use the default ignore parameters list |
| `parameters` | Object | ✔️ | - | UrlManager state parameters to set initially |
| `initial.parameters.filter` | Object | ➖ | - | Filter state configuration |
| `initial.parameters.sort` | Object | ➖ | - | Sort state configuration |
| `initial.parameters.page` | Object | ➖ | - | Page state configuration |
| `initial.parameters.pageSize` | Object | ➖ | - | Page size state configuration |
| `initial.parameters.[custom]` | Object | ➖ | - | Any custom UrlManager state parameter |
| `initial.parameters.[param].state` | Object | ✔️ | - | The actual state values to set for the parameter |
| `initial.parameters.[param].useGlobalIgnoreParameters` | boolean | ➖ | `true` | Whether to use global ignore parameters for this parameter |
| `initial.parameters.[param].action` | 'merge' \| 'set' | ➖ | `'merge'` | How to handle existing state values ('merge' = merge with existing, 'set' = replace completely) |
| `initial.parameters.[param].ignoreParameters` | string[] | ➖ | - | Individual ignore parameters for this specific parameter |

In the simplified example below, a foreground filter is used to pre-apply a filter for the `on_sale` field. 

```js
const config = {
	client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
	controllers: {
		search: [
			{
				url: {
					initial: {
						parameters: {
							filter: {
								state: {
									on_sale: ['yes'],
								}
							},
						},
					}
				},
				config: {
					id: 'search',
				},
			},
		],
	},
};

const snap = new Snap(config);
```


The `initial.parameters` object is keyed by `UrlManager` state parameters - such as filter, sort, page, and pageSize. Any valid `UrlManager` state parameters are available for usage here, even custom parameters; however, filter is the most likely to be used here.

There is also an optional `ignoreParameter` param you can set on the `initial.settings` object, this allows for specifying additional UrlManager state parameters to be added to the ignore list. See example where the `initial.state` filter `on_sale:yes` will be set even if there are other `filter` params present in the UrlManager state. The default values in the `ignoreParameter` are `query`, `tag`, `oq` and `fallbackQuery`. This list is used to determine wether or not to apply the initial state provided - if the UrlManager state contains any states that are not being ignored, the initial state will not be applied.

```js
const config = {
	client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
	controllers: {
		search: [
			{
				url: {
					initial: {
						settings: {
							ignoreParameters: ['filter'],
						},
						parameters: {
							filter: {
								state: {
									on_sale: ['yes'],
								}
							},
						},
					}
				},
				config: {
					id: 'search',
				},
			},
		],
	},
};

const snap = new Snap(config);
```

## Advanced Configuration
Additional advanced configuration is available for special use cases. If you do not wish to use the default `ignoreParameters` you can specify as much using `initial.settings.useDefaultIgnoreParameters`, and setting it to `false`.

More configuration can be made within each `initial.parameter` object. It is possible to specify individual `ignoreParameters` here, which allows for more control for when to apply each individual initial state. Within the parameter configuration it is also possible to opt out of the 'global' `ignoreParameter` settings specified in `initial.settings` by using the `useGlobalIgnoreParameters` configuration. Lastly, there may be cases where it is necessary to replace existing state values instead of merging them (the default action). This is specified in each individual parameter configuration via the `action` configuration; this supports a `merge` or `set` value.

Example using advanced configurations shown below:

```js
const config = {
	client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
	controllers: {
		search: [
			{
				url: {
					initial: {
						settings: {
							ignoreParameters: ['query', 'tag', 'filter'],
							useDefaultIgnoreParameters: false,
						},
						parameters: {
							filter: {
								useGlobalIgnoreParameters: true,
								action: 'set',
								state: {
									on_sale: ['yes'],
								}
							},
						},
					}
				},
				config: {
					id: 'search',
				},
			},
		],
	},
};

const snap = new Snap(config);
```