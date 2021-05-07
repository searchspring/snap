# Snap MobX Store

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

Management of Snap state using Mobx.

---

# Dependency

Snap Store MobX is a dependency of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

<details>
	<summary>Package dependencies hierarchy</summary>
	<br/>
	<img src="../../images/snap-dependencies.jpg" />
</details>
<br>


# Installation

```bash
npm install --save @searchspring/snap-store-mobx
```


# Usage
## Import
```typescript
import { SearchStore, AutocompleteStore, FinderStore, AbstractStore, StorageStore } from '@searchspring/snap-store-mobx';
```

## Controller usage

Snap Store MobX is a dependency of Snap Controller which will handle store changes as needed. As such, it is recommended to use methods of the controller to access and update the store.


## Standalone usage

```typescript
import { SearchStore } from '@searchspring/snap-store-mobx'

const store = new SearchStore();

store.update(data);

// log the store
console.log(store.toJSON());
```