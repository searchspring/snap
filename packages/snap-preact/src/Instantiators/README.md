# Instantiators

## RecommendationInstantiator
The `RecommendationInstantiator` class handles the targetting and creation of recommendation controllers from querying the DOM.


### controllers

The `controllers` property contains an object of all recommendation instance that has been found on the page. Each instance will have its own `RecommendationController` instance created and added to the `controllers` object. 

All controllers can be accessed via the `controllers` object where the key is the id of the controller that was created. The controller id is generated based on the `profile` attribute and it's occurance count (starting at 0.) It follows the following format: 

```typescript
id: `recommend_${tag + (profileCount[tag] - 1)}`,
```

For example, if the page contains the following single recommendation instance:

```html
<script type="searchspring/personalized-recommendations" profile="trending"></script>
```

The controller id would be `recommend_trending0` and can be accesed as follows:

```typescript
import { Snap } from '@searchspring/snap-preact';

const snap = new Snap(config);
const recommendations = snap.recommendations;
const controllers = recommendations.controllers;
const { recommend_trending0 } = controllers;

console.log("recommend_trending0", recommend_trending0)
```

### client

A reference to the shared [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) instance used by each controller.


### tracker

A reference to the shared [@searchspring/snap-tracker](https://github.com/searchspring/snap/tree/main/packages/snap-tracker) instance used by each controller.


### logger

A reference to the shared [@searchspring/snap-logger](https://github.com/searchspring/snap/tree/main/packages/snap-logger) instance used by each controller.


### config

A reference to the `config.instantiators.recommendation` config object as part of the config that was provided to Snap.

### uses

A reference to any middleware added from invoking `RecommendationInstantiator.use()`

### plugins

A reference to any middleware added from invoking `RecommendationInstantiator.plugin()`

### middleware

A reference to any middleware added from invoking `RecommendationInstantiator.on()`


