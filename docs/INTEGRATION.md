## Integration

When development has concluded the bundle is ready to be placed on a development or production site.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js"></script>
```

The bundle should be included in the `<head>` tag, ideally near the top of the node, and should not have a 'defer' or 'async' attribute. This is important for to start fetching results as soon as possible and to hide targeted elements that contain content - this prevents a flash of content replacement.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>

	<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js"></script>
</head>
<body>
	<div id="searchspring-content">content that would show</div>
</body>
</html>

```

## Bundle Context variables

Bundle context variables are conditionally rendered within the `bundle.js` script's innerHTML. They provide context for Snap and can be retrieved using [getContext](https://github.com/searchspring/snap/tree/main/packages/snap-toolbox/src/getContext)

The innerHTML of the script MUST only contain variable assignments without `var`, `let`, or `const`. Each declaration should end with a semi-colon to ensure minification does not impact the functions ability to parse the innerHTML.

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
</script>
```

| Option | Value | Page | Description |
|---|---|:---:|---|
| shopper.id | logged in user unique identifier | all | required for personalization functionallity |
| shopper.cart | Array of cart objects, each object in the array can contain `sku` and/or `childSku` | all | current cart contents, required if checkout process does not contain a dedicated cart page (ie. slideout cart) |


## Recommendation Context variables
Similar to the above context variables however these do not apply globally. They instead reside in a profile script innterHTML.

```html
<script type="searchspring/recommend" profile="similar">
    product = "C-AD-W1-1869P";
    cart = ['C-AD-W1-1869P'];
    options = {
		siteId: 'abc123',
		categories: ['righteous', 'awesome', 'radical'],
        branch: 'production',
        batched: true
	};
    shopper = {
		id: 'snapdev',
		cart: [
			{
                sku: 'product123', 
                childSku: 'product123_a' ,
            }
		]
	};
</script>
```

| Option | Value | Page | Description |
|---|---|:---:|---|
| product | current product sku | product detail page | required if product detail pages contain recommendations |
| cart | array (or function that returns an array) of current cart skus | all | optional method of setting cart contents |
| options.siteId | global siteId overwrite | all | optional global siteId overwrite |
| options.categories | category path | all | optional category path |
| options.branch | template branch overwrite | all | optional branch overwrite for recommendations template |
| options.batched | boolean (default: `true`)| all | only applies to recommendation context, optional disable profile from being batched in a single request, can also be set globally [via config](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |
| options.limit | number (default: 20, max: 20) | all | optional maximum number of results to display, can also be set globally [via config globals](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Recommendation) |

### Background Filters
Background filters allow a page to be refined without displaying the active filter to the end-user. This is primarily used for category pages, although can also be used for custom functionality such as restricting visibility of products to user groups. The filter value is retrieved from a context variable and applied as a background filter within the Snap config object. 

In this example, we'll retrieve the `collection` object from the context and apply it as a category background filter for our search controller.

Background filters can also be applied to all services by setting `client.globals.filters` instead.


```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	collection = {
		handle: 'Shirts'
	};
</script>
```

```typescript
import { getContext } from '@searchspring/snap-toolbox';

const context = getContext(['collection']);
let backgroundFilters = [];

if (context.collection?.handle) {
	// set background filter
	if (context.collection.handle != 'all') {
		backgroundFilters.push({
			field: 'collection_handle',
			value: context.collection.handle,
			type: 'value',
			background: true,
		});
	}
}

const config = {
	context,
	client: {
		globals: {
			siteId: 'abc123',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					globals: {
						filters: backgroundFilters,
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```


## Tracking
Certain reports depend on beacon data being tracked. These are events tracked outside of the integration code and should be added to various pages.

### Shopper Login
Identifies the logged-in user. Should be invoked if a user is logged into their account. The value should contain any unique identifier (ie. user ID, email, hash)

```html
<script type="searchspring/track/shopper/login">
    id = 'snapdev';
</script>
```

Alternatively, this can also be integrated using the `window.tracker.track.shopper.login` method

```typescript
window.tracker.track.shopper.login({
    id: 'snapdev'
});
```

### Product View
Tracks product page views. Should only be installed on product detail pages. A `sku` and/or `childSku` are required.

```html
<script type="searchspring/track/product/view">
    item = {
        sku: 'product123',
        childSku: 'product123_a',
    };
</script>
```

Alternatively, this can also be integrated using the `window.tracker.track.product.view` method

```typescript
window.tracker.track.product.view({
    sku: 'product123',
    childSku: 'product123_a',
});
```


### Cart View 
Tracks cart contents. Should only be installed on a cart page. If the checkout process does not contain a dedicated cart page (ie. slideout cart) then this method should be invoked when the cart comes into view. 

Each item object must contain a `qty`, `price`, (`sku` and/or `childSku`)

```html
<script type="searchspring/track/cart/view">
    items = [
        {
            sku: 'product123',
            childSku: 'product123_a',
            qty: '1',
            price: '9.99',
        },
        {
            sku: 'product456',
            childSku: 'product456_a',
            qty: '2',
            price: '10.99',
        },
    ];
</script>
```

Alternatively, this can also be integrated using the `window.tracker.track.cart.view` method.

```typescript
window.tracker.track.cart.view({
    items: [
        {
            sku: 'product123',
            childSku: 'product123_a',
            qty: '1',
            price: '9.99',
        },
        {
            sku: 'product456',
            childSku: 'product456_a',
            qty: '2',
            price: '10.99',
        },
    ]
});
```


### Order Transaction
Tracks order transaction. Should be invoked from an order confirmation page. Expects an object with the following:

`order` - (optional) object containing the following

`order.id` - (optional) order id

`order.otal` - (optional) sub total of all items

`order.city` - (optional) city name

`order.state` - (optional) 2 digit state abbreviation (US only)

`order.country` - (optional) 2 digit country abbreviation	(ie. 'US', 'CA', 'MX', 'PL', 'JP')

`order.items` - required array of items - same object provided to `track.cart.view` event

```html
<script type="searchspring/track/order/transaction">
    order = {
        id: '123456',
        total: '31.97',
        city: 'Los Angeles',
        state: 'CA',
        country: 'US',
    };
    items = [
        {
            sku: 'product123',
            childSku: 'product123_a',
            qty: '1',
            price: '9.99'
        },
        {
            sku: 'product456',
            childSku: 'product456_a',
            qty: '2',
            price: '10.99'
        },
    ];
</script>
```

Alternatively, this can also be integrated using the `window.tracker.track.order.transaction` method

```typescript
window.tracker.track.order.transaction({
    order: {
        id: '123456',
        total: '31.97',
        city: 'Los Angeles',
        state: 'CA',
        country: 'US',
    },
    items: [
        {
            sku: 'product123',
            childSku: 'product123_a',
            qty: '1',
            price: '9.99'
        },
        {
            sku: 'product456',
            childSku: 'product456_a',
            qty: '2',
            price: '10.99'
        },
    ]
});
```


### Product Click
Tracks product click events. This event can be included within the Snap integration. It is reccomended to invoke on each product `onmousedown` event via the `result.track.click()` method.  

```jsx
searchController.store.results.map(result)=>{(
    <a href={core.url} onMouseDown={(e)=>{searchController.track.product.click(e, result)}}>
)}
```

Alternatively, this can also be integrated using the `ss-track-intellisuggest` and `ss-track-intellisuggest-signature` attributes.

```jsx
searchController.store.results.map(result)=>{(
    <a href={core.url} ss-track-intellisuggest={result.attributes.intellisuggestData} ss-track-intellisuggest-signature={result.attributes.intellisuggestSignature}>
)}
```


Alternatively, this can also be integrated using the `window.tracker.track.product.click` method. 

The `intellisuggestData` and `intellisuggestSignature` values are returned from SearchSpring's Search API on each `result.attributes` object. An optional `href` value can also be provided. 

```typescript
window.tracker.track.product.click({
    intellisuggestData: '37d5578e1d1646ac97701a063ba84777',
    intellisuggestSignature: '5739a2596d3b4161b041ce1764ffa04d',
    href: '/product123',
});
```


## Cart Attribute Tracking

This is not required if the above `Cart View` and `Order Transaction` tracking has not been implemented OR you are not using the `realtime` recommendations configuration. 

Adding the following attributes to clickable cart elements allows for real-time updates to any recommendations (disabled by default) when the cart changes. If the click event occurs on a nested element, the attribute data will attempt to be retrieved from up to 3 parent nodes.

If you are using multiple custom Tracker instances with a different tracker `config.id`, attributes are namespaced by the trackers `id` (Default: `'track'`, Example: `ss-track-cart-add`)

### Add to cart
Adds product `sku` (or `childSku`) to `ssCartProducts` cookie. Supports multiple skus using a comma delimiter.

```html
<button ss-track-cart-add='product123'>Add to cart</button>
```

Alternatively, this can also be integrated using the `window.tracker.cookies.cart.add` method

```typescript
window.tracker.cookies.cart.add(['product123'])
```


### Remove from cart
Removes product `sku` (or `childSku`) from `ssCartProducts` cookie. Supports multiple skus using a comma delimiter.

```html
<button ss-track-cart-remove='product123'>Remove</button>
```

Alternatively, this can also be integrated using the `window.tracker.cookies.cart.remove` method

```typescript
window.tracker.cookies.cart.remove(['product123'])
```


### Clear cart
Clears all products currently stored in the `ssCartProducts` cookie.

```html
<button ss-track-cart-clear>Clear Cart</button>
```

Alternatively, this can also be integrated using the `window.tracker.cookies.cart.remove` method

```typescript
window.tracker.cookies.cart.clear()
```

### View cart
Allows for real-time updates to any recommendations when an element with this attribute is clicked.

```html
<button ss-track-cart-view>View Cart</button>
```
