# DomTargeter
`DomTargeter` is a utility used for rendering components in specified DOM targets. 

```typescript
import { DomTargeter } from '@searchspring/snap-toolbox';
```

The constructor accepts an array of targets, an onTarget callback function, and optionally the Document.

When the DomTargeter is constructed it will immediately look for elements in the document that match each target selector. When found the `onTarget` functions will be executed. DomTargeters will additionally look for targets when the `DOMContentLoaded` document event fires. Should targets be added after, the `retarget` method can be utilized.

Typical usage would be to render a component into the DOM.

```typescript
const contentTarget = new DomTargeter(
	[
		{
			selector: '#searchspring-content',
			component: <Content />,
		},
	],
	(target, elem) => {
		// onTarget function
		render(target.component, elem);
	}
);
```

## `retarget` method
If the targets are created after the DomTargeter and `DOMContentLoaded` event has fired, the `retarget` method can be used to check for target existence.

```typescript
// manually retarget
searchPageTarget.retarget();
```

## `getTargets` method
Return the array of targets specified during construction.