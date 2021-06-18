# SearchStore
The search store is meant to hold the search API response and associated state. It extends the AbstractStore and the search response by adding several additional properties and methods to make working with the data easier.

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring [Meta API](https://snapi.kube.searchspring.io/api/v1/#tag/Meta). The majority of this data is used elsewhere in constructing other SearchStore data like 'sorting' and 'facets'.

## `merchandising` property

Contains redirect and banner merchandising data returned by the Search API.

`merchandising.redirect` - merchandising redirect URL

`merchandising.content` - merchandising banner object that has `ContentType` key and value containing an array of single or more banners.

```typescript
enum ContentType {
    HEADER = 'header',
    BANNER = 'banner',
    FOOTER = 'footer',
    LEFT = 'left',
    INLINE = 'inline',
}
```

## `search` property
Contains information about the query that was requested from the Search API.

`search.query` - Query object - query that was searched

`search.didYouMean` - Query object - suggested query when no results are found

`search.originalQuery` - Query object - original query if spell correction occurred

### Query object
An Query object contains the respective query `string` and generated query `url`.

```typescript
{
	string: 'dress',
	url: '/?q=dress'
}
```

An example in JSX:

```jsx
{
	search?.originalQuery && 
	<div>
		Search instead for "<a href={ search.originalQuery.url }>{ search.originalQuery.string }</a>"
	</div>
}
```

## `facets` property

Contains an array of facet objects pertaining to the current query. The facet objects will be a superset of the API response with several helper funcitons and properties added on.

All facets contain the following base properties:

```typescript
{
	type: 'range',
	field: 'ss_price',
	filtered: false,
	custom: {},
	collapse: false,
	display: 'slider',
	label: 'Price',
	storage: {},
}
```

### `type` property

The type property will be one of three values:

#### `value` type
This is the default facet type.

#### `range` type
Range facets can only apply to a field that contains all numerical values. It is typically seen in use for price sliders.

In addition to the base properties, facets of type `range` will contain the following properties:

```typescript
{
	step: 5,
	range: {
		low: 0,
		high: 0
	},
	active: {
		low: 0,
		high: 0
	},
	formatSeparator: '',
	formatValue: ''
}
```

#### `range-buckets` type
Similar to value facets, with the added ability to group values into "buckets".

For example, a price facet with a range-buckets type would typically be used to create the following groups:
```
Less than $10
$10 - $20
$20 - $50
$50 and up
```

### `field` property

Contains the field name, ie. 'ss_price'.

### `filtered` property

If any of the facet's values have been filtered, the facet `filtered` property will be `true`.

### `custom` property
This is an empty object that has automatically been marked as an observable by MobX. This is the preferred place to place custom facet state.

Example inside of a `SearchController` middleware:
```typescript
cntrlr.on('afterStore', async ({ controller }, next) => {
	controller.store.facets.forEach(facet => {
		facet.custom.description = `Choose a ${facet.label}...`;
	})
	await next();
});

cntrlr.on('afterStore', async ({ controller }, next) => {
	const colorFacet = controller?.store?.facets.filter((facet) => facet.field == 'color_family').pop();
	colorFacet?.values.forEach((value) => {
		value.custom = {
			colorImage: `www.storfront.com/images/swatches/${value.value}.png`,
		};
	});

	await next();
});
```

### `collapse` property

Collapse state that will contain an initial state that can be defined in the Searchspring Management Console, or toggled programmatically using `toggleCollapse()`.


### `display` property
Contains the facet display type as configured in the Searchspring Management Console.

```typescript
enum FacetDisplay {
	GRID = 'grid',
	PALETTE = 'palette',
	LIST = 'list',
	SLIDER = 'slider',
	HIERARCHY = 'hierarchy',
}
```

### `label` property
Contains the facet label as configured in the Searchspring Management Console.

### `storage` property
This is a reference to the `StorageStore` instance that is used to store the current facet state for `collapse` and `overflow`; this preserves these states as additional API queries are made (think faceting, pagination, etc...). The `SearchStore` automatically manages this stored state.

### `step` property
Only applicable to facets where `type` is `range`.

The step value is calculated by the API based on the min and max values of the range. It is typically used to set the step attribute of an input element:

```jsx
<input type="range" step={facet.step} min={facet.active.low} max={facet.active.high} />
```

### `range` property
Only applicable to facets where `type` is `range`.

Contains an object with `low` and `high` properties. This represents the absolute low and high that are available.

### `active` property
Only applicable to facets where `type` is `range`.

Contains an object with `low` and `high` properties. This represents the currently 'active' or filtered low and high values.

### `formatSeparator` property
Only applicable to facets where `type` is `range`.

The text to separate `min` and `max` values. Typically set to `-` and is configured in the Searchspring Management Console.


### `formatValue` property
Only applicable to facets where `type` is `range`.

A [printf format string](https://en.wikipedia.org/wiki/Printf_format_string) for how to format numerical values.

Configurable in the Searchspring Management Console and typically set to `$%01.2f`.

For example, `9.99` with a formateValue of `$%01.2f` will be formatted to `$9.99`.

### `values` property
Only applicable to facets where `type` is `value` or `range-buckets`.

Contains an array of facet value objects for this facet.

#### `values` object with facet type `value`

If the facet `display` property is `hierarchy`, the object will contain the following properties:

`level` - numerical hierarchy level, set to `0` if no hierarchy selections have been selected yet

`history` - boolean set to true if the value's level is less than or equal to the filtered level

Otherwise, If the facet `display` property is `palette`, `list`, or `slider`, the object will contain the following properties:

`label` - inherited from facet

`count` - inherited from facet

`filtered` - inherited from facet

`value` - inherited from facet

`custom` - inherited from facet

`url` - generated URL for this value

#### `values` object for type `range-buckets`
Object will contain the following properties:

`label` - inherited from facet

`count` - inherited from facet

`filtered` - inherited from facet

`low` - inherited from facet

`high` - inherited from facet

`custom` - inherited from facet

`url` - generated URL for this value


### `search` property
Only applicable to facets where `type` is `value` or `range-buckets`

An object with a single key:

`input` - search term to filter values

Typical usage is to use this with a search input for each facet, allowing a user to filter a large list of facet values.


<h3 id="SearchFacetsMultiple">`multiple` property</h3>

Only applicable to facets where `type` is `value` or `range-buckets`

Facet `multiple` can be configured per facet in the Searchspring Management Console to the following values:

`single` - a facet can only contain a single active selection at any given time

`or` - a facet can have multiple active selections and the filtered results will contain a result set that matches any selections. For example, selecting a 'shoe size' facet value of '12' and '12.5' will yield results containing any shoe size of '12' or '12.5'

`and` - a facet can have multiple active selections and the filtered results will contain a result set that matches all selected values. For example, selecting a 'color' facet value of 'red' and 'pink' will yield results that contain both a 'color' of 'red' and 'pink' variants

```typescript
enum FacetMultiple {
	SINGLE = 'single',
	OR = 'or',
	AND = 'and',
}
```


### `overflow` property
Only applicable to facets where `type` is `value` or `range-buckets`

Facet overflow state to handle the 'show more' facet functionality. 

#### `enabled` property
Boolean containing the overflow active state

#### `limited` property
Boolean containing the saved overflow active state from StorageStore. This allows the state to be remembered across page navigation via StorageStore.

#### `limit` property
Number of values to display before overflow occurs

#### `remaining` property
Number of values remaining in the overflow.  `remaining = values.length - overflow.limit`

#### `setLimit` function
Set limit value. This is the number of values to display before the remaining values overflow

```typescript
facet.overflow.setLimit(10)
```

#### `toggle` function
Toggles collapse state. 

Typical usage would be to invoke `toggle` when the 'show more/less' is clicked.

```typescript
facet.overflow.toggle()
```

#### `calculate` function
Recalculates overflow state. Is also invoked when `setLimit` or `toggle` has been invoked.


<h2 id="SearchStoreFilters">`filters` property</h2>

Contains an array of filter object for the refined query requested to the Search API

### `filter` type `range` object
Filter objects that contain a filter `type` of `range`, will have the following properties:

`facet` - an object containing the following properties: `field` - facet field name & `label` - facet label

`value` - an object containing the following properties: `low` - facet low value & `high` - facet high value & `label` - facet label

`label` - value label is prepended with facet label, ie. `` `${filter.facet.label}: ${filter.value.label}` ``

`url` - generated URL for this value

### `filter` type `value` or `range-buckets` object
Filter objects that contain a filter `type` of `value` or `range-buckets`, will have the following properties:

`facet` - an object containing the following properties: `field` - facet field name & `label` - facet label

`value` - an object containing the following properties: `value` - facet value & `label` - facet label

`label` - value label is prepended with facet label, ie. `` `${filter.facet.label}: ${filter.value.label}` ``

`url` - generated URL for this value


<h2 id="SearchStoreResults">`results` property</h2>

Contains an array of products that matched the query to the Search API. This will also include any merchandising inline banners.

### `type` property
The `type` property has two possible values:

- `product` - a product entry

- `banner` - an inline banner entry

### `id` property
Internal product id.

If `type` is `banner`, id will be set to `` `ssid-${banner.config.position.index}` ``

### `attributes` property
Only applicable to results with `type` of `product`
Product attributes object. Will contain all attributes that have been indexed and enabled in the Searchspring Management Console

```json
"attributes": {
	"intellisuggestData": "eJwrTs4tNM9jYGBw1nV00Q031DW0MLMMYDAEQmMDBhMTMwOG9KLMFACyXAiS",
	"intellisuggestSignature": "25f3b12a880fa4342274c97a9c105f0736c026e71b12ca0a7b297e357b099b7d",
	"ss_insights_quadrant": "Best Performer",
	"gross_margin": "70",
	"ss_product_type": "Dress",
	"keywords": [
		"off the shoulder",
		"striped",
		"stripes",
		"stripe",
		"open shoulder",
		"open back",
		"preppy",
		"seersucker",
		"white",
		"white dress",
		"white",
		"summer",
		"spring"
	],
	"color": [
		"White",
		"Navy",
		"Cream"
	],
	"dress_length_name": "Mini",
	"multi_colors": "yes",
	"pattern": "Stripe",
	"description": "Are you Stripe Out of ideas for what to wear this weekend on that trip you've got coming up with your friends? Afraid you'll be the odd one out and everyone else will be all cute and trendy and there you'll be ... not trendy and wearing the same old things you've been wearing on this annual getaway for years? Lucky for you, here's the dress you've been searching for. Doesn't matter what else you pack (it does, you'll want to continue to shop with us, we were just being nice) this is the piece that will set you apart from everyone else (that is absolutely true, you will be a Goddess among women). Take that, bad fashion moments of the past! Striped dress features 3/4 sleeve bell sleeves with a partially elastic/open back. Model is wearing a small. • 97% Cotton 3% Spandex • Machine Wash Cold • Lined • Made in the USA",
	"title": "Stripe Out White Off-The-Shoulder Dress",
	"ss_clicks": "4141",
	"saturation": "low",
	"color_family": [
		"White"
	],
	"sales_rank": "4461",
	"ss_sale_price": "48",
	"season": "Summer",
	"ss_category_hierarchy": [
		"Shop By Trend",
		"All Dresses",
		"All Dresses&gt;Casual Dresses",
		"Shop By Trend&gt;Spring Preview",
		"All Dresses&gt;Shop by Color",
		"All Dresses&gt;Print Dresses",
		"Gifts for Her",
		"Shop By Trend&gt;Off The Shoulder Trend",
		"Gifts for Her&gt;Gifts Under $50",
		"All Dresses&gt;Shop by Color&gt;White Dresses"
	],
	"on_sale": "No",
	"condition": "New",
	"product_type": [
		"All Dresses &gt; Shop by Color &gt; White Dresses",
		"All Dresses &gt; Shop by Color",
		"All Dresses &gt; Print Dresses",
		"Shop By Trend &gt; Off The Shoulder Trend",
		"Shop By Trend &gt; Spring Preview",
		"All Dresses &gt; Casual Dresses",
		"Gifts for Her",
		"Gifts for Her &gt; Gifts Under $50"
	],
	"brightness": "high",
	"size": [
		"Small",
		"Medium",
		"Large"
	],
	"material": "Cotton",
	"days_since_published": "8",
	"dress_length": "34",
	"size_dress": [
		"Small",
		"Medium",
		"Large"
	],
	"quantity_available": "13",
	"popularity": "4461",
	"product_type_unigram": "dress",
	"id": "7790a0f692035da40c8504e8b7a9f31d"
}
```

### `mappings.core` property
Only applicable to results with `type` of `product`

Core product attributes object

```json
"mappings": {
	"core": {
		"uid": "182146",
		"price": 48,
		"msrp": 50,
		"url": "/product/C-AD-W1-1869P",
		"thumbnailImageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_thumb_med/4468_copyright_reddressboutique_2017__thumb_med.jpg",
		"imageUrl": "https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/4468_copyright_reddressboutique_2017__large.jpg",
		"name": "Stripe Out White Off-The-Shoulder Dress",
		"sku": "C-AD-W1-1869P",
		"brand": "Adrienne"
	}
},
```


### `custom` property
This is an empty object that is available for custom store manipulation using the [EventManager](https://github.com/searchspring/snap/tree/main/packages/snap-event-manager)



### `config` property
Only applicable to results with `type` of `banner`

Banner config object inherited from merchandising inline banner `config` object

### `value` property
Only applicable to results with `type` of `banner`

Banner value inherited from merchandising inline banner `value` property


## `pagination` property

Contains pagination information for the query that was requested from the Search API

### `page` property
The current page

### `pageSize` property
The number of products displayed per page

### `defaultPageSize` property
The default number of results per page. Default is `24`.

### `pageSizeOptions` property
An array of objects containing results per page options. Typically used in a `<select>` dropdown to change the number of results displayed per page.

`label` - label text to display

`value` - number of results for this selection

Default values:
```typescript
[
	{
		label: `Show ${this.defaultPageSize}`,
		value: this.defaultPageSize,
	},
	{
		label: `Show ${this.defaultPageSize * 2}`,
		value: this.defaultPageSize * 2,
	},
	{
		label: `Show ${this.defaultPageSize * 3}`,
		value: this.defaultPageSize * 3,
	},
]
```

### `totalResults` property
The total results for the current query.

### `begin` getter
The number of the first product position on the current page.
For example, if the `pageSize` is `24` and the current page is `2`, `pagination.begin` will return `25`.

### `end` getter
The number of the last product position on the current page.
For example, if the `pageSize` is `24` and the current page is `2`, `pagination.begin` will return `48`.

### `totalPages` getter
The total number of pages.

### `multiplePages` getter
Boolean returned showing if there is more than one page.

### `current` getter
Returns a `Page` object of the current page.

### `first` getter
Returns a `Page` object of the first page.

### `last` getter
Returns a `Page` object of the last page.

### `next` getter
Returns a `Page` object of the next page.

### `previous` getter
Returns a `Page` object of the previous page.

### `getPages` method
Returns an array of `Page` objects.

Typical usage to retrieve 5 pages:
```typescript
const pages = getPages(5) // 1, 2, *3*, 4, 5
```

Typical usage to retrieve 2 pages to the left, and 5 pages to the right of the active page
```typescript
const pages = getPages(2, 5) // 2, 3, *4*, 5, 6, 7, 8
```

<!-- TODO: confim example is correct -->

### `setPageSize` method
Sets `pageSize` and performs a query. Typical usage would be to invoke `setPageSize` on the `onChange` event the results per page dropdown:

```jsx
onChange={(e) => {
	pagination.setPageSize(e.target.value);
}}
```

### `Page` object
A page object is returned when invoking the following getters/methods: `current`, `first`, `last`, `next`, `previous`, `getPages`.

#### `number` property
The number of the page.

#### `active` property
Boolean showing if this page is the 'active' or current page.

#### `url` property
Set to an instance of UrlManager for the page. Typical usage would be to tie into the linker of the UrlManager and attach the `href` and `onclick` properties.

#### `key` property
A unique value (set to `url.href`) available to use as a `key` prop when rendering [react keys](https://reactjs.org/docs/lists-and-keys.html).


## `sorting` property

Contains sorting information that was requested from the Meta API.

### `options` property
An array of sorting Option objects.

### `current` getter
Returns an `Option` object of the current selected sort option

### `Option` object

#### `active` property
Boolean set `true` if this option is the current selection

#### `default` property
Boolean set `true` if this option is the first selection

#### `field` property
The field name of the sorting option ie. 'ss_price'

#### `label` property
Label of this sorting, ie. 'Price'

#### `direction` property
Sorting direction. It will be one of two possible values:

`asc` - ascending

`desc` - descending

#### `type` property
Sorting type. Will be one of two possible values:

`field` - the Option is sorting using a field

`relevance` - the Option is sorting by relevance

#### `value` property
The value of the sorting Option, set to `` `${option.field}:${option.direction}` ``, ie. 'ss_price:asc'

#### `url` property
Set to an instance of UrlManager for the sorting Option. 