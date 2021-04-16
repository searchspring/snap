# Snap MobX Store

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

MobX state management

---

# Dependency

Snap Store MobX is a dependency of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="../../images/snap-dependencies.jpg" />
</details>


# Installation

```bash
npm install --save @searchspring/snap-store-mobx
```


# Usage
## Import
```typescript
import { SearchStore, AutocompleteStore, FinderStore, AbstractStore, StorageStore } from '@searchspring/snap-store-mobx';
```

## Controller usage

Snap Store MobX is a dependency of Snap Controller and it is recommended to use methods of the controller to access the store

See [Typical Usage](../../README.md#TypicalUsage)


## Standalone usage

```typescript
import { SearchStore } from '@searchspring/snap-store-mobx'

const store = new SearchStore();

store.update(data)

console.log(store.toJSON())
```

# AbstractStore

`SearchStore`, `AutocompleteStore`, and `FinderStore` extend `AbstractStore`. Therefore, the following methods and properties are available in all Stores.

## `update` method
Update the store's properties with `data` object that has been retrieved from Searchspring's Search API.

```typescript
const store = new SearchStore();

store.update(data)
```

## `link` method
Links a controller to the Store

```typescript
const store = new AutocompleteStore();
const controller = new AutocompleteController(...)

store.link(controller)
```

## `toJSON` method
Converts store to JSON object

```typescript
console.log(store.toJSON())
```

## `custom` property
This is an empty object that is available for custom store manipulation using the [EventManager](../snap-event-manager)


## `loading` property
Boolean that the controller will set to `true` before an API request is made. Value is updated to `false` after an API request has completed


## `loaded` property
Boolean that is set to `true` if the Store `update` method has been called at least once


# SearchStore

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring [Meta API](http://snapi.kube.searchspring.io/api/v1/#tag/Meta)


<h2 id="SearchStoreMerchandising">`merchandising` property</h2>

Contains redirect and banner merchandising data that the Search API returned

`merchandising.redirect` - merchandising redirect URL

`merchandising.content` - merchandising banner object that has `ContentType` key and value containing an array of single or more banners

### Redirects
Redirects are configured in the Searchspring Management Console

An example of how to handle merchandising redirects:

```typescript
const store = new SearchStore();

store.update(data)

const redirectURL = store?.merchandising?.redirect;

if (redirectURL) {
    window.location.replace(redirectURL);
}
```

### Banner Content
Banners are configured in the Searchspring Management Console

```typescript
{
    [ContentType.HEADER]: ['<p>header banner</p>', '<p>header banner 2</p>']
}
```

```typescript
enum ContentType {
    HEADER = 'header',
    BANNER = 'banner',
    FOOTER = 'footer',
    LEFT = 'left',
    INLINE = 'inline',
}
```

An example of how to retrieve the combined content of all header banners:

```typescript
const headerBannerContent = store?.merchandising?.content['header'].join('');
```

### Inline Banners
Inline banners have a slightly different format:

```typescript
{
	[ContentType.INLINE]: [
        {
            config: {
                position: {
                    index: 0
                }
            },
            value: '<p>inline banner at position index 0</p>'
        },
        {
            config: {
                position: {
                    index: 7
                }
            },
            value: '<p>inline banner at position index 7</p>'
        }
    ]
}
```
<!-- TODO: add more docs for inline banner -->

## `search` property
Contains information about the query that was requested from the Search API

`search.query` - query that was searched

`search.didYouMean` - AlternateQuery object - suggested query after spelling correction

`search.originalQuery` - AlternateQuery object - original query if spell correction occurred

### AlternateQuery object
An AlternateQuery object contains the respective `query` and generated query `url`

```typescript
{
    query: 'dress',
    url: '/?q=dress'
}
```

An example in JSX:

```jsx
{
    search?.originalQuery && 
    <div>
        Search instead for "<a href={ search.originalQuery.url }>{ search.originalQuery.value }</a>"
    </div>
}
```

<h2 id="SearchFacets">`facets` property</h2>

Contains an array of facet object for the query requested to the Search API

All facets will contain the following base properties:

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

<h3 id="SearchFacetsType">`type` property</h3>

The type property will be one of three values:

#### `value` type
This is the default facet type.

#### `range` type
Range facets can only apply to a field that contains all numerical values. It is typically used for price sliders

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
Similar to value facets, with the added ability to group values into "buckets" 

For example, a price facet with a range-buckets type would typically be used to create the following groups:
```
Less than $10
$10 - $20
$20 - $50
$50 and up
```

<h3 id="SearchFacetsField">`field` property</h3>

Contains the field name, ie. 'ss_price'

<h3 id="SearchFacetsFiltered">`filtered` property</h3>

If any of the facet's values have been filtered, the facet `filtered` property will be `true`

### `custom` property
This is an empty object that is available for custom store manipulation using the [EventManager](../snap-event-manager)

A few examples:
```typescript
cntrlr.on('afterStore', async ({ controller }, next) => {
	controller.store.custom.onSaleFacet = controller?.store?.facets.filter((facet) => facet.field == 'on_sale').pop();

	controller.store.facets = controller?.store?.facets?.filter((facet) => facet.field != 'on_sale');

	const colorFacet = controller?.store?.facets.filter((facet) => facet.field == 'color_family').pop();
	colorFacet?.values.forEach((value) => {
		value.custom = {
			colorImage: `www.storfront.com/images/swatches/${value.value}.png`,
		};
	});

	controller.store.results.forEach((result) => {
		result.mappings.core.url = 'http://try.searchspring.com' + result.mappings.core.url;
	});

	await next();
});
```

<h3 id="SearchFacetsCollapse">`collapse` property</h3>

Collapse state that will contain an initial state that can be defined in the Searchspring Management Console, or toggled programmatically


<h3 id="SearchFacetsDisplay">`display` property</h3>
Contains the facet display type as configured in the Searchspring Management Console

```typescript
enum FacetDisplay {
	GRID = 'grid',
	PALETTE = 'palette',
	LIST = 'list',
	SLIDER = 'slider',
	HIERARCHY = 'hierarchy',
}
```

<h3 id="SearchFacetsLabel">`label` property</h3>
Contains the facet label as configured in the Searchspring Management Console

### `storage` property
Contains a reference to the [StorageStore](#StorageStore)

<!-- TODO: update link -->



### `step` property
Only applicable to facets where `type` is `range`

The step value is calculated based on the min and max values of the range. It is typically set to the step attribute of an input element:

```jsx
<input type="range" step={facet.step} min={facet.active.low} max={facet.active.high} />
```

### `range` property
Only applicable to facets where `type` is `range`

Contains an object with `low` and `high` properties

### `active` property
Only applicable to facets where `type` is `range`

Contains an object with `low` and `high` properties

<!-- TODO: explain difference between range and active -->


### `formatSeparator` property
Only applicable to facets where `type` is `range`

The text to separate `min` and `max` values. Typically set to `-`

Example:
```typescript
const priceToDisplay = `$${facet.active.min} ${facet.formatSeparator} $${facet.active.max}` // $10 - $200
```


### `formatValue` property
Only applicable to facets where `type` is `range`

A [printf format string](https://en.wikipedia.org/wiki/Printf_format_string) for how to format numerical values

Configurable in the Searchspring Management Console and typically set to `$%01.2f` 

For example, `9.99` with a formateValue of `$%01.2f` will be formatted to `$9.99`


### `values` property
Only applicable to facets where `type` is `value` or `range-buckets`

Contains an array of facet value objects for this facet

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

`values` object will contain the following properties:

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
This is an empty object that is available for custom store manipulation using the [EventManager](../snap-event-manager)



### `config` property
Only applicable to results with `type` of `banner`

Banner config object inherited from merchandising inline banner `config` object

### `value` property
Only applicable to results with `type` of `banner`

Banner value inherited from merchandising inline banner `value` property


<h2 id="SearchStorePagination">`pagination` property</h2>

Contains pagination information for the query that was requested from the Search API

### `page` property
The current page

### `pageSize` property
The number of products displayed per page

### `page` property
The current page

### `pageSizeOptions` property
An array of objects containing results per page options. Typically used in a `<select>` dropdown to change the number of results displayed per page

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

### `defaultPageSize` property
The default number of results per page. Default is `24`

### `totalResults` property
The total result count

### `begin` getter
The number of the first product position on the current page.
For example, if the `pageSize` is `24` and the current page is `2`, `pagination.begin` will return `25`

Calculation: 
```typescript
return pageSize * (page - 1) + 1;
```

### `end` getter
The number of the last product position on the current page.
For example, if the `pageSize` is `24` and the current page is `2`, `pagination.begin` will return `48`

Calculation: 
```typescript
if (pageSize * page > totalResults) {
    return totalResults;
} else {
    return pageSize * page;
}
```

### `totalPages` getter
The total number of pages

Calculation:
```typescript
return Math.ceil(totalResults / pageSize);
```

### `multiplePages` getter
Boolean if there is more than 1 page


### `current` getter
Returns a `Page` object of the current page

### `first` getter
Returns a `Page` object of the first page

### `last` getter
Returns a `Page` object of the last page

### `next` getter
Returns a `Page` object of the next page

### `previous` getter
Returns a `Page` object of the previous page

### `getPages` method
Returns an array of `Page` objects

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
Sets `pageSize` and performs a query. Typical usage would be to invoke `setPageSize` on the `onChange` event the results per page dropdown

```jsx
onChange={(e) => {
    pagination.setPageSize(e.target.value);
}}
```

### `Page` object
A page object is returned when invoking the following getters/methods: `current`, `first`, `last`, `next`, `previous`, `getPages`

#### `number` property
The number of the page

#### `active` property
Boolean if this page is the current page

#### `url` property
Set to an instance of UrlManager for the page. Typical usage is to use the `url.href` value as the `href` of a pagination option

#### `key` property
A unique value (set to `url.href`) available to use as a `key` prop when rendering [react keys](https://reactjs.org/docs/lists-and-keys.html)


<h2 id="SearchStoreSorting">`sorting` property</h2>

Contains sorting information that was requested from the Meta API

`options` - an array of sorting Option objects

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


# AutocompleteStore

```typescript
import { AutocompleteStore } from '@searchspring/snap-store-mobx'

const store = new AutocompleteStore();

store.update(data)

console.log(store)
```

## `reset` method
Reset store to the initial state by clearing data and locks

```typescript
const store = new AutocompleteStore();

store.reset()
```

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring [Meta API](http://snapi.kube.searchspring.io/api/v1/#tag/Meta)

## `state` property
Contains autocomplete lock state

A "lock" refers to a locked state of a certain component of autocomplete. There are two lock components of autocomplete:

`state.locks.terms` - this becomes locked when a term's `preview` method is called, resulting in the terms not changing while the user interacts with the facets and results for the locked term. Without locking, Autocomplete API requests from user interaction would cause the terms to change unexpectedly

`state.locks.facets`, similar to the terms lock, this prevents facets from changing when interacting with other facets

<!-- TODO: explain locks better? -->


### `locks` property
The `locks` object contains two properties:

- `terms` property contains a Lock object

- `facets` property contains a Lock object

### `Lock` object
A `Lock` object contains a private boolean state. The initial state can be defined in the constructor, default is `false`

```typescript
let lock;
lock = new Lock()
console.log(lock.locked) // false

lock = new Lock(false)
console.log(lock.locked) // false
lock.lock()
console.log(lock.locked) // true
lock.reset();
console.log(lock.locked) // false

lock = new Lock(true)
console.log(lock.locked) // true
lock.unlock()
console.log(lock.locked) // false
lock.reset();
console.log(lock.locked) // true
```

The following methods/getter are available:

#### `reset` method
Sets lock state to the original starting state when the Lock was constructed

#### `lock` method
Sets lock state to `true`

#### `unlock` method
Sets lock state to `false`

#### `locked` getter
Boolean `true` if the Lock state is locked

### `focusedInput` property
Contains a reference to the current focused `HTMLInputElement`

### `input` property
Contains the currently focused input value being searched

### `url` property
Contains a reference to the [UrlManager](../snap-url-manager) that was linked using the `link` method

## `storage` property
Contains a reference to the [StorageStore](#StorageStore)

<!-- TODO: update link -->

## `merchandising` property
Contains redirect and banner merchandising data that the Search API returned. See [SearchStore `merchandising` property](#SearchStoreMerchandising)

## `search` property
Contains an object with the following properties:

`query` - query that was searched

`originalQuery` - Original query if spell correction occurred

## `terms` property
An array of Term objects.

### `Term` object
Each `Term` object corresponds to a term returned from the Autocomplete API and/or Suggest API

### `active` property
Boolean set to `true` when the term is active, such when invoking the `preview` method

### `value` property
Term text value

### `url` property
Set to an instance of UrlManager for the term

<h3 id="AutocompletePreview">`preview` method</h3>

Query API for the term that was previewed and displays results.
This will also lock the term state, and unlock facets state. 


## `facets` property
An array of facets. See [Search Facets](#SearchFacets)

In addition to all the search facets functionally, the Autocomplete facets will have an added `preview` method

### `preview` method
See [terms.preview](#AutocompletePreview) for `facets.preview` usage


## `filters` property
See [SearchStore Filters](#SearchStoreFilters)

## `results` property
See [SearchStore Results](#SearchStoreResults)

## `pagination` property
See [SearchStore Pagination](#SearchStorePagination)

## `sorting` property
See [SearchStore Sorting](#SearchStoreSorting)


# FinderStore

```typescript
import { FinderStore } from '@searchspring/snap-store-mobx'

const store = new FinderStore();

store.update(data)

console.log(store)
```

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring [Meta API](http://snapi.kube.searchspring.io/api/v1/#tag/Meta)

## `pagination` property
See [SearchStore Pagination](#SearchStorePagination)

## `selections` property
An array of `Selection` and `SelectionHierarchy` objects. Each object represents a finder dropdown selection.

Both object types will have the following properties:

### `select` method
The `select` method should be invoked when a selection has been made, such as in the onChange event of a `<select>` element

```jsx
{selections.map((selection) => {
    <select onChange={(e) => {
        selection.select(e.target.value)
    }}>
        {selection.values.map((value) => {
            <option value={value}>{value}</option>
        })}
    </select>
})}
```

```typescript
const value = selections[0].values[0]
selections[0].select(value)
```

<h3 id="FinderStoreSelectionsConfig">`config` property</h3>

A reference to the selection config object that was provided to the [FinderController](../snap-controller/#FinderController)

### `data` property
A reference to the data stored in the [StorageStore](#StorageStore) for this selection

### `storage` property
A reference to the [StorageStore](#StorageStore)

### `controller` property
A reference to the [FacetController](../snap-controller/#FacetController)

### `type` property
Inherited from [facet.type](#SearchFacetsType) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `field` property
Inherited from [facet.field](#SearchFacetsField) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `filtered` property
Inherited from [facet.filtered](#SearchFacetsFiltered) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `collapse` property
Inherited from [facet.collapse](#SearchFacetsCollapse) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `display` property
Inherited from [facet.display](#SearchFacetsDisplay) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `label` property
Inherited from [facet.label](#SearchFacetsLabel) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `multiple` property
Inherited from [facet.multiple](#SearchFacetsMultiple) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `id` property
A reference to the `id` property on the config that was provided to the [FinderController](../snap-controller/#FinderController)

### `disabled` property
Boolean set to `true` if this selection is disabled. A `Selection` object will be disabled if it does not contain any values. A `SelectionHierarchy` object will be disabled to enforce the user selects dropdowns in hierarchical order, or there are no further selections available

### `selected` property
Contains the value of the selection that was made. 

### `custom` property
This is an empty object that is available for custom store manipulation using the [EventManager](../snap-event-manager)



# StorageStore
An interface for storing data in the browser session storage, local storage, cookies, or memory

```typescript
import { StorageStore } from '@searchspring/snap-store-mobx';

const config = {
    type: 'session',
    key: 'ss-storage'
}

const storage = new StorageStore(config)

storage.set('path', 'value')
const sessionData = storage.get() 
console.log(sessionData) // { 'ss-storage': { 'path': 'value' } }

storage.get('path') // 'value'
```

## `config` object
If `config` is not provided, storage will be saved to its internal `state` object

`type` - the type of storage to use: `session`, `local`, or `cookie`

`key` - root level key prefix, default is 'ss-storage'

`cookie` - cookie config object, only required if type is `cookie`

`cookie.expiration` - cookie expiration in ms, default is 31536000000 (1 year)

`cookie.sameSite` - cookie sameSite attribute, allows you to declare if cookies should be restricted to a first-party or same-site context, default is undefined

```typescript
const config = {
    type: 'cookie',
    key: 'ss-storage',
    cookie: {
		expiration: 31536000000,
		sameSite: '',
	},
}	
```

## `set` method
Accepts a path and value to save to storage

```typescript
storage.set(`facet.values`, facet.values)
```

## `get` method
Retrieves a value by path from storage

```typescript
storage.get(`facet.values`)
```

It is also possible to retrieve the entire storage without providing a path:

```typescript
storage.get()
```

## `clear` method
Clears all data from storage

```typescript
storage.clear()
```

## `state` property
If a config has not been provided, the StorageStore will manage its `state` object instead of using session storage, local storage, or cookies. 

This `state` object can be accessed directly:

```typescript
storage.state
```

## `type` property
The type of storage that was provided in the `config.type` property

## `key` property
The key prefix that was provided in the `config.key` property

## `expiration` property
The cookie expiration that was provided in the `config.cookie.expiration` property

## `sameSite` property
The cookie sameSite attribute that was provided in the `config.cookie.sameSite` property

