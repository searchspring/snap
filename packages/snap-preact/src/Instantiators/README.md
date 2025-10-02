# Instantiators

## RecommendationInstantiator
The `RecommendationInstantiator` class handles the targeting and creation of recommendation controllers. The instantiator looks for targets in the DOM, creates a controller and injects components into the DOM.


### controller

The `controller` property is an object of recommendation controller instances that have been created.

All controllers can be accessed via the `controller` object where the key is the id of the controller that was created. The controller id is generated based on the `profile` attribute and it's occurance count (starting at 0.) It follows the following format: 

```typescript
id: `recommend_${tag}_${profileCount[tag] - 1}`,
```

For example, if the page contains the following single recommendation instance:

```html
<script type="searchspring/personalized-recommendations" profile="trending"></script>
```

The controller id would be `recommend_trending_0`.


### cartStore

If the profile type passed to the controller is `bundle`, the controller will automatically create a [cartStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Cart) for use with the Bundle Recommendations.


### client

A reference to the shared [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) instance used by each controller.


### tracker

A reference to the shared [@searchspring/snap-tracker](https://github.com/searchspring/snap/tree/main/packages/snap-tracker) instance used by each controller.


### logger

A reference to the shared [@searchspring/snap-logger](https://github.com/searchspring/snap/tree/main/packages/snap-logger) instance used by each controller.


### config

A reference to the config object used in instantiation.

### uses

A reference to any middleware added from invoking `RecommendationInstantiator.use()`

### plugins

A reference to any middleware added from invoking `RecommendationInstantiator.plugin()`

### middleware

A reference to any middleware added from invoking `RecommendationInstantiator.on()`


