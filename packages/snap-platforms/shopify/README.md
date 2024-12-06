# Shopify Platform
This platform library gives you helper functions to use with the Shopify platform. 


## Usage 
To use the platform library, simply import what you wish to use from `@searchspring/snap-platforms/shopify`.

```jsx
import { addToCart } from '@searchspring/snap-platforms/shopify';

export const AddToCart = (props) => {
	const { result } = props;
	const config = {
		idFieldName: `display.mappings.core.sku`,
	}

	return (
		<div onClick={() => addToCart([result], config)}>Add To Cart</div>
	)
};
```

```jsx
import { mutateResults } from '@searchspring/snap-platforms/shopify';

const mutateResultsConfig = {
	collectionInUrl: {
		enabled: true,
	}
}
controller.plugin(scrollToTop, scrollToTopConfig);
```

## SnapTemplates Usage
To use a plugin in [SnapTemplates](https://github.com/searchspring/snap/blob/main/docs/TEMPLATES_ABOUT.md), it can be defined and configured in the `config.plugins` section.

```jsx
const mutateResultsConfig = {
	collectionInUrl: {
		enabled: true,
	}
}
...
plugins: {
	shopify: {
		mutateResults: mutateResultsConfig
	}
}
```

## addToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/cart`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional properties, `redirect` and `idFieldName`. Snap variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/cart`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

Note that the `Shopify` object needs to be available on the window.


## mutateResults
Enables updating the URL for products within search results; product URLs will be prefixed with their category route. The platform specific context variable `collection` must be provided for this functionality.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `mutateResults` | Shopify Updating results configuration | Object | ➖ |
| `mutateResults.collectionInUrl` | Results URL Mutation configuration | Object | ➖ |
| `mutateResults.collectionInUrl.enabled` | Enables middleware | Object | true |

```jsx
const mutateResultsConfig = {
	collectionInUrl: {
		enabled: true,
	}
}
...
plugins: {
	shopify: {
		mutateResults: mutateResultsConfig
	}
}
```