# Integration

After building the project and uploading the build files to your CDN or hosting provider, you will need to add a script tag to your storefront.


```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
    // context variables go here
</script>
```

The bundle should be included in the <head> tag, ideally near the top of the node, and should not have a 'defer' or 'async' attribute. This location is important in order to start fetching results and as soon as possible. This placement prior to any body elements also serves to allow for the hiding of targeted elements that contain content - this preventing a flash when the contents change upon injection.


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snap Integration Example</title>

    <script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
        // context variables go here
    </script>
</head>
<body>
    <div id="searchspring-content"><!-- an element that will be injected into --></div>
</body>
</html>
```

## Context Variables

Context variables are conditionally rendered within the `bundle.js` script's innerHTML via server side code or template logic. They provide various context variables that can be utilized by the Snap integration. Typically these variables are used to specify category page details (for [background filtering](https://searchspring.github.io/snap/snap-background-filters)), shopper details (for personalization), merchandising segmentation, or any other custom variables needed for the integration.

The innerHTML of the script MUST only contain variable assignments without `var`, `let`, or `const`. Each declaration should end with a semi-colon to ensure minification does not impact the functions ability to parse the innerHTML. These variables are retrieved using the [getContext](https://searchspring.github.io/snap/reference-toolbox-getcontext) function at run time.

There are a few core context variables utilized by Snap, `shopper`, `merchandising` and `config` - these are reserved context variable names and should not be utilized for custom context functionality.

| Option | Value | Page | Description |
|---|---|:---:|---|
| shopper.id | logged in user unique identifier | all | required for personalization functionality |
| shopper.cart | array of cart objects, each object in the array should contain `uid` (required), `parentId` (required), `sku`, `price`, `qty` | all | current cart contents, required if checkout process does not contain a dedicated cart page (ie. slideout cart) |
| currency.code | currency code string, ie. 'EUR' (ISO 4217) | all | currency code of the shopper's cart contents or order confirmation. Used for beacon events containing pricing data |
| merchandising.segments | array of strings used for merchandising | any | segmented merchandising allows for custom control over products returned on search requests and must also be setup within the Searchspring Management Console (SMC) |
| config | object containing Snap configurations | any | advanced usage of Snap (not recommended for standard integrations) |
| page.type | 'search' (default) or 'category' | PLP | explicitly indicate the page type (category or search). This is used to differentiate category and search beacon events. If not provided, the page type will be inferred as 'category' if a common category background filter is present. |

## Examples

The custom variable example below shows a custom context being added for 'page'. The value would typically be assigned server side using template logic. This would be used to possibly toggle the siteId utilized by the client (to fetch different catalog data) or to modify text or currency displays.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
	page = "404";
</script>
```

When used, shopper context should always include at least an `id`; the `cart` contents can optionally be provided to ensure personalization is applied on every page. Standard Snap integrations will automatically take this context data and apply it for personalization.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
	shopper = {
		id: '[REPLACE WITH LOGGED IN SHOPPER ID]',
		cart: [
			{
				uid: 'product123_red',
				parentId: 'product123',
				sku: 'product123_red',
				price: 99.99,
				qty: 1
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
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
	merchandising = {
		segments: ['segment1', 'segment2']
	};
</script>
```

Example using multiple context variables together.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js" id="searchspring-context">
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

## Content Security Policy

If your site requires a strict [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), an entry of `https://*.searchspring.io` should be added to your CSP configuration to ensure Searchspring is functional. 

