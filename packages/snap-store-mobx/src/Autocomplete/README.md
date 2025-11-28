# AutocompleteStore
The autocomplete store is meant to hold the suggest and search API response and associated state. It extends the AbstractStore and the recommend response by adding several additional properties and methods to make working with the data easier.

```js
import { AutocompleteStore } from '@searchspring/snap-store-mobx'
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const autocompleteConfig = {
	id: 'autocomplete',
	selector: '#searchInput',
	settings: {
		syncInputs: true
	},
};

const autocompleteUrlManager = new UrlManager(new UrlTranslator()).detach();
const store = new AutocompleteStore(autocompleteConfig, { urlManager: autocompleteUrlManager });

store.update(data);

console.log(store.toJSON());
```

## `updateTrendingTerms` method
Used to update the store with trending terms data

## `setService` method
Used to update any services on the store

## `reset` method
Reset store to the initial state by clearing data and locks

```js
store.reset()
```

## `resetTerms` method
Sets all term suggestions to inactive

## `resetTrending` method
Sets all trending term suggestions to inactive

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring Meta API

## `state` property
Contains autocomplete lock state

A "lock" refers to a locked state of a certain component of autocomplete. There are two lock components of autocomplete:

`state.locks.terms` - this becomes locked when a term's `preview` method is called, resulting in the terms not changing while the user interacts with the facets and results for the locked term. Without locking, Autocomplete API requests from user interaction would cause the terms to change unexpectedly

`state.locks.facets`, similar to the terms lock, this prevents facets from changing when interacting with other facets

<!-- TODO: explain locks better? -->


### `locks` property
The `locks` object contains two properties:

- `terms` property contains a Lock object

- `facets` property contains a Lock object

### `focusedInput` property
Contains a reference to the current focused `HTMLInputElement`

### `input` property
Contains the currently focused input value being searched

### `url` property
Contains a reference to the [UrlManager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager) that was linked using the `link` method

## `Lock` object
A `Lock` object contains a private boolean state. The initial state can be defined in the constructor, default is `false`

### `reset` method
Sets lock state to the original starting state when the Lock was constructed

### `lock` method
Sets lock state to `true`

### `unlock` method
Sets lock state to `false`

### `locked` getter
Boolean `true` if the Lock state is locked

```js
let lock;
lock = new Lock()
console.log(lock.locked) // false

lock = new Lock(false)
console.log(lock.locked) // false
lock.lock()
console.log(lock.locked) // true
lock.reset();
console.log(lock.locked) // false

lock = new Lock(true)
console.log(lock.locked) // true
lock.unlock()
console.log(lock.locked) // false
lock.reset();
console.log(lock.locked) // true
```

## `storage` property
Contains a reference to the [StorageStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Storage)

<!-- TODO: update link -->

## `merchandising` property
Contains redirect and banner merchandising data that the Search API returned. See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `merchandising` property

## `search` property
Contains an object with the following properties:

`query` - query that was searched

`originalQuery` - Original query if spell correction occurred

## `terms` property
An array of `Term` objects.

## `trending` property
An array of trending `Term` objects.

## `history` property
An array of previously searched `Term` objects.

## `Term` object
Each `Term` object corresponds to a term returned from the Autocomplete API and/or Suggest API

### `active` property
Boolean set to `true` when the term is active, such when invoking the `preview` method

### `value` property
Term text value

### `url` property
Set to an instance of UrlManager for the term

### `preview` method
Query API for the term that was previewed and displays results.
This will also lock the term state, and unlock facets state. 


## `facets` property
An array of facets. See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `facets` property

In addition to all the search facets functionally, the Autocomplete facets will have an added `preview` method

### `preview` method
See `terms.preview` for `facets.preview` usage


## `filters` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `filters` property

## `results` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `results` property

## `pagination` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `pagination` property

## `sorting` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `sorting` property