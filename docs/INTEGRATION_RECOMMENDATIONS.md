## Recommendations Integration

Changes to the recommendation integration scripts were made in Snap `v.0.60.0`. Legacy Recommmendation Integrations docs can still be found [`here`](https://github.com/searchspring/snap/blob/main/packages/snap-preact/src/Instantiators/README.md)

It is recommended to utilize the [`RecommendationInstantiator`](https://github.com/searchspring/snap/blob/main/packages/snap-preact/src/Instantiators/README.md) for integration of product recommendations. This method allows recommendations to be placed anywhere on the site with a single script block (requires the `bundle.js` script also).

```html
<script type="searchspring/recommendations">
	globals = {};
	profiles = [
		{
			profile: 'recently-viewed',
			target: '.above-content',
			options: {
				limit: 5
			}
		}
	];
</script>
```

The `RecommendationInstantiator` will look for these elements on the page and attempt to inject components based on the `profiles` specified. In the example above, the profile specified is the `recently-viewed` profile, and is set to render inside the target `.above-content`, this profile would typically be setup to display the last products viewed by the shopper. These profiles must be setup in the Searchspring Management Console (SMC) and have associated Snap templates selected.


## Recommendation Context Variables
Context variables may be applied to individual recommendation profiles similar to how they are done on the integration script tag. Variables here may be required depending on the profile type utilized, and can be used to alter the results displayed by our recommendations.

### Globals Variables
| Option | Value | Page | Description |
|---|---|:---:|---|
| products | array of SKU strings | product detail page | SKU value(s) to identify the current product(s) being viewed |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |
| shopper.id | logged in user unique identifier | all | required for personalization functionallity if not provided to the bundle (global) context |


### Profile Specific Variables
| Option | Value | Page | Description |
|---|---|:---:|---|
| profile | string | all | profile name to use |
| target | string | all | CSS selector to render component inside |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |
| options.categories | array of category path strings | all | optional category identifiers used in category trending recommendation profiles |
| options.brands | array of brand strings | all | optional brand identifiers used in brand trending recommendation profiles |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |
| options.dedupe | boolean (default: `true`) | all | dedupe products across all profiles in the batch |
| options.searchTerm | string | all | query to search |
| options.filters | array of filters | all | optional recommendation filters |
| options.realtime | boolean | all | optional update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_TRACKING.md)) |
| options.blockedItems | array of strings | all | SKU values to identify which products to exclude from the response |
| options.order | number | all | optional order number for recommendation params to be added to the batched request. Profiles that do not specify an order will be placed at the end, in the occurrence they appear in the DOM.
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |


## Batching and Ordering
By default, each script tag will fetch the recommendations for each profile it finds a target for in a single batched request. The priority order is based on the order listed in the profiles array. 
In most cases batching everything is the best practice, however for profiles like a mini cart (side cart) de-duplication may not be desired. De-duplication can be turned off per profile with a `dedupe: false` value, or you can add an additional script to fetch the recommendations in a seperate batch. 

The example below shows how to manually specify the order and batching of specific profiles.

```html
<script type="searchspring/recommendations">
	globals = {
		products: ['product123'];
	};
	profiles = [
		{
			profile: 'customers-also-bought',
			target: '.crosssell',
			options: {
				limit: 5
			}
		},
		{
			profile: 'customers-also-viewed',
			target: '.similar'
		},
		//same batch, but dedupe false
		{
			profile: 'bundle',
			target: '.similar',
			options: {
				dedupe: false
			}
		}
	];
	
</script>

<!-- seperate batch -->
<script type="searchspring/recommendations">
	globals = {
		products: ['product123']
	};
	profiles = [
		{
			profile: 'quick-cart',
			target: '.crosssell',
			options: {
				limit: 5
			}
		}
	];
</script>
```

## Additional Examples

The examples below assume that the `similar` profile has been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile that would display products similar to the product passed in via the `product` context variable.

```html
<script type="searchspring/recommendations">
	globals = {
		products: ['product123']
	};
	profiles = [
		{
			profile: 'customers-also-viewed',
			target: '.similar'
		}
	];
</script>
```

If tracking scripts are not in place, "crosssell" profiles may require the cart contents to be provided.

```html
<script type="searchspring/recommendations">
	globals = {
		cart: ['product123']
	};
	profiles = [
		{
			profile: 'customers-also-bought',
			target: '.crosssell'
		}
	];
</script>
```

If the shopper identifier is not beeing captured by the `bundle.js` context, it must be provided for proper personalization.

```html
<script type="searchspring/recommendations">
	globals = {
		shopper: {
			id: 'buyer@shopper.com'
		}
	};
	profiles = [
		{
			profile: 'view-cart',
			target: '.cart'
		}
	];
</script>
```

### Filters
The example shown below will filter the recommendations for products matching color: blue, & red, and price range 0 - 20.

```html
<script type="searchspring/recommendations">
	profiles = [
		{
			profile: 'customers-also-bought',
			target: '.crosssell',
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