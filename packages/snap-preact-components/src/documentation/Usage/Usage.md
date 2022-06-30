Snap Preact components are designed to be used with the Snap MobX store package `@searchspring/snap-store-mobx` .

Snap stores are a dependency for Snap controllers `@searchspring/snap-controller`. Snap controllers such as `SearchController` contain a reference to the `SearchStore` that was provided in the `ControllerServices` object named `searchControllerServices` below.

Many component props are tied to the design of the store for ease of use:

In this example, the `store.pagination` property is provided to the `pagination` prop of the `<Pagination />` component.


```typescript
import { SearchController } from '@searchspring/snap-controller';

const searchController = new SearchController(searchConfig, searchControllerServices);

console.log(searchController.store)
```

```typescript
import { Pagination } from '@searchspring/snap-preact-components';
```

```jsx
<Pagination pagination={searchController.store.pagination} />
```

<br/>

**Usage examples for each component can be seen in the component's 'Docs' tab.**
