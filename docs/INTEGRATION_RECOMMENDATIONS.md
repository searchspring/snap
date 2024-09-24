## Recommendations Integration
It is recommended to utilize the [`RecommendationInstantiator`](https://github.com/searchspring/snap/blob/main/packages/snap-preact/src/Instantiators/README.md) for integration of product recommendations (standard when using Snap object).

Changes to the recommendation integration scripts were made in Snap `v0.60.0`. Legacy Recommmendation Integrations docs can still be found [`here`](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_LEGACY_RECOMMENDATIONS.md)

Recommendations script blocks can be placed anywhere on the page and will automatically target and batch requests for all profiles specified in the block (requires the `bundle.js` script also). Batching profiles is important for deduplication of recommended products (see more below).

The block below uses the `recently-viewed` profile which would typically be setup to display the last products viewed by the shopper. Profiles must be setup in the Searchspring Management Console (SMC) and have associated Snap templates selected.

```html
<script type="searchspring/recommendations">
	globals = {
		shopper: {
			id: 'snapdev'
		}
	};
	profiles = [
		{
			profile: 'recently-viewed',
			selector: '.ss__recs__recently-viewed',
			options: {
				limit: 5
			}
		}
	];
</script>

<div class="ss__recs__recently-viewed"><!-- recommendations will render here --></div>
```

The `RecommendationInstantiator` will look for these script blocks on the page and attempt to inject components based on the `selector` specified in each profile. In the example above, the profile specified is the `recently-viewed` profile, and is set to render inside the `.ss__recs__recently-viewed` element just below the script block. The targeted element could exist anywhere on the page - but it is recommended to group elements with script blocks whenever possible (for easy integration identification). The component to render into the targeted `selector` is setup within the `RecommendationInstantiator` configuration.


## Recommendation Context Variables
Context variables are set within the script blocks and can be used to set either global or per profile (profile specific) functionality. Variables are used to alter the results displayed by our recommendations and may be required depending on the profile placements in use.

### Globals Variables
| Option | Value | Placement | Description | Required
|---|---|:---:|---|:---:|
| products | array of SKU strings | product detail page | SKU value(s) to identify the current product(s) being viewed | ✔️ |
| blockedItems | array of strings | all | SKU values to identify which products to exclude from the response |   |
| filters | array of filters | all | optional recommendation filters to apply to ALL profiles in the batch |   |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |   |
| shopper.id | logged in user unique identifier | all | required for personalization functionallity if not provided to the bundle (global) context |   |


### Profile Specific Variables
| Option | Value | Placement | Description | Required
|---|---|:---:|---|:---:|
| profile | string | all | profile name to use | ✔️ |
| selector | string | all | CSS selector to render component inside | ✔️ |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |   |
| options.categories | array of category path strings | all | optional category identifiers used in category trending recommendation profiles |   |
| options.brands | array of brand strings | all | optional brand identifiers used in brand trending recommendation profiles |   |
| options.blockedItems | array of strings | all | SKU values to identify which products to exclude from the profile response |   |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template (advanced usage) |   |
| options.dedupe | boolean (default: `true`) | all | dedupe products across all profiles in the batch |   |
| options.query | string | dynamic custom | query to search |   |
| options.filters | array of filters | all | optional recommendation filters |   |
| options.realtime | boolean | all | optional update recommendations if cart contents change (requires [cart attribute tracking](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_TRACKING.md)) |   |
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |   |


## Batching and Ordering
Each "searchspring/recommendations" script block groups multiple recommendation profiles into a single API request, known as a batch. By default, the script tag fetches recommendations for all profiles with a matching selector in one batched request. The order of profiles in the array determines their priority within the batch.

While batching all profiles together is generally the most efficient approach, there may be cases where separate batching is preferred. For instance, recommendations for a mini cart (side cart) might not require de-duplication with other recommendations. You can disable de-duplication for a specific profile by setting `dedupe: false` in its options, or create a separate batch by using an additional script tag.

## Deduping

Deduping is a process that prevents the same product from appearing in multiple recommendation profiles within a single batch. This is particularly useful when you have several recommendation profiles on a page and want to ensure a diverse range of products is shown to the user.

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
		products: ['product123'];
	};
	profiles = [
		{
			profile: 'customers-also-bought',
			selector: '.ss__recs__crosssell',
			options: {
				limit: 5
			}
		},
		{
			profile: 'customers-also-viewed',
			selector: '.ss__recs__similar'
		},
		// same batch, but dedupe false
		{
			profile: 'customers-also-like',
			selector: '.ss__recs__alsoliked',
			options: {
				dedupe: false
			}
		}
	];
</script>
```

## Additional Examples

The examples below assume that the `similar` profile has been setup in the Searchspring Management Console (SMC), and that a Snap `bundle.js` script exists on the page and has been configured with a `RecommendationInstantiator`.

A typical "similar" profile that would display products similar to the product passed in via the `products` global context variable.

```html
<script type="searchspring/recommendations">
	globals = {
		products: ['product123']
	};
	profiles = [
		{
			profile: 'customers-also-viewed',
			selector: '.ss__recs__similar'
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
			selector: '.ss__recs__crosssell'
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
			selector: '.ss__recs__cart'
		}
	];
</script>
```

### Filters
The example shown below will filter the recommendations for products matching field `color` with a value `blue` and `red`, as well as a field `price` with a range from `0` to `20`.

```html
<script type="searchspring/recommendations">
	profiles = [
		{
			profile: 'customers-also-bought',
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