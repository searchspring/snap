# Magento2 Platform
This platform library gives you helper functions and plugins to use with the Magento2 platform. 

## Functions

### addToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/checkout/cart/`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take several optional properties, `redirect`, `idFieldName`, `formKey`, and `uenc`. Snap variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/checkout/cart/`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

The `formKey` property allows you to pass a custom form key to use in the add to cart call. 

The `uenc` property allows you to pass a custom `uenc` code to use in the add to cart call. 

```jsx
import { addToCart } from '@searchspring/snap-platforms/magento2';

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

### getFormKey
The `getFormKey` function will return the form key from the `form_key` cookie.

### getUenc
The `getUenc` function will return the uenc code from the current url (window.location.href) using the `btoa` function.

## Plugins

### pluginAddToCart
Plugin to attach a custom function to the addToCart controller event.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | configuration to allow for disabling the plugin | boolean | true | ➖ |
| redirect | set to `false` or provide alternate redirect URL | boolean \| string | '/checkout/cart/' | ➖ |
| idFieldName | field name to use for the product identifier to use when adding product | string | 'display.mappings.core.uid' | ➖ |
| formKey | formKey to use when adding to cart, this will be grabbed from the 'form_key' cookie by default | string | ➖ | ➖ |
| uenc | uenc to use when adding to the cart, this will use the current url by default | string | ➖ | ➖ |


```jsx
const addToCartConfig = {
	redirect: '/cart',
	idFieldName: 'display.mappings.core.sku'
}
```

### pluginBackgroundFilters
Plugin to set up background filters for Magento2. Script context is used to automatically apply best practice Magento2 background filtering. Product visibility is handled by default using the `visibility` field with a value of `Search` on search requests, and `Catalog` when displaying category data. Background filtering in this plugin applies to search (category and visibility) and autocomplete (visibility only) controllers.

> [!NOTE]
> If you need to customize background filters beyond what is available in the configuration, you will need to utilize the the common backgroundFilters plugin.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | configuration to allow for disabling the plugin | boolean | true | ➖ |
| fieldNames | object used to set custom field names for background filtering | object | ➖ | ➖ |
| fieldNames.category | name of the field use for brand background filter | string | 'categories_hierarchy' | ➖ |
| fieldNames.visibility | name of the field use for visibility background filter | string | 'visibility' | ➖ |

This plugin relies on specific Magento2 script context variables for creating background filters via the integration script context. Category and visibility background filtering are supported, and special characters will be automatically handled. See the examples below:

```html
<script id="searchspring-context" src="bundle.js">
	category = {
		path : "Kitchen>Sinks",
	};
</script>
```