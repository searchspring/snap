# CartStore
The cart store is meant to act as a standalone temporary cart, mainly to be used in BundledRecommendations.

## `items` property

The items property contains an array of `Products` that are currently in the cart store. These items will have the entire `Product` type result object. 

## `count` property

The count property contains the number of items in the items array and their quantities added up together. 


## `price` property

The price property contains the total price of items in the items array multiplied by their quantities added up together. 


## `msrp` property

The msrp property contains the total msrp of items in the items array multiplied by their quantities added up together. 

## `addItems` property

The addItems property is a function to add items to the items array. Simply pass it an array of `Product` type result objects.

This will also fire the `addItems` event, which is passed a reference to the cartstore, as well as the items that were just added. 


## `removeItems` property

The removeItems property is a function to remove items from the items array. Simply pass it an array of `Product` type result objects you wish to remove.

If all items are removed from the items array, the `emptied` event will fire. This event will be passed a reference to the cartStore. 

This will also fire the `removeItems` event, which is passed a reference to the cartstore, as well as the items that were just added. 


## `reset` property
The reset property contains a function that will empty the items array. 

This will also fire the `reset` event, This event will be passed a reference to the cartStore. 