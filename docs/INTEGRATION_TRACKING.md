## Tracking

To ensure accurate tracking of events used for reporting, the following tracking events should be implemented across Search, Category, Autocomplete and Recommendations result components.

## Events invoked within the integration code

### Product Click
Tracks product click events. Not required when using `withTracking` or `ResultTracker`. It is recommended to invoke on each product `onmousedown` or `onClick` event via the `controller.track.product.click()` method available on all controller types.

```jsx
controller.store.results.map(result => {
	return (
		<a href={core.url} onMouseDown={(e)=> controller.track.product.click(e, result) }>
			{result.name}
		</a>
	)
})
```

### Product Add To Cart
Tracks product add to cart events. It is recommended to invoke on each product `onClick` event via the `controller.addToCart()` method available on all controller types.

```jsx
controller.store.results.map(result => {
	return (
		<a href={core.url} onMouseDown={(e)=> controller.track.product.click(e, result) }>
			{result.name}
			<button onClick={(e)=> controller.addToCart(result)}>Add to cart</button>
		</a>
	)
})
```

### Impressions
Impression tracking occurs when products come into the viewport. It is recommended to use the `withTracking` hook within custom product result cards to track impressions. Alternatively, the `ResultTracker` component can be used to track impressions as well - be aware that this component adds an additional wrapping element. This does not need to be implemented if using the default `Result` component from @searchspring/snap-preact-components or default Autocomplete component without custom result cards.

### Typical Tracking Integration Example
```jsx
import { withTracking } from '@searchspring/snap-preact-components';

const Results = withController((props) => {
	const { controller } = props;

	return (
		<div className="ss__results">
		{
			controller.store.results.map(result => {
				return (
					<CustomResult key={result.id} result={result}/>
				)
			})
		}
		</div>
	)
});


const CustomResult = withController(withTracking((props) => {
	const { trackingRef, controller, result } = props;
	const { core } = result.mappings;

	return (
		<div className="ss__result" ref={trackingRef}>
			<a href={core.url}>
				{ core.name }
			</a>
			<button onClick={(e)=> controller.addToCart(result)}>Add to cart</button>
		</div>
	)
}));
```

Note that a `key` is required on the custom result component to ensure that the trackingRef is properly attached to the correct element.

### Alternative Tracking Integration Example using `ResultTracker`

```jsx
import { ResultTracker } from '@searchspring/snap-preact-components';

const Results = withController((props) => {
	const { controller } = props;

	return (
		<div className="ss__results">
			{
				controller.store.results.map(result => {
					const { core } = result.mappings;
					return (
						<ResultTracker key={result.id} result={result} controller={controller}>
							<a href={core.url}>
								{ core.name }
							</a>
							<button onClick={(e)=> controller.addToCart(result)}>Add to cart</button>
						</ResultTracker>
					)
				})
			}
		</div>
	)
});
```

## Events invoked outside of the integration code

**Note**: if using Shopify and you have installed Searchspring's Shopify Pixel Tracking extension, the following events will be tracked by the extension and integrating these events is not required.

Some reports rely on beacon data that is tracked outside of the main integration code. To ensure accurate reporting, these tracking events should be implemented on the relevant pages. Note that these tracking methods require the `bundle.js` script to be present on any page where they are used.

If you are unable to render the contents in the DOM due to caching or other limitations, you can instead call the corresponding tracking method directly using the global `window.searchspring.tracker` object.


### Shopper Login
Identifies the logged-in user. Should be invoked if a user is logged into their account. The value should contain any unique identifier (ie. user ID, email, hash)


- (Recommended) using the `shopper.id` context variable on the main `/bundle.js` script.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	shopper = {
		id: 'snapdev'
	};
</script>
```

- (Alternative) using the global `searchspring.tracker.track.shopper.login` method.

```typescript
searchspring.tracker.events.shopper.login({
	data: {
		id: 'snapdev'
	}
});
```

### Currency
Defines the currency of the shopper. This is not required if the storefront is configured to use a single currency. The value should be an ISO 4217 currency code.

- (Recommended) using the `currency` context variable on the main `/bundle.js` script.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	currency = {
		code: 'EUR'
	};
</script>
```

- (Alternative) using the global `searchspring.tracker.setCurrency` method.

```typescript
searchspring.tracker.setCurrency({
	code: 'EUR'
})
```


### Product View
Tracks product page views. Should only be installed on product detail pages. A `parentUid` and `uid` are required while  `sku` is optional.

```typescript
searchspring.tracker.events.product.pageView({
	data: {
		result: {
			parentUid: 'product123',
			uid: 'product123_red',
			sku: 'product123_red',
		}
	}
});
```

### Order Transaction
Tracks order transaction. Should be invoked from an order confirmation page. Expects an object with the following:

`orderId` - order id

`transactionTotal` - transaction total of all products before tax and shipping

`total` - transaction total of all products after tax and shipping

`vat` - (optional) value added tax rate

`city` - (optional) city name

`state` - (optional) 2 digit state abbreviation (US only)

`country` - (optional) 2 digit country abbreviation	(ie. 'US', 'CA', 'MX', 'PL', 'JP')

`results` - array of products

`results[].parentUid` - parent product uid

`results[].uid` - product uid

`results[].sku` - (optional) product sku

`results[].qty` - (optional) product qty

`results[].price` - (optional) product price

```typescript
searchspring.tracker.events.order.transaction({
	data: {
		orderId: '123456',
		transactionTotal: 31.97,
		total: 34.21,
		vat: 0.07,
		city: 'Los Angeles',
		state: 'CA',
		country: 'US',
		results: [
			{
				parentUid: 'product123',
				uid: 'product123_red',
				sku: 'product123_red',
				qty: '1',
				price: '9.99'
			},
			{
				parentUid: 'product_456',
				uid: 'product_456_blue',
				sku: 'product_456_blue',
				qty: '2',
				price: '10.99'
			}
		]
	}
});
```

### Cart Contents

Cart contents can be tracked one of two ways. The first method is to invoke the `cart.add` and `cart.remove` events directly. The second method is to define the cart contents via the `shopper.cart` context variable.

#### (Recommended) Invoking cart add and remove events

This requires integrating into platform cart events or manually attaching click handlers to add/remove buttons.

`results` - array of products being added or removed from the cart

`cart` - array of products currently in the cart (state after products have been added/removed)

`(results | cart)[].parentUid` - parent product uid

`(results | cart)[].uid` - product uid

`(results | cart)[].sku` - (optional) product sku

`(results | cart)[].qty` - (optional) product qty

`(results | cart)[].price` - (optional) product price

```typescript
searchspring.tracker.events.cart.add({
	data: {
		results: [
			{
				parentUid: 'product123',
				uid: 'product123_red',
				sku: 'product123_red',
				qty: '1',
				price: '9.99'
			}
		],
		cart: [
			{
				parentUid: 'product_456',
				uid: 'product_456_blue',
				sku: 'product_456_blue',
				qty: '1',
				price: '9.99'
			}
		]
	}
});
```

```typescript
searchspring.tracker.events.cart.remove({
	data: {
		results: [
			{
				parentUid: 'product123',
				uid: 'product123_red',
				sku: 'product123_red',
				qty: '1',
				price: '9.99'
			}
		],
		cart: []
	}
});
```

#### (Alternative) Defining cart contents via the `shopper.cart` context variable

This method will compare the provided cart contents with the current cart contents stored in local storage and only send events if there are differences.

```html
<script src="https://snapui.searchspring.io/[your_site_id]/bundle.js">
	shopper = {
		id: 'snapdev',
		cart: [
			{
				parentUid: 'product123',
				uid: 'product123_red',
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


## Cart Attribute Tracking

This is not required if the above `Cart View` and `Order Transaction` tracking has not been implemented OR you are not using the `realtime` recommendations configuration. 

Adding the following attributes to clickable cart elements allows for real-time updates to any recommendations (disabled by default) when the cart changes. If the click event occurs on a nested element, the attribute data will attempt to be retrieved from up to 3 parent nodes.

If you are using multiple custom Tracker instances with a different tracker `config.id`, attributes are namespaced by the trackers `id` (Default: `'track'`, Example: `ss-track-cart-add`)

### Add to cart
Adds product identifier to `ssCartProducts` cookie. Supports multiple products using a comma delimiter. It is preferable to use the more specific variant `uid` or `sku` instead of `parentUid` when available.

```html
<button ss-track-cart-add='product123_red'>Add to cart</button>
```

```html
<button ss-track-cart-add='product123_red,product_456_blue'>Add to cart</button>
```

Alternatively, this can also be integrated using the `searchspring.tracker.cookies.cart.add` method

```typescript
searchspring.tracker.cookies.cart.add(['product123'])
```


### Remove from cart
Removes product identifier from `ssCartProducts` cookie. Supports multiple products using a comma delimiter. It is preferable to use the more specific variant `uid` or `sku` instead of `parentUid` when available.

```html
<button ss-track-cart-remove='product123_red'>Remove</button>
```

```html
<button ss-track-cart-remove='product123_red,product_456_blue'>Remove</button>
```

Alternatively, this can also be integrated using the `searchspring.tracker.cookies.cart.remove` method

```typescript
searchspring.tracker.cookies.cart.remove(['product123'])
```


### Clear cart
Clears all products currently stored in the `ssCartProducts` cookie.

```html
<button ss-track-cart-clear>Clear Cart</button>
```

Alternatively, this can also be integrated using the `searchspring.tracker.cookies.cart.clear` method

```typescript
searchspring.tracker.cookies.cart.clear()
```

### View cart
Allows for real-time updates to any recommendations when an element with this attribute is clicked.

```html
<button ss-track-cart-view>View Cart</button>
```
