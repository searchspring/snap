# Snap Event Manager

<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

The Snap Event Manager allows you to hook into controller events before data is rendered.

It also allows for custom events to be used throughout your implementation.

---

# Dependency

Snap Event Manager is a dependency of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>


<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="../../images/snap-dependencies.jpg"/>
</details>


# Installation

```bash
npm install --save @searchspring/snap-event-manager
```

# Usage
## Import
```typescript
import { EventManager } from '@searchspring/snap-event-manager';
```
## Controller usage
Snap Event Manager is a dependency of Snap Controller and it is recommended to use methods of the controller to attach events to the EventManager

See [Typical Usage](../../README.md#TypicalUsage)

## Standalone usage
### `on` method
Add a new event

```typescript
const eventManager = new EventManager();

eventManager.on('scrollToTop', () => {
    // keep the same position when a user clicks on a facet
	if (controller.store.pagination.page != 1) {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
});
```

### `fire` method
Invoke event

```typescript
eventManager.fire('scrollToTop')
```

