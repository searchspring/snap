# RecommendationStore
The recommendation store is meant to hold the recommend and profile API response and associated state. It extends the AbstractStore and the recommend response by adding several additional properties and methods to make working with the data easier.

```typescript
import { RecommendationStore } from '@searchspring/snap-store-mobx'
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const recommendationConfig = {
	id: 'recommendation',
	tag: 'also-bought'
};

const recommendationUrlManager = new UrlManager(new UrlTranslator()).detach(0);
const store = new RecommendationStore(recommendationConfig, { urlManager: recommendationUrlManager });

store.update(data);

console.log(store.toJSON());
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