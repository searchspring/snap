## Recommendations Integration
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
| product | current product sku | product detail page | used to identify the current product being viewed |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |
| options.categories | category path | all | optional category identifier to restrict recommendations |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |
| options.batched | boolean (default: `true`)| all | only applies to recommendation context, optional disable profile from being batched in a single request, can also be set globally [via config](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |
| shopper.id | logged in user unique identifier | all | required for personalization functionallity if not provided to the bundle (global) context |

## Examples

The examples below assume that the `similar` profile has been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile that would display products similar to the product passed in via the `product` context variable.

```html
<script type="searchspring/recommend" profile="customers-also-viewed">
	product = 'product123';
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