## Recommendations Integration (Legacy)

For integrations using Snap `v0.60.0` and newer, please reference the updated [`integration docs`](https://searchspring.github.io/snap/snap-recommendations).


It is recommended to utilize the [`RecommendationInstantiator`](https://searchspring.github.io/snap/reference-snap-preact-instantiators) for integration of product recommendations. This method allows recommendations to be placed anywhere on the site with a single script block (requires the `bundle.js` script also).

```html
<script type="searchspring/personalized-recommendations" profile="recently-viewed">
	// context variables go here
</script>
```

The `RecommendationInstantiator` will look for these elements on the page and attempt to inject components based on the `profile` specified in the script attribute. In the example above, the profile specified is the `recently-viewed` profile, and would typically be setup to display the last products viewed by the shopper. These profiles must be setup in the Searchspring Management Console (SMC).


## Recommendation Context Variables
Profile configurations are applied to recommendation via script context variables. The variables here may be required depending on the profile type utilized, and can be used to alter the results displayed by our recommendations. When multiple recommendation integration script blocks are found, a batch will be created by default, and any profile configurations NOT in the `options` variable are applied globally to all profiles.

| Option | Value | Page | Description |
|---|---|:---:|---|
| products | array of SKU strings | product detail page | SKU value(s) to identify the current product(s) being viewed (global) |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents (global) |
| blockedItems | array of strings | all | SKU values to identify which products to exclude from the response (global) |
| filters | array of filters | all | optional recommendation filters (global) |
| shopper.id | logged in user unique identifier | all | required for personalization functionality if not provided to the bundle context (global) |
| options.siteId | siteId overwrite | all | optional siteId overwrite (will force a new batch) |
| options.categories | array of category path strings | all | optional category identifiers used in category trending recommendation profiles |
| options.brands | array of brand strings | all | optional brand identifiers used in brand trending recommendation profiles |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |
| options.filters | array of filters | all | optional recommendation filters |
| options.query | string | all | query to search |
| options.realtime | boolean | all | optional update recommendations if cart contents change (requires [cart attribute tracking](https://searchspring.github.io/snap/snap-tracking#cart-attribute-tracking)) |
| options.blockedItems | array of strings | all | SKU values to identify which products to exclude from the response |
| options.batched | boolean (default: `true`)| all | only applies to recommendation context, optional disable profile from being batched in a single request, can also be set globally [via config](https://searchspring.github.io/snap/reference-controller-recommendation#recommendationcontrollerconfig) | 
| options.dedupe | boolean (default: `true`) | all | specify wether or not the profile should deduplicate products when in a batch |
| options.order | number | all | optional order number for recommendation params to be added to the batched request. Profiles that do not specify an order will be placed at the end, in the occurrence they appear in the DOM.
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://searchspring.github.io/snap/reference-controller-recommendation#recommendationcontrollerconfig) |

## Batching and Ordering
By default, recommendation profile results are fetched in the same API request (batch), this is done in an effort to prevent the display of duplicate products across multiple profiles. The order of the profiles in the DOM determines the priority of results for de-duplication (best recommendations). If you wish to change the order, an `order` value can be provided (lowest value has highest priority). For some profiles (like product bundles) it is important that they receive the best suggested products prior to de-duplication, for these, the `order` should be set manually so that de-duplication does not occur.

In most cases batching is the best practice, however for profiles like a mini cart (side cart) de-duplication may not be desired. Using `dedupe` would allow for opting out of deduplication for that profile in the batch. 

The example below shows how to manually specify the order of the profiles and how to dedupe them. In the example the 'bundle' profile in the batch receives the best suggestions because it has the lowest order, and the 'quick-cart' profile is not deduplicating products at all.

```html
<script type="searchspring/personalized-recommendations" profile="customers-also-bought">
	products = ['product123'];
	options = {
		order: 2
	};
</script>

<script type="searchspring/personalized-recommendations" profile="customers-also-viewed">
	products = ['product123'];
	options = {
		order: 3
	};
</script>

<script type="searchspring/personalized-recommendations" profile="bundle">
	products = ['product123'];
	options = {
		order: 1
	};
</script>

<script type="searchspring/personalized-recommendations" profile="quick-cart">
	products = ['product123'];
	options = {
		dedupe: false
	};
</script>
```

Alternatively, a profile can be placed in it's own batch via the `batched: false` value. The example below shows how to place the 'quick-cart' profile into it's own batch.

```html
<script type="searchspring/personalized-recommendations" profile="bundle">
	products = ['product123'];
</script>

<script type="searchspring/personalized-recommendations" profile="quick-cart">
	products = ['product123'];
	options = {
		batched: false
	};
</script>
```

## Additional Examples

The examples below assume that profiles used have been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile that would display products similar to the product passed in via the `product` context variable.

```html
<script type="searchspring/personalized-recommendations" profile="similar">
	products = ['sku123'];
</script>
```

If tracking scripts are not in place, "also bought" profiles may require the cart contents to be provided.

```html
<script type="searchspring/personalized-recommendations" profile="view-cart">
	cart = ['sku456'];
</script>
```

If the shopper identifier is not beeing captured by the `bundle.js` context, it must be provided for proper personalization.

```html
<script type="searchspring/personalized-recommendations" profile="similar">
	shopper = {
		id: 'buyer@shopper.com'
	};
</script>
```

Having multiple scripts batched using the order context variable

```html
<script type="searchspring/personalized-recommendations" profile="view-cart">
	options = {
		<!-- this will be added 2nd -->
		order: 2,
	};
</script>
<script type="searchspring/personalized-recommendations" profile="customers-also-viewed">
		<!-- this will be added 3rd -->
</script>
<script type="searchspring/personalized-recommendations" profile="customers-also-bought">
	options = {
		<!-- this will be added 1st -->
		order: 1
	};
</script>
```

### Filters
The example shown below will filter the recommendations for products matching field `color` with a value `blue` and `red`, as well as a field `price` with a range from `0` to `20`.

```html
<script type="searchspring/personalized-recommendations" profile="customers-also-bought">
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

The next example shows a global filter being used, this will filter all of the profiles in the batch for products matching the field `onSale` with a value `true`; the 'similar' profile will additionally apply a filter using the field `price` with a range from `0` to `20`.

```html
<script type="searchspring/personalized-recommendations" profile="customers-also-bought">
	filters = [
		{
			type: 'value',
			field: 'onSale',
			value: 'true'
		}
	];
</script>

<script type="searchspring/personalized-recommendations" profile="similar">
	options = {
		filters: [
			{
				type: 'range',
				field: 'price',
				value: { low: 0, high: 20 }
			}
		]
	}
</script>
```