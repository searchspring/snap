# RecommendationController

The `RecommendationController` is used when making queries to the API `recommend` endpoint. It can also bind events to DOM elements to handle user input of queries.

## RecommendationControllerConfig

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for this controller | ➖ | ✔️ |
| tag | unique name of the recommendations profile | ➖ | ✔️ |
| realtime | update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/tree/main/docs/SNAP_TRACKING.md#cart-attribute-tracking)) | ➖ |   |
| batched | batch multiple recommendations into a single network request | true |   |
| limit | maximum number of results to display, can also be set globally via globals | 20 |  |
| globals | keys defined here will be passed to the API request (can overwrite global config)| ➖ |   |
| settings.searchOnPageShow | causes a search to be conducted when returning using browser back/forward cache | true |   | 
| settings.variants.field | used to set the field in which to grab the variant data from | ➖ |   | 
| settings.variants.realtime.enabled | enable real time variant updates | ➖ |   | 
| settings.variants.realtime.filters | specify which filters to use to determine which results are updated | ➖ |   | 
| settings.variants.options | object keyed by option individual option field values for configuration of any option settings  | ➖ |   | 


## Initialize
Invoking the `init` method is required to subscribe to changes that occur in the UrlManager. This is typically done automatically prior to calling the first `search`.

```typescript
recommendationController.init();
```

## Events
### init
- Called with `eventData` = { controller }
- Done once automatically before the first search - or manually invoked by calling `init`

### error
- Called with `eventData` = { controller, error }
- Invoked when an error has been caught within the controller

### beforeSearch
- Called with `eventData` = { controller, request }
- Always invoked before an API request is made 
- Sets `controller.store.loading = true`

### afterSearch
- Called with `eventData` = { controller, request, response }
- Always invoked after an API request is made 
- Sets `controller.store.loading = false`
- Cancels search if input doesn't match current urlManager input state

### afterStore
- Called with `eventData` = { controller, request, response }
- Always invoked after data has been stored in mobx store

### track.product.clickThrough
- Called with `eventData` = { controller, event, result, trackEvent } 
- Always invoked after `track.product.clickThrough()` or `track.product.click()` method has been invoked
- Allows for adding custom product click events (ie. Google Analytics)

### track.product.impression
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.impression()` method has been invoked

### track.product.render
- Called with `eventData` = { controller, result, trackEvent } 
- Always invoked after `track.product.render()` method has been invoked

### track.product.addToCart
- Called with `eventData` = { controller, product, trackEvent } 
- Always invoked after `track.product.addToCart()` method has been invoked

### addToCart
- Called with `eventData` = { controller, products } 
- Always invoked after `controller.addToCart()` method has been invoked


## Recommendation Context Variables
Context variables are set within the script blocks and can be used to set either global or per profile (profile specific) functionality. Variables are used to alter the results displayed by our recommendations and may be required depending on the profile placements in use.

### Globals Variables
| Option | Value | Placement | Description | Required
|---|---|:---:|---|:---:|
| products | array of SKU strings | product detail page | SKU value(s) to identify the current product(s) being viewed | ✔️ |
| blockedItems | array of strings | all | SKU values to identify which products to exclude from the response |   |
| filters | array of filters | all | optional recommendation filters to apply to ALL profiles in the batch |   |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |   |
| shopper.id | logged in user unique identifier | all | required for personalization functionality if not provided to the bundle (global) context |   |


### Profile Specific Variables
| Option | Value | Placement | Description | Required
|---|---|:---:|---|:---:|
| tag | string | all | profile tag name to use | ✔️ |
| selector | string | all | CSS selector to render component inside | ✔️ |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |   |
| options.categories | array of category path strings | all | optional category identifiers used in category trending recommendation profiles |   |
| options.brands | array of brand strings | all | optional brand identifiers used in brand trending recommendation profiles |   |
| options.blockedItems | array of strings | all | SKU values to identify which products to exclude from the profile response |   |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |   |
| options.dedupe | boolean (default: `true`) | all | dedupe products across all profiles in the batch |   |
| options.query | string | dynamic custom | query to search |   |
| options.filters | array of filters | all | optional recommendation filters |   |
| options.realtime | boolean | all | optional update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/tree/main/docs/SNAP_TRACKING.md#cart-attribute-tracking)) |   |
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally via RecommendationController config globals |   |


## Batching and Ordering
Each "searchspring/recommendations" script block groups multiple recommendation profiles into a single API request, known as a batch. By default, the script tag fetches recommendations for all profiles with a matching selector in one batched request. The order of profiles in the array determines their priority within the batch.

While batching all profiles together is generally the most efficient approach, there may be cases where separate batching is preferred. For instance, recommendations for a mini cart (side cart) might not require de-duplication with other recommendations. You can disable de-duplication for a specific profile by setting `dedupe: false` in its options, or create a separate batch by using an additional script tag.

## Deduping

Deduping prevents the same product from appearing in multiple recommendation profiles within a single batch. This is useful when you have several recommendation profiles on a page and want to ensure a diverse range of products is shown to the shopper.

Here's how deduping works:

1. By default, deduping is enabled for all profiles in a batch (`options.dedupe: true`).
2. The order of profiles in the array determines their priority for deduping.
3. When a product is returned for a higher-priority profile, it becomes unavailable for lower-priority profiles in the same batch.

For example, if you have three profiles in this order: "Customers Also Bought", "Similar Products", and "You May Also Like", and a product is returned for "Customers Also Bought", it won't appear in "Similar Products" or "You May Also Like".

You can disable deduping for specific profiles by setting `options.dedupe: false`. This is useful for profiles where you want to ensure certain products always appear, regardless of their presence in other recommendations.

Here's an example that demonstrates deduping:

```html
<script type="searchspring/recommendations">
	globals = {
		products: ['product123']
	};
	profiles = [
		{
			tag: 'customers-also-bought',
			selector: '.ss__recs__crosssell',
			options: {
				limit: 5
			}
		},
		{
			tag: 'customers-also-viewed',
			selector: '.ss__recs__similar'
		},
		// same batch, but dedupe false
		{
			tag: 'customers-also-like',
			selector: '.ss__recs__alsoliked',
			options: {
				dedupe: false
			}
		}
	];
</script>
```

## Additional Examples

The examples below assume the `similar` profile has been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile displays products similar to the product passed in via the `products` global context variable.

```html
<script type="searchspring/recommendations">
	globals = {
		products: ['product123']
	};
	profiles = [
		{
			tag: 'customers-also-viewed',
			selector: '.ss__recs__similar'
		}
	];
</script>
```

If tracking scripts are not in place, `cross-sell` profiles may require the cart contents to be provided.

```html
<script type="searchspring/recommendations">
	globals = {
		cart: ['product123']
	};
	profiles = [
		{
			tag: 'customers-also-bought',
			selector: '.ss__recs__crosssell'
		}
	];
</script>
```

If the shopper identifier is not being captured by the `bundle.js` context, it must be provided for proper personalization.

```html
<script type="searchspring/recommendations">
	globals = {
		shopper: {
			id: 'buyer@shopper.com'
		}
	};
	profiles = [
		{
			tag: 'view-cart',
			selector: '.ss__recs__cart'
		}
	];
</script>
```

### Filters
The example below filters the recommendations for products matching field `color` with a value `blue` and `red`, as well as a field `price` with a range from `0` to `20`.

```html
<script type="searchspring/recommendations">
	profiles = [
		{
			tag: 'customers-also-bought',
			selector: '.ss__recs__crosssell',
			options: {
				filters: [
					{
						type: 'value',
						field: 'color',
						value: 'blue'
					},
					{
						type: 'value',
						field: 'color',
						value: 'red'
					},
					{
						type: 'range',
						field: 'price',
						value: { low: 0, high: 20 }
					}
				]
			}
		}
	];
</script>
```

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