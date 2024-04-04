# Magento2 Plugin
This plugin gives you helper functions to use with the Magento2 platform. 


## Usage 
To use the plugin, simply import it and pass it to your plugins array on the controller config. This will automatically make any functions on the plugin available to use on the controller via `controller.magento2`.


```jsx
import { magento2 } from '@searchspring/snap-plugins-bigCommerce';

const config = {
	...
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					plugins: [[magento2]],	
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
        callback: () => console.log('added to cart'),
    }

    return (
        <div onClick={() => controller.magento2.addToCart([result], config)}>Add To Cart</div>
    )
}))
```

## AddToCart
The `addToCart` function will automatically add products to the cart and then navigate to the cart page. The function takes an array of products (Result Store References) to add, and an optional config. The optional config can take four optional fields, `callback`,`idFieldName`, `form_key`, & `uenc`.

The `callback` setting takes a function to call after the products are added to the cart, this will get called rather than the automatic redirect to the cart page. 

The `idFieldName` setting takes a stringified path in the result reference, to look for the product id to add. `display.mappings.core.sku` for example. By default it will use `display.mappings.core.uid`.

The `form_key` setting allows you to pass a custom `form_key` to use in the add to cart api call. 

The `uenc` setting allows you to pass a custom `uenc` code to use in the add to cart api call. 

## getUenc 
The `getUenc` function will return the uenc code from the url using the `btoa` function.

## getFormKey
The `getFormKey` function will return the form key from the `form_key` cookie.