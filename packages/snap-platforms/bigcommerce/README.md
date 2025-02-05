# BigCommerce Platform
This platform library gives you helper functions and plugins to use with the BigCommerce platform. 

## Functions

### addToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/cart.php`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional properties, `redirect` and `idFieldName`. Snap variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/cart.php`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

```jsx
import { addToCart } from '@searchspring/snap-platforms/bigcommerce';

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
| redirect | set to `false` or provide alternate redirect URL | boolean \| string | '/cart.php' | ➖ |
| idFieldName | field name to use for the product identifier to use when adding product | string | 'display.mappings.core.uid' | ➖ |


```jsx
const addToCartConfig = {
	redirect: '/cart',
	idFieldName: 'display.mappings.core.sku'
}
```

### pluginBackgroundFilters
Plugin to set up background filters for BigCommerce. Script context is used to automatically apply best practice BigCommerce background filtering. Background filtering in this plugin only applies to search controllers.

> [!NOTE]
> If you need to customize background filters beyond what is available in the configuration, you will need to utilize the the common backgroundFilters plugin.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | configuration to allow for disabling the plugin | boolean | true | ➖ |
| fieldNames | object used to set custom field names for background filtering | object | ➖ | ➖ |
| fieldNames.brand | Name of the field use for brand background filter | string | 'brand' | ➖ |
| fieldNames.category | Name of the field use for brand background filter | string | 'categories_hierarchy' | ➖ |

This plugin relies on specific BigCommerce script context variables for creating background filters via the integration script context. Both category and brand background filter are supported, and special characters will be automatically handled. See the examples below:

```html
<script id="searchspring-context" src="bundle.js">
	category = {
		id : "185",
		name : "Sinks",
		path : "Kitchen>Sinks",
	};
</script>
```

```html
<script id="searchspring-context" src="bundle.js">
	brand = {
		name: "My Favorite Brand",
	};
</script>
```