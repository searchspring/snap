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
See [RecommendationStore profile](#SearchStoreFilters)

## `results` property
See [SearchStore Results](#SearchStoreResults)