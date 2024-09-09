## Recommendations Integration (Legacy)

For integrations using Snap `v0.60.0` and newer, please reference the updated [`integration docs`](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_RECOMMENDATIONS.md).


It is recommended to utilize the [`RecommendationInstantiator`](https://github.com/searchspring/snap/blob/main/packages/snap-preact/src/Instantiators/README.md) for integration of product recommendations. This method allows recommendations to be placed anywhere on the site with a single script block (requires the `bundle.js` script also).

```html
<script type="searchspring/recommend" profile="recently-viewed">
	// context variables go here
</script>
```

The `RecommendationInstantiator` will look for these elements on the page and attempt to inject components based on the `profile` specified. In the example above, the profile specified is the `recently-viewed` profile, and would typically be setup to display the last products viewed by the shopper. These profiles must be setup in the Searchspring Management Console (SMC) and have associated Snap templates selected.


## Recommendation Context Variables
Context variables may be applied to individual recommendation profiles similar to how they are done on the integration script tag. Variables here may be required depending on the profile type utilized, and can be used to alter the results displayed by our recommendations.

| Option | Value | Page | Description |
|---|---|:---:|---|
| products | array of SKU strings | product detail page | SKU value(s) to identify the current product(s) being viewed |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |
| options.categories | array of category path strings | all | optional category identifiers used in category trending recommendation profiles |
| options.brands | array of brand strings | all | optional brand identifiers used in brand trending recommendation profiles |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |
| options.filters | array of filters | all | optional recommendation filters |
| options.realtime | boolean | all | optional update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_TRACKING.md)) |
| options.blockedItems | array of strings | all | SKU values to identify which products to exclude from the response |
| options.batched | boolean (default: `true`)| all | only applies to recommendation context, optional disable profile from being batched in a single request, can also be set globally [via config](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) | 
| options.order | number | all | optional order number for recommendation params to be added to the batched request. Profiles that do not specify an order will be placed at the end, in the occurrence they appear in the DOM.
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |
| shopper.id | logged in user unique identifier | all | required for personalization functionallity if not provided to the bundle (global) context |

## Batching and Ordering
By default, recommendation profile results are fetched in the same API request (batch), this is done in an effort to prevent the display of duplicate products across multiple profiles. The order of the profiles in the DOM determines the priority of results for de-duplication (best recommendations). If you wish to change the order, an `order` value can be provided (lowest value has highest priority). For some profiles (like product bundles) it is important that they receive the best suggested products prior to de-duplication, for these, the `order` would be set manually so that de-duplication does not occur.

In most cases batching is the best practice, however for profiles like a mini cart (side cart) de-duplication may not be desired. Batching can be turned off per profile with a `batched: false` value.

The example below shows how to manually specify the order and batching of specific profiles.

```html
<script type="searchspring/recommend" profile="customers-also-bought">
	products = ['product123'];
	options = {
		order: 2
	};
</script>

<script type="searchspring/recommend" profile="customers-also-viewed">
	products = ['product123'];
	options = {
		order: 3
	};
</script>

<script type="searchspring/recommend" profile="bundle">
	products = ['product123'];
	options = {
		order: 1
	};
</script>

<script type="searchspring/recommend" profile="quick-cart">
	products = ['product123'];
	options = {
		batched: false
	};
</script>
```

## Additional Examples

The examples below assume that the `similar` profile has been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile that would display products similar to the product passed in via the `product` context variable.

```html
<script type="searchspring/recommend" profile="customers-also-viewed">
	products = ['product123'];
</script>
```

If tracking scripts are not in place, "also bought" profiles may require the cart contents to be provided.

```html
<script type="searchspring/recommend" profile="view-cart">
	cart = ['product123'];
</script>
```

If the shopper identifier is not beeing captured by the `bundle.js` context, it must be provided for proper personalization.

```html
<script type="searchspring/recommend" profile="view-cart">
	shopper = {
		id: 'buyer@shopper.com'
	};
</script>
```

Having multiple scripts batched using the order context variable

```html
<script type="searchspring/recommend" profile="view-cart">
	options = {
		<!-- this will be added 2nd -->
		order: 2,
	};
</script>
<script type="searchspring/recommend" profile="customers-also-viewed">
		<!-- this will be added 3rd -->
</script>
<script type="searchspring/recommend" profile="customers-also-bought">
	options = {
		<!-- this will be added 1st -->
		order: 1
	};
</script>
```

### Filters
The example shown below will filter the recommendations for products matching color: blue, & red, and price range 0 - 20.

```html
<script type="searchspring/recommend" profile="customers-also-bought">
	options = {
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
</script>
```