## Tracking
Certain reports depend on beacon data being tracked. These are events tracked outside of the integration code and should be added to various pages. These tracking methods require that our `bundle.js` script exist on the pages where utilized.

### Shopper Login
Identifies the logged-in user. Should be invoked if a user is logged into their account. The value should contain any unique identifier (ie. user ID, email, hash)

```html
<script type="searchspring/track/shopper/login">
	id = 'snapdev';
</script>
```

Alternatively, this can also be integrated using the global `searchspring.tracker.track.shopper.login` methods.

```typescript
searchspring.tracker.track.shopper.login({
	id: 'snapdev'
});
```

### Product View
Tracks product page views. Should only be installed on product detail pages. A `uid` and/or `sku` and/or `childSku` and/or `childUid` are required (provide as many of these product identifiers that are available).

```html
<script type="searchspring/track/product/view">
	item = {
		uid: '123',
		sku: 'product123',
		childUid: '123_a',
		childSku: 'product123_a'
	};
</script>
```

Alternatively, this can also be integrated using the `searchspring.tracker.track.product.view` method

```typescript
searchspring.tracker.track.product.view({
	uid: '123',
	sku: 'product123',
	childUid: '123_a',
	childSku: 'product123_a'
});
```


### Order Transaction
Tracks order transaction. Should be invoked from an order confirmation page. Expects an object with the following:

`order` - object containing the following

`order.id` - order id

`order.total` - transaction total of all items after tax and shipping

`order.transactionTotal` - transaction total of all items before tax and shipping

`order.city` - (optional) city name

`order.state` - (optional) 2 digit state abbreviation (US only)

`order.country` - (optional) 2 digit country abbreviation	(ie. 'US', 'CA', 'MX', 'PL', 'JP')

`items` - array of items

`items.uid` - product uid

`items.sku` - (optional) product sku

`items.childUid` - (optional) product child uid

`items.childSku` - (optional) product child sku

`items.qty` - (optional) product qty

`items.price` - (optional) product price


```html
<script type="searchspring/track/order/transaction">
	order = {
		id: '123456',
		total: '34.29',
		transactionTotal: '31.97',
		city: 'Los Angeles',
		state: 'CA',
		country: 'US',
	};
	items = [
		{
			uid: '123',
			sku: 'product123',
			childUid: '123_a',
			childSku: 'product123_a',
			qty: '1',
			price: '9.99'
		},
		{
			uid: '456',
			sku: 'product456',
			childUid: '456_a',
			childSku: 'product456_a',
			qty: '2',
			price: '10.99'
		},
	];
</script>
```

Alternatively, this can also be integrated using the `searchspring.tracker.track.order.transaction` method

```typescript
searchspring.tracker.track.order.transaction({
	order: {
		id: '123456',
		total: '34.29',
		transactionTotal: '31.97',
		city: 'Los Angeles',
		state: 'CA',
		country: 'US',
	},
	items: [
		{
			uid: '123',
			sku: 'product123',
			childUid: '123_a',
			childSku: 'product123_a',
			qty: '1',
			price: '9.99'
		},
		{
			uid: '456',
			sku: 'product456',
			childUid: '456_a',
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


Alternatively, this can also be integrated using the `searchspring.tracker.track.product.click` method. 

The `intellisuggestData` and `intellisuggestSignature` values are returned from SearchSpring's Search API on each `result.attributes` object. An optional `href` value can also be provided. 

```typescript
searchspring.tracker.track.product.click({
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
Adds product `uid` or `sku` (or `childSku`/`childUid`) to `ssCartProducts` cookie. It is preferable to use the more specific variant `childSku` or `childUid` if available. Supports multiple products using a comma delimiter.

```html
<button ss-track-cart-add='product123'>Add to cart</button>
```

Alternatively, this can also be integrated using the `searchspring.tracker.cookies.cart.add` method

```typescript
searchspring.tracker.cookies.cart.add(['product123'])
```


### Remove from cart
Removes product `uid` or `sku` (or `childSku`/`childUid`) to `ssCartProducts` cookie. It is preferable to use the more specific variant `childSku` or `childUid` if available. Supports multiple products using a comma delimiter.

```html
<button ss-track-cart-remove='product123'>Remove</button>
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

Alternatively, this can also be integrated using the `searchspring.tracker.cookies.cart.remove` method

```typescript
searchspring.tracker.cookies.cart.clear()
```

### View cart
Allows for real-time updates to any recommendations when an element with this attribute is clicked.

```html
<button ss-track-cart-view>View Cart</button>
```
