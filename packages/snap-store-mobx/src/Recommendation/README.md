# RecommendationStore

```typescript
import { RecommendationStore } from '@searchspring/snap-store-mobx'

const store = new RecommendationStore();

store.update(data)

console.log(store)
```

## `reset` method
Reset store to the initial state by clearing data

```typescript
const store = new RecommendationStore();

store.reset()
```

The following methods/getter are available:

#### `reset` method
Sets lock state to the original starting state when the Lock was constructed

#### `update` method
Updates the store with latest API response


## `profile` property
Contains an object with the following properties:

`tag` - the profile unique tag (set in SMC)

`placement` - location of the profile on a site (set in SMC)

`display` - object containing details regarding the template and any template parameters
## `results` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `results` property