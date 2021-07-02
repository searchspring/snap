## DomTargeter
`DomTargeter` is a utility used for rendering components in specified DOM targets. 

```typescript
import { DomTargeter } from '@searchspring/snap-toolbox';
```

The constructor accepts an array of targets, an onTarget callback function, and optionally the Document.

```typescript
const searchPageTarget = new DomTargeter(
	[
		{
			selector: '.searchspring-container',
			component: <SearchPage />,
		},
	],
	(target, elem) => {
		render(target.component, elem);
	}
);
```

Typical usage would be used with [snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) to render content and sidebar components in a two-column layout.

```typescript
searchController.on('init', async ({ controller }, next) => {
	const contentTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-content',
				component: <Content store={controller.store} />,
			},
		],
		(target, elem) => {
			// run search after finding target
			controller.search();

			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

	const sidebarTarget = new DomTargeter(
		[
			{
				selector: '#searchspring-sidebar',
				component: <Sidebar store={controller.store} />,
			},
		],
		(target, elem) => {
			// empty element
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			render(target.component, elem);
		}
	);

	window.addEventListener('DOMContentLoaded', () => {
		contentTarget.retarget();
		sidebarTarget.retarget();
	});

	await next();
})
```

### `retarget` method
If the DOM is loaded asynchronously and the target element is not present at the time of when an instance of DomTargeter is created, it is recommended to retarget when the DOMContentLoaded event has been invoked.

```typescript
window.addEventListener('DOMContentLoaded', () => {
	searchPageTarget.retarget();
});
```