# Shopify Platform
This platform library gives you helper functions and plugins to use with the Shopify platform. 

## Functions

### addToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/cart`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional properties, `redirect` and `idFieldName`. Variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/cart`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

> [!IMPORTANT]
> The `Shopify` object needs to be available on the window.

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

## Plugins

### pluginAddToCart
Plugin to attach a custom function to the addToCart controller event.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | configuration to allow for disabling the plugin | boolean | true | ➖ |
| redirect | set to `false` or provide alternate redirect URL | boolean \| string | '/cart' | ➖ |
| idFieldName | field name to use for the product identifier to use when adding product | string | 'display.mappings.core.uid' | ➖ |


```jsx
const addToCartConfig = {
	redirect: false,
	idFieldName: 'display.mappings.core.sku'
}
```

### pluginBackgroundFilters
Plugin to set up background filters for Shopify. Script context is used to automatically apply best practice Shopify background filtering. Background filtering in this plugin only applies to search controllers.

> [!NOTE]
> If you need to customize background filters beyond what is available in the configuration, you will need to utilize the the common backgroundFilters plugin.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | configuration to allow for disabling the plugin | boolean | true | ➖ |
| fieldNames | object used to set custom field names for background filtering | object | ➖ | ➖ |
| fieldNames.collection | name of the field use for collection background filter | string | 'collection_handle' | ➖ |
| fieldNames.tags | name of the field use for tags background filter | string | 'tags' | ➖ |
| fieldNames.vendor | name of the field use for vendor background filter | string | 'vendor' | ➖ |
| fieldNames.type | name of the field use for product type background filter | string | 'product_type' | ➖ |

This plugin relies on specific Shopify script context variables for creating background filters via the integration script context. Collection, types and vendor background filters are supported, in addition to tags (used for additional filtering); special characters will be automatically handled. See the examples below:

Collection Page:
```html
<script id="searchspring-context" src="bundle.js">
	collection = {
		name : "Test Collection",
		handle : "test-collection",
	};
</script>
```

Collection Page with Tags:
```html
<script id="searchspring-context" src="bundle.js">
	collection = {
		name : "Test Collection",
		handle : "test-collection",
	};

	tags = ["test", "color:green"];
</script>
```

### pluginMutateResults
Enables updating the URL for products within search results; product URLs will be prefixed with their category route. The platform specific context variable `collection.handle` must be provided for this functionality.

> [!IMPORTANT]
> Requires that the `Shopify` object is available on the window.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| mutations | Shopify results mutations configuration object | object | ➖ | ➖ |
| mutations.collectionInUrl | collection in URL Mutation configuration object | object | ➖ | ➖ |
| mutations.collectionInUrl.enabled | configuration to allow for disabling of the mutation | object | true | ➖ |

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