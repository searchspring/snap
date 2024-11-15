# Magento2 Platform
This platform library gives you helper functions to use with the Magento2 platform. 


## Usage 
To use the platform library, simply import what you wish to use from `@searchspring/snap-platforms/magento2`.

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

## AddToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/checkout/cart/`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take several optional properties, `redirect`, `idFieldName`, `formKey`, and `uenc`. Snap variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/checkout/cart/`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

The `formKey` property allows you to pass a custom form key to use in the add to cart call. 

The `uenc` property allows you to pass a custom `uenc` code to use in the add to cart call. 

## getUenc 
The `getUenc` function will return the uenc code from the url using the `btoa` function.

## getFormKey
The `getFormKey` function will return the form key from the `form_key` cookie.
