# Shopify Platform
This platform library gives you helper functions to use with the Shopify platform. 


## Usage 
To use the platform library, simply import what you wish to use from `@searchspring/snap-platforms/shopify`.

```jsx
import { addToCart } from '@searchspring/snap-platforms/shopify';

export const Result = withController(observer((props) => {
	const { controller, result } = props;

    const config = {
        idFieldName: `display.mappings.core.sku`,
        callback: () => console.log('added to cart')
    }

    return (
        <div onClick={() => addToCart([result], config)}>Add To Cart</div>
    )
}))
```

## AddToCart
The `addToCart` function will automatically add products to the cart and then navigate to the cart page. The function takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional fields, a `callback` and `idFieldName`. 

The `callback` setting takes a function to call after the products are added to the cart, this will get called rather than the automatic redirect to the cart page.

The `idFieldName` setting takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

Note that the `Shopify` object needs to be available on the window. 

