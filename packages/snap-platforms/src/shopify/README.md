# Shopify Plugin
This plugin gives you helper functions to use with the Shopify platform. 


## Usage 
To use the plugin, simply import it and pass it to your plugins array on the controller config. This will automatically make any functions on the plugin available to use on the controller via `controller.shopify`.


```jsx
import { shopify } from '@searchspring/snap-plugins-shopify';

const config = {
	...
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					plugins: [[shopify]],	
				},
                ...
            }
        ]
    }
    ...
}

export const Result = withController(observer((props) => {
	const { controller, result } = props;

    const config = {
        idFieldName: `display.mappings.core.sku`,
        callback: () => console.log('added to cart')
    }

    return (
        <div onClick={() => controller.shopify.addToCart([result], config)}>Add To Cart</div>
    )
}))
```

## AddToCart
The `addToCart` function will automatically add products to the cart and then navigate to the cart page. The function takes an array of products (Result Store References) to add, and an optional config. The optional config can take two optional fields, a `callback` and `idFieldName`. 

The `callback` setting takes a function to call after the products are added to the cart, this will get called rather than the automatic redirect to the cart page.

The `idFieldName` setting takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

Note that the `Shopify` object needs to be available on the window. 

