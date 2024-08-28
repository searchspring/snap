## Context Variables

Context variables are conditionally rendered within the `bundle.js` script's innerHTML via server side code or template logic. They provide various context variables that can be utilized by the Snap integration. Typically these variables are used to specify category page details (for [background filtering](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_BACKGROUND_FILTERS.md)), shopper details (for personalization), merchandising segmentation, or any other custom variables needed for the integration.

The innerHTML of the script MUST only contain variable assignments without `var`, `let`, or `const`. Each declaration should end with a semi-colon to ensure minification does not impact the functions ability to parse the innerHTML. These variables are retrieved using the [getContext](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/getContext) function at run time.

There are a few core context variables utilized by Snap, `shopper`, `merchandising` and `config` - these are reserved context variable names and should not be utilized for custom context functionality.

| Option | Value | Page | Description |
|---|---|:---:|---|
| shopper.id | logged in user unique identifier | all | required for personalization functionallity |
| shopper.cart | array of cart objects, each object in the array can contain `sku` and/or `childSku` | all | current cart contents, required if checkout process does not contain a dedicated cart page (ie. slideout cart) |
| currency.code | currency code string, ie. 'EUR' (ISO 4217) | all | currency code of the shopper's cart contents or order confirmation. Used for beacon events containing pricing data |
| merchandising.segments | array of strings used for merchandising | any | segmented merchandising allows for custom control over products returned on search requests and must also be setup within the Searchspring Management Console (SMC) |
| config | object containing Snap configurations | any | advanced usage of Snap (not recommended for standard integrations) |

## Examples

The custom variable example below shows a custom context being added for 'page'. The value would typically be assigned server side using template logic. This would be used to possibly toggle the siteId utilized by the client (to fetch different catalog data) or to modify text or currency displays.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	page = "404";
</script>
```

When used, shopper context should always include at least an `id`; the `cart` contents can optionally be provided to ensure personalization is applied on every page. Standard Snap integrations will automatically take this context data and apply it for personalization.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	shopper = {
		id: 'snapdev',
		cart: [
			{
				sku: 'product123', 
				childSku: 'product123_a' ,
			}
		]
	};
	currency = {
		code: 'EUR'
	};
</script>
```

Merchandising segmentation will automatically be applied if passed in via a script context variable. Standard Snap integrations will automatically take this context data and apply it for merchandising.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	merchandising = {
		segments: ['segment1', 'segment2']
	};
</script>
```

Example using multiple context variables together.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	page = "404";
	shopper = {
		id: 'canadian@shopper.com'
	};
	merchandising = {
		segments: ['country:canada']
	};
	currency = {
		code: 'EUR'
	};
</script>
```