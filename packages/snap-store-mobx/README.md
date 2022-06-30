# Snap MobX Store

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

Management of Snap state using Mobx.

## Dependency

Snap Store MobX is a dependency of [@searchspring/snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

## Dependencies

Snap Store MobX requires the following dependencies as services:

<a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a> [@searchspring/snap-url-manager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager)

## Installation

```bash
npm install --save @searchspring/snap-store-mobx
```

## Import
```typescript
import { AbstractStore, SearchStore, AutocompleteStore, FinderStore, RecommendationStore, StorageStore } from '@searchspring/snap-store-mobx';
```

## Controller usage

Snap Store MobX is a dependency of Snap Controller which will handle store changes as needed. As such, it is recommended to use methods of the controller to access and update the store.


## Standalone usage

```typescript
import { SearchStore } from '@searchspring/snap-store-mobx'
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

const searchConfig = {
	id: 'search',
	globals: {
		pagination: {
			pageSize: 12
		}
	}
};

const store = new SearchStore(searchConfig, { urlManager: new UrlManager(new UrlTranslator()) });

store.update(data);

// log the store
console.log(store.toJSON());
```