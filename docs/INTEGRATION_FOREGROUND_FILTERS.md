## Foreground Filters
Foreground filters allow a page to be refined on initial load and displaying the active filter to the end-user. These filters can then be removed and modified by the end-user. 

In this example, we'll set a foreground filter via the url translator config in the search controller settings. 

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
						state: {
							filter: {
								color_family: ['Blue'],
							},
						},
					}
				},
				config: {
					id: 'search',
					globals: {
						filters: backgroundFilters,
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```


The `initial.state` object takes `urlManager.state` values, such as filter, sort, page, and pageSize. Although this is more commonly to be used with filter. 

There is also an optional `ignoreList` param you can set on the `initial` object. This will allow certain state values to be set initially via the url while also maintaining & merging the `initial.state` object. See example where the `initial.state` filter `color_family:blue` will be set even if there are other `filter` params present in the url manager state. 

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
						state: {
							filter: {
								color_family: ['Blue'],
							},
						},
						ignoreList: ['filter']
					}
				},
				config: {
					id: 'search',
					globals: {
						filters: backgroundFilters,
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```