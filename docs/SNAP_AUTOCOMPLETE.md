# Autocomplete

To set up Autocomplete using Snap, we'll need to define an autocomplete controller in our Snap configuration. See AutocompleteController section for all available configuration options

One notable thing to mention as you may see a duplicate `selector` property in both the `config` and `targeter`.

The `config.selector` specifies the `<input/>` element(s) to attach events to that respond to Autocomplete actions. This supports a selector that targets many elements. 

The `targeter.selector` specifies the DOM node where the `targeter.component` will be rendered into.

However in our example, since they are both the same value, the Autocomplete component will rendered as a child DOM node below the `<input/>` element that is currently focused. 


```ts
// src/index.ts

const snap = new Snap({
    client: {
		globals: {
			siteId: 'abc123',
		},
	},
    controllers: {
        autocomplete: [
            {
                config: {
                    id: 'autocomplete',
                    selector: 'header input[type="search"]',
                    settings: {
                        trending: {
                            limit: 5,
                        },
                        history: {
                            limit: 5,
                        },
                    },
                },
                targeters: [
                    {
                        selector: 'header input[type="search"]',
                        hideTarget: true,
                        component: async () => {
                            return (await import('./components/Autocomplete/Autocomplete')).Autocomplete;
                        },
                    },
                ],
            },
        ],
    },
});
```



## Autocomplete Store

It is recommended to utlizing the `<Autocomplete/>` component from `@searchspring/snap-preact-components` to display Autocomplete.

The following properties are specific to an Autocomplete Store via an Autocomplete Controller.

### AutocompleteController.store.merchandising

See `SearchController.store.merchandising` section above.

### AutocompleteController.store.search

The `search` property contains information about the current query. However unlike SearchController.store.search, AutocompleteController.store.search does not contain a `didYouMean` query. 


### AutocompleteController.store.facets

See `SearchController.store.facets` section above.

In addition, each facet value will contain a `preview` method that should be invoked on the `onFocus` event of a facet value. This method will lock the current facets such that when the store is updated with the filtered results, the original facets do not get replaced with the new facets from the filtered query. 

### AutocompleteController.store.filters

See `SearchController.store.filters` section above.

### AutocompleteController.store.results

See `SearchController.store.results` section above.

### AutocompleteController.store.terms

The `terms` property contains an array of autocomplete terms that are relevant to the query. Each term contains a `preview` method that should be invoked on the `onFocus` event of a term value. This method will lock the current terms and unlock the previous facets (if changing terms with a facet filter applied) such that when the store is updated with the results for the new term, the original terms do not change.

### AutocompleteController.store.trending

The `trending` property contains an array of trending `terms`. Trending terms are not relevant to the current query and are generated from collected reporting data. It is recommended to display trending terms as a starting point when the `<input/>` is focused and does not yet contain a value. Trending terms must be enabled via settings in the AutocompleteController config.


### AutocompleteController.store.pagination

See `SearchController.store.pagination` section above.

### AutocompleteController.store.sorting

See `SearchController.store.sorting` section above.

### AutocompleteController.store.history

The `history` property contains an array of previously searched `terms`. Historical terms are not relevant to the current query and are stored in localstorage. Historical terms can be displayed in the Autocomplete component in place of or in addition to trending and suggested terms. Historical terms must be enabled via settings in the AutocompleteController config.

