# FinderStore

```typescript
import { FinderStore } from '@searchspring/snap-store-mobx'

const store = new FinderStore();

store.update(data)

console.log(store)
```

## `meta` property
The meta property is an object containing the meta data retrieved from the Searchspring [Meta API](http://snapi.kube.searchspring.io/api/v1/#tag/Meta)

## `pagination` property
See [SearchStore Pagination](#SearchStorePagination)

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

```typescript
const value = selections[0].values[0]
selections[0].select(value)
```

<h3 id="FinderStoreSelectionsConfig">`config` property</h3>

A reference to the selection config object that was provided to the [FinderController](../snap-controller/#FinderController)

### `data` property
A reference to the data stored in the [StorageStore](#StorageStore) for this selection

### `storage` property
A reference to the [StorageStore](#StorageStore)

### `controller` property
A reference to the [FacetController](../snap-controller/#FacetController)

### `type` property
Inherited from [facet.type](#SearchFacetsType) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `field` property
Inherited from [facet.field](#SearchFacetsField) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `filtered` property
Inherited from [facet.filtered](#SearchFacetsFiltered) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `collapse` property
Inherited from [facet.collapse](#SearchFacetsCollapse) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `display` property
Inherited from [facet.display](#SearchFacetsDisplay) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `label` property
Inherited from [facet.label](#SearchFacetsLabel) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `multiple` property
Inherited from [facet.multiple](#SearchFacetsMultiple) of the facet name that was provided in the [config](#FinderStoreSelectionsConfig)

### `id` property
A reference to the `id` property on the config that was provided to the [FinderController](../snap-controller/#FinderController)

### `disabled` property
Boolean set to `true` if this selection is disabled. A `Selection` object will be disabled if it does not contain any values. A `SelectionHierarchy` object will be disabled to enforce the user selects dropdowns in hierarchical order, or there are no further selections available

### `selected` property
Contains the value of the selection that was made. 

### `custom` property
This is an empty object that is available for custom store manipulation using the [EventManager](../snap-event-manager)