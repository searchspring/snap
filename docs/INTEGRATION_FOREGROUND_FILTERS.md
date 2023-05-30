## Foreground Filters
***Note:*** **Foreground filters are only usable with a SearchController.**

Foreground filters provide a way for pre-applying a filter on page load. The applied filter will be applied to the URL and can be removed as any other applied filter would. Foreground filtering is accomplished by setting the inital UrlManager state; this can be used for setting various states, but only filtering will be covered in this document.

In the simplified example below, a foreground filter is used to pre-apply a filter for the `on_sale` field. 

```typescript
const config = {
	client: {
		globals: {
			siteId: 'abc123',
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

```typescript
const config = {
	client: {
		globals: {
			siteId: 'abc123',
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

```typescript
const config = {
	client: {
		globals: {
			siteId: 'abc123',
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