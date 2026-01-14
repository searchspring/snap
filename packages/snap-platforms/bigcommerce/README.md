# BigCommerce Platform
This platform library gives you helper functions to use with the BigCommerce platform. 


## Usage 
To use the platform library, simply import what you wish to use from `@searchspring/snap-platforms/bigcommerce`.

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

## addToCart
The `addToCart` function will automatically add products to the cart and then redirect to the cart page (`/cart.php`). The function is async, and takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional properties, `redirect` and `idFieldName`. Snap variants must be enabled for full functionality.

The `redirect` property can be set to `false` or supplied with an alternate redirect URL instead of the default (`/cart.php`). 

The `idFieldName` property takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.
