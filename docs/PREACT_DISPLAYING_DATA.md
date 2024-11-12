## Displaying Data

At this point you are ready to start building components that render data from the controller's store. Here are a few common store properties and suggested usage in components. If you have used Snapfu to start with a template, these component examples will already be included.

## All Stores

All of the following properties are available on all stores (Search, Autocomplete, Finder, & Recommendations)

### controller.store.loaded

The `loaded` property will be true when the store has been loaded with data and is available to be consumed. This property is recommended to conditionally render a component.

### controller.store.loading

The `loading` property will be true is a network request is in progress. This property is recommended to conditionally render a loading status (ie. spinning icon or loading bar)

### controller.store.custom

See [`custom` property](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)

## Search Store

The following properties are specific to a Search Store via a Search Controller.


### SearchController.store.merchandising

The `merchandising` property contains merchandising redirects and banner content. It is recommended to utlizing the `<Banner/>` component from `@searchspring/snap-preact-components` to display the various merchandising banners.

The available banner types include: `header`, `banner`, `footer`, `left`, `inline`

For inline banners, the `<InlineBanner/>` component should be used instead. An example of this usage can be found in the 'store.results' section below.

```jsx
import { Banner } from '@searchspring/snap-preact-components';

@observer
export class Content extends Component {
	render() {
		const controller = this.props.controller;
		const { store } = controller;
		const { pagination, merchandising } = store;

		return (
			store.loaded && (
				<ControllerProvider controller={controller}>
					<div class="ss__content">
						<Banner content={merchandising.content} type="header" />
						<Banner content={merchandising.content} type="banner" />
						<SearchHeader />
						{
							pagination.totalResults > 0 
							? (<Results />) : 
							(<NoResults />)
						}
						<Pagination />
						<Banner content={merchandising.content} type="footer" />
					</div>
				</ControllerProvider>
			)
		);
	}
}
```

### SearchController.store.search

The `search` property contains information about the current query, typically displayed above results and used in combination with the `store.pagination` data.

```jsx
@withController
@observer
export class SearchHeader extends Component {
	render() {
		const { controller } = this.props;
		const { store } = controller;
		const { pagination, search } = store;
		const originalQuery = search.originalQuery;

		return (
			store.loaded && (
				<div class="ss__search-header">
					{pagination.totalResults ? (
						<h1 class="ss__search-header--results">
							{`Showing `}
							{pagination.multiplePages && <span class="ss__search-header__count-range">{` ${pagination.begin} - ${pagination.end} of `}</span>}
							<span class="ss__search-header__count-total">{pagination.totalResults}</span>
							{` result${pagination.totalResults == 1 ? '' : 's'}`}
							{search?.query && (
								<span>
									{` for `}
									<span class="ss__search-header__query">"{search.query.string}"</span>
								</span>
							)}
						</h1>
					) : (
						pagination.totalResults === 0 && (
							<h1 class="ss__search-header--noresults">
								{search?.query ? (
									<span>
										No results for <span class="ss__search-header__query">"{search.query.string}"</span> found.
									</span>
								) : (
									<span>No results found.</span>
								)}
							</h1>
						)
					)}

					{originalQuery && (
						<div class="ss__oq">
							Search instead for "<a href={originalQuery.url.href}>{originalQuery.string}</a>"
						</div>
					)}
				</div>
			)
		);
	}
}
```

### SearchController.store.pagination

The `pagination` property is not only used for information about the current query, but also contains everything needed for handling pagination of a query that yields multiple pages. Invoking the `getPages` method will retrieve the specified number of page objects. For more about the pagination store, checkout the [Search Controller docs](#/package-controller-search).

```jsx
@withController
@observer
export class Pagination extends Component {
	render() {
		const controller = this.props.controller;
		const {
			store: { pagination },
		} = controller;
		const pages = pagination.getPages(5);

		return (
			<div class="ss__pagination">
				{pagination.previous && (
					<span class="ss__pagination__prev">
						<a {...pagination.previous.url.link} title="Previous">
							Prev
						</a>
					</span>
				)}

				{pages.map((page) => (
					<span key={page.key} class={`ss__pagination__page ${page.active ? 'ss__pagination__page--current' : ''}`}>
						<a {...page.url.link}>{page.number}</a>
					</span>
				))}

				{pagination.next && (
					<span class="ss__pagination__next">
						<a {...pagination.next.url.link} title="Next">
							Next
						</a>
					</span>
				)}
			</div>
		);
	}
}
```

### SearchController.store.sorting

The `sorting` property contains sorting options applicable to the current query. Typically used to render a `<select>` dropdown of sorting options. 

Sorting settings can be configured in the [Searchspring Management Console](https://manage.searchspring.net/)

```jsx
@withController
@observer
export class SortBy extends Component {
	render() {
		const controller = this.props.controller;
		const { sorting } = controller.store;

		return (
			sorting.length !== 0 && (
				<div class="ss__sorting">
					<label for="ss__sort--select">Sort</label>

					<select
						name="ss__sort--select"
						id="ss__sort--select"
						onChange={(e) => {
							const selectedOption = sorting.options.filter((option) => option.value == e.target.value).pop();
							selectedOption && selectedOption.url.go();
						}}
					>
						{sorting.options.map((option) => (
							<option value={option.value} selected={option.value === sorting.current.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			)
		);
	}
}
```

### SearchController.store.results

The `results` property contains an array of result objects for the current page.

Each result object contains the following notable properties:

`result.type` will be 'product' or 'banner' (inline banner)

`result.mappings.core` core attributes configured in the [Searchspring Management Console](https://manage.searchspring.net/)

`result.attributes` remaining attributes

`result.mask` provides a way to temporarily modify result data without changing the underlying store data. This can be used in combination with the `result.display` for simple UI effects like showing alternate product images on hover, or more complex interactions like updating displayed prices when selecting different product variants.

`result.mask.merge` a function to merge new mask data with the current display state. This function accepts a single object as its only parameter.

`result.mask.set` a function to set the mask data. Overwrites the current mask data. This function accepts a single object as its only parameter.

`result.mask.clear` a function to clear the mask data, reverting to the original display state.

`result.display` an object containing the current display state for the result. This can be used in combination with the `result.mask` to update the result display state.

`result.variants` contains information about product variants like size and color options (requires variants to be enabled and configured - see Variants Info section below)

`result.custom` an empty object that is not modified by core Snap packages. This is available for you to modify and store custom data to be rendered. See [`custom` property](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)

Note: if you will be creating a custom Result component, be sure to include intellisuggest product click tracking. Available via `controller.track.product.click()` as seen in the example below. This should be invoked `onClick` or `onMouseDown` on each Result.

```jsx
@withController
@observer
export class Results extends Component {
	render() {
		const controller = this.props.controller;
		const { results } = controller.store;

		return (
			<ul class="ss__results">
				{results.map((result) => (
					<li class="ss__result" key={result.id}>
						{{
							banner: <InlineBanner banner={result} />,
						}[result.type] || <Result result={result} />}
					</li>
				))}
			</ul>
		);
	}
}

@withController
@observer
class Result extends Component {
	render() {
		const { result } = this.props;
		const {
			attributes,
			mappings: { core },
		} = result.display;
		const intellisuggest = (e) => controller.track.product.click(e, result);

		return (
			result && (
				<div>
					<a href={core.url} onClick={intellisuggest}>
						{core.name}
					</a>
					<hr />
					<Price value={core.price} />
				</div>
			)
		);
	}
}
```


### Variants
When variants are enabled, each result (in controller.store.results) contains a variants object with the following properties:

`variants.active` - The currently selected variant's data.

`variants.data` - Array of all variant data.

`variants.selections` - Contains variant selection data (see below).


and the following functions:

`variants.setActive` - Function to update the selected variant.

`variants.update` - Updates the variant data (see below for more details).

`variants.makeSelections` - For internal usage only.

`variants.refineSelections` -  Updates available variant options based on current selections to prevent invalid combinations


To enable variants:

1. Get variant data from your platform. See supported platform groovy scripts [here](https://searchspring.github.io/snap/#/package-platforms).

2. Configure the variant field (typically named `ss_variants`) to display in the [Searchspring Management Console](https://manage.searchspring.net/).

3. Configure controllers to use the variant field by setting `controller.config.settings.variants.field`. 
	Example -

```typescript
const config = {
	instantiators: {
		recommendation: {
			components: {
				Bundle: async () => (await import('./components/Recommendations/Bundle/Bundle')).Bundle,
			},
			config: {
				settings: {
					variants: {
						field: 'ss_variants'
					},
				},
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					settings: {
						variants: {
							field: 'ss_variants'
						},
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```

### result.variants.update
The `variants.update` function updates variant data after store initialization. It accepts new variant data as its only parameter and is useful when you need to fetch and apply external data (like pricing, inventory, or swatch information) after the initial page load. Example -

```typescript
snap.getController('search').then((search) => {
	search.on('afterStore', async(eventData, next) => {
		search.store.results.forEach((result) => {
			//fetch new variant data from external source
			const newVariantData = await fetchVariantData(result.id);
			//update the variant data in the result 
			result.variants.update(newVariantData);
		});
		await next();
	});
});
```

### result.variants.selections
The `result.variants.selections` object provides functionality for building variant option picker components to use in your result components. It contains the following properties:

`selections.field` - The name of the selection field (e.g. "Color", "Size").

`selections.selected` - Details about the currently selected selection value (type: VariantSelectionValue).

`selections.previouslySelected` - Details about the previously selected selection value (type: VariantSelectionValue).

`selections.values` - Array containing all available selection values and their details (type: VariantSelectionValue[]).


And the following Functions:

`selections.refineValues` - For Internal use only.

`selections.reset` - Resets the variant selection to its default state.

`selections.select` - Selects a variant option by its value (e.g. selection.select('blue')).


```typescript
export type VariantSelectionValue = {
	value: string;
	label?: string;
	thumbnailImageUrl?: string;
	backgroundImageUrl?: string;
	background?: string;
	available?: boolean;
};
```

Here is an example of a selection component using the variants.selections object. 
```jsx
const selections = result.variants.selections

selections.forEach(selection => (
	<div className="ss__selection">
		<h5 className="ss__selection_field">{selection.field}</h5>
		<ul className="ss__selection__options">
			{selection.values.map((option) => {
				const selected = selection.some((select) => select.value == option.value);
				return (
					<li
						className={`ss__selection__options__option `, {
							'ss__selection__options__option--selected ': selected,
							'ss__selection__options__option--unavailable ': option?.available === false,
						}}
						onClick={(e) => selection.select(option.value)}
						title={option.label}
						role="option"
						aria-selected={selected}
					>
						<label className="ss__selection__options__option__label">{option.label || option.value}</label>
					</li>
				);
			})}
		</ul>
	</div>
)) 
```

### SearchController.store.facets

The `facets` property contains an array of facet objects for the current query.

Each result object contains the following notable properties:

`facet.collapsed` facet collapse state. Facets can be configured to start collapsed by default in the [Searchspring Management Console](https://manage.searchspring.net/)

`facet.toggleCollapse` a method that toggles the collapse state for this facet

`facet.clear` a method to remove the facet if it is currently active

`facet.label` the facet label to display (ie. Price, Size, Brand)

`facet.field` the raw facet field name

`facet.display` the facet display type - used to conditionally render different facet components. Available display types: `list` (default), `grid`, `palette`, `hierarchy`, `slider`. Facet display types can be configured in the [Searchspring Management Console](https://manage.searchspring.net/)

The example below displays a custom `FacetOptionsList` component for facets with a display type of `list`.

The `@searchspring/snap-preact-components` component library includes the following components that can be imported or used as a reference: `FacetListOptions`, `FacetGridOptions`, `FacetPaletteOptions`, `FacetHierarchyOptions`, `FacetSlider`

`facet.type` the facet type - Available facet types: `range`, `value`, `range-buckets`. 

Facets that contain a `type` value of `range` will not contain any `values` as this is typically used as a Slider. Instead, the facet will include `range.low`, `range.high`, `active.low`, and `active.high` properties.

Facets with a `type` value of `value` or `range-buckets` will contain the following properties:

`facet.search.input` facet search within - setting this will dynamically filter the facet `values` array to only include values that match the `facet.search.input` substring

`facet.overflow.setLimit` method to set the number of values to display before overflow occurs

`facet.overflow.toggle` method to toggle overflow of a facet, typically invoked `onClick` event of a facet 'show more' button

`facet.refinedValues` facet values that have been limitied if any overflow or search within is active; this should be used to render facet values from components

`facet.values` original facet values - it is not recommended to directly render facet values using this in your components - `facet.refinedValues` should be used instead - however, if you are using an `afterStore` event to reference facet values, `facet.values` should be used

```jsx
@withController
@observer
export class Facets extends Component {
	render() {
		const { facets } = this.props.controller.store;

		return (
			facets.length !== 0 && (
				<div class="ss__facets">
					{facets.map((facet) => (
						<Facet facet={facet} />
					))}
				</div>
			)
		);
	}
}

@withController
@observer
export class Facet extends Component {
	render() {
		const { facet } = this.props;

		return (
			facet && (
				<div class="ss__facet">
					<h5
						onClick={() => {
							facet.toggleCollapse();
						}}
					>
						{facet.label}
					</h5>

					<div class={`ss__facet--field-${facet.field} ss__facet--display-${facet.display} ${facet.collapsed ? 'ss__facet--collapsed' : ''}`}>
						<div class="collapsible-content__inner">
							{{
								grid: <div>grid component</div>,
								palette: <div>palette component</div>,
								hierarchy: <div>hierarchy component</div>,
								slider: <FacetSlider facet={facet} />,
							}[facet.display] || <FacetOptionsList facet={facet} />}
						</div>
					</div>
				</div>
			)
		);
	}
}

@observer
class FacetOptionsList extends Component {
	render() {
		const facet = this.props.facet;
		const values = facet.refinedValues;

		return (
			<ul class="ss__facet-options-list">
				{values.map((value) => {
					return (
						<li class={`ss__facet-options-list__option ${value.filtered ? 'ss__facet-options-list__option--active' : ''}`}>
							<a {...value.url.link} title={`Remove filter ${value.label}`}>
								{value.label}
							</a>
						</li>
					);
				})}
			</ul>
		);
	}
}
```


### SearchController.store.filters

The `filters` property contains an array of filters that are currently applied to the query.

Typically used to display a filter summary with options to remove filters.

```jsx
@withController
@observer
export class FilterSummary extends Component {
	render() {
		const controller = this.props.controller;
		const {
			store: { filters },
		} = controller;

		return (
			filters.length !== 0 && (
				<ul class="ss__filters">
					{filters.map((filter) => (
						<li class="ss__filters__filter">
							<a {...filter.url.link} title={`Remove filter ${filter.label}`}>
								{filter.label}
							</a>
						</li>
					))}
				</ul>
			)
		);
	}
}
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

