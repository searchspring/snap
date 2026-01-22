# FinderStore
The finder store is meant to hold the API response and associated selection state. It extends the AbstractStore and the search response by adding several additional properties and methods to make working with the data easier.

```js
import { FinderStore, FinderStoreConfig } from '@searchspring/snap-store-mobx'
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const finderConfig: FinderStoreConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{
			field: 'ss_tire',
			label: 'Wheel Finder',
			levels: ['Year', 'Make', 'Model', 'Wheel Size']
		},
	]
};

const finderUrlManager = new UrlManager(new UrlTranslator()).detach(0);
const store = new FinderStore(finderConfig, { urlManager: finderUrlManager });

store.update(data);

console.log(store.toJSON());
```

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring Meta API

## `pagination` property
See [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search) `pagination` property

## `config` property

A reference to the `FinderStoreConfig` object that was provided to instantiate the FinderStore

## `data` property
A reference to the data stored in the [StorageStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Storage) for this selection

## `storage` property
A reference to the [StorageStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Storage)

## `persistedStorage` property
A reference to the [StorageStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Storage) used for persisting finder selections (requires `config.persist.enabled` to be `true`)

## `state` property
An object used for finder state.

### `persisted` property
The `state.persisted` property is used to determine if finder selections have been persisted. (requires `config.persist.enabled` to be `true`)

Will be set to `true` when the `loadPersisted` method is invoked and `selections` have been persisted from local storage. 

Will be set to `false` when the `reset` method is invoked or any selections has been changed. 

## `save` method
The `save` method when invoked will save any current finder selections to local storage. (requires `config.persist` to be `true`)

## `loadPersisted` method
The `loadPersisted` method when invoked will update the store with data that has been saved to local storage using the `save` method. (requires `config.persist` to be `true`)

## `selections` property
An array of `Selection` and `SelectionHierarchy` objects. Each object represents a finder dropdown selection.

Both object types will have the following properties:

### `select` method
The `select` method should be invoked when a selection has been made, such as in the onChange event of a `<select>` element

```jsx
{selections.map((selection) => {
	<select onChange={(e) => {
		selection.select(e.target.value)
	}}>
		{selection.values.map((value) => {
			<option value={value}>{value}</option>
		})}
	</select>
})}
```

```js
const value = selections[0].values[0]
selections[0].select(value)
```

### `controller` property
A reference to the [FinderController](https://github.com/searchspring/snap/tree/main/packages/snap-controller/src/Finder)

### `type` property
Inherited from `facet.type` of the facet name that was provided in the config

### `field` property
Inherited from `facet.field` of the facet name that was provided in the config

### `filtered` property
Inherited from `facet.filtered` of the facet name that was provided in the config

### `collapse` property
Inherited from `facet.collapse` of the facet name that was provided in the config

### `display` property
Inherited from `facet.display` of the facet name that was provided in the config

### `label` property
Inherited from `facet.label` of the facet name that was provided in the config

### `multiple` property
Inherited from `facet.multiple` of the facet name that was provided in the config

### `id` property
A reference to the `id` property on the config 

### `disabled` property
Boolean set to `true` if this selection is disabled. A `Selection` object will be disabled if it does not contain any values. A `SelectionHierarchy` object will be disabled to enforce the user selects dropdowns in hierarchical order, or there are no further selections available

### `selected` property
Contains the value of the selection that was made. 

### `custom` property

See [`custom` property](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)