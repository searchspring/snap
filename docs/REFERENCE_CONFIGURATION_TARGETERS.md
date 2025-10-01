# Targeters

When defining controllers in the Snap configuration, we can specify a `targeters` array of configuration objects. 
Each object in the array defines an entry point on the page where a component will be rendered and it's corresponding controller will be available via props.

## Targeter Configuration

| Property | Type | Description |
|----------|------|-------------|
| `selector` | `string` | The DOM selector to target |
| `component` | `function` | A function that returns a reference to the component to render at the target selector. Making this an async function is recommended to allow for code splitting. |
| `hideTarget` | `boolean` | Whether to hide the target node before the component is mounted and rendered. It is recommended to enable this to prevent flashy behaviour. |
| `autoRetarget` | `boolean` | Whether to continuously query for the selector in the DOM until it finds it and triggers a retarget. This is useful for dynamically generated selectors that might not exist at dom ready. |
| `skeleton` | `function` | A function that returns a reference to the component to render immediately at the target selector to show briefly while the data is returning and the real component is rendering. You can use any component you want for this, although `snap-preact-components` provides a `skeleton` component for you to use if preferred. |
| `props` | `object` | Convenient way of passing additional props to the component, by default we pass `controller` |
| `onTarget` | `function` | Callback that fires after a target is found. This is useful for triggering other actions such as initializing the controller. |
| `name` | `string` | Name to give the targeter for later reference using `controller.targeters` |


## Example

In this example we're creating a single search controller with two targeters. The `<Content>` component is injected into `<div id="searchspring-content">` and the `<Sidebar>` component is injected into `<div id="searchspring-sidebar">`. Each component will have access to the same controller via it's props.

```ts
// src/index.ts

const snap = new Snap({
    client: {
		globals: {
			siteId: 'abc123',
		},
	},
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
                },
                targeters: [
                    {
                        selector: '#searchspring-content',
                        component: async () => {
                            return (await import('./components/Content/Content')).Content;
                        },
                    },
                    {
                        selector: '#searchspring-sidebar',
                        component: async () => {
                            return (await import('./components/Sidebar/Sidebar')).Sidebar;
                        },
                    },
                ],
            },
        ],
    },
});
```

To access the targeters after they have been created, we can first retrieve the controller and then use the `controller.targeters` property. This is a map of the targeter names (or selector if name is not provided) to the targeter objects.

```ts
snap.getController('search').then((controller) => {
    const contentTargeter = controller.targeters['#searchspring-content'];
    const sidebarTargeter = controller.targeters['#searchspring-sidebar'];
});
```


## Targeter Methods

| Method | Description |
|--------|-------------|
| `getTargets` | Returns the array of targets specified during construction |
| `retarget` | Triggers a retarget for the targeter |

### retarget method

If the targets are created after the DomTargeter and DOMContentLoaded event has fired, the retarget method can be used to check for target existence.

```ts
// manually retarget
searchPageTarget.retarget();
```

### getTargets method

Return the array of targets specified during construction.
