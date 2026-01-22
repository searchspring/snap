# DomTargeter
`DomTargeter` is a utility used for rendering components in specified DOM targets. 

```js
import { DomTargeter } from '@searchspring/snap-toolbox';
```

The constructor accepts an array of targets, an onTarget callback function, and optionally the Document.

When the DomTargeter is constructed it will immediately look for elements in the document that match each target selector. When found the `onTarget` functions will be executed. DomTargeters will additionally look for targets when the `DOMContentLoaded` document event fires. Should targets be added after, the `retarget` method can be utilized.

Typical usage would be to render a component into the DOM.

```js
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

## Target Configuration

Each target in the array can have the following configuration options:

### `selector` (required)
The CSS selector string used to find DOM elements.

```js
{
	selector: '#searchspring-content'
}
```

### `inject`
Configuration for injecting a new element relative to the target element. When using `inject`, the original element is preserved and a new element is created and positioned relative to it.

The `inject` object requires two properties:
- `action`: Specifies where to inject the element relative to the target
- `element`: The element to inject (can be an Element or a function that returns an Element)

#### Inject Actions

**`before`** - Insert the new element before the target element (as a sibling)
```js
{
	selector: '#content',
	inject: {
		action: 'before',
		element: document.createElement('div')
	}
}
```

**`after`** - Insert the new element after the target element (as a sibling)
```js
{
	selector: '#content',
	inject: {
		action: 'after',
		element: document.createElement('div')
	}
}
```

**`append`** - Append the new element as the last child of the target element
```js
{
	selector: '#content',
	inject: {
		action: 'append',
		element: document.createElement('div')
	}
}
```

**`prepend`** - Prepend the new element as the first child of the target element
```js
{
	selector: '#content',
	inject: {
		action: 'prepend',
		element: document.createElement('div')
	}
}
```

**`replace`** - Replace the target element with the new element
```js
{
	selector: '#content',
	inject: {
		action: 'replace',
		element: document.createElement('div')
	}
}
```

#### Dynamic Element Creation

The `element` property can also be a function that receives the target configuration and the original element, allowing for dynamic element creation:

```js
{
	selector: '#content',
	inject: {
		action: 'append',
		element: (target, originalElem) => {
			const div = document.createElement('div');
			div.className = 'injected-content';
			div.id = `injected-${originalElem.id}`;
			return div;
		}
	}
}
```

When using `inject`, the `onTarget` callback receives three parameters:
- `target`: The target configuration object
- `elem`: The newly injected element
- `originalElem`: The original element that was found by the selector

```js
new DomTargeter(
	[{
		selector: '#content',
		inject: {
			action: 'append',
			element: document.createElement('div')
		}
	}],
	(target, injectedElem, originalElem) => {
		// injectedElem is the new element
		// originalElem is the #content element
		render(<Component />, injectedElem);
	}
);
```

### `emptyTarget`
When `true`, removes all child nodes from the target element before executing the `onTarget` callback. This is enabled by default when not using `inject`, but has no effect when using `inject`.

Default: `true` (when not using inject)

```js
{
	selector: '#content',
	emptyTarget: true // Clear existing content
}
```

### `hideTarget`
When `true`, the target element will be hidden using CSS (`visibility: hidden !important`) until it is successfully targeted. This prevents content flashing during the targeting process.

Default: `false`

```js
{
	selector: '#content',
	hideTarget: true // Hide until content is injected
}
```

### `autoRetarget`
When `true`, DomTargeter will automatically retry finding the target element if it's not initially found. It uses an additive backoff strategy, starting at 100ms and increasing by 200ms each retry (100ms, 300ms, 500ms, 700ms, etc.), up to a maximum interval of 2000ms, for approximately 10 seconds total.

Default: `false`

```js
{
	selector: '#dynamic-content',
	autoRetarget: true // Keep looking for dynamically added elements
}
```

### `clickRetarget`
Enables retargeting when a click event occurs. This is useful for single-page applications or dynamic content that appears after user interaction.

- When set to `true`: Listens for clicks on the document
- When set to a selector string: Listens for clicks only on matching elements

Default: `false`

```js
// Listen for any click on the document
{
	selector: '#content',
	clickRetarget: true
}

// Listen for clicks on specific elements
{
	selector: '#content',
	clickRetarget: '.trigger-button'
}
```

### `unsetTargetMinHeight`
When `true`, removes any `min-height` CSS property from the target element after successful targeting. This is useful for removing placeholder styles.

Default: `true`

```js
{
	selector: '#content',
	unsetTargetMinHeight: true // Remove min-height after targeting
}

// To preserve min-height
{
	selector: '#content',
	unsetTargetMinHeight: false
}
```

### Custom Properties
The Target type supports arbitrary custom properties that can be accessed in the `onTarget` callback or inject element function. This is useful for passing component-specific data or configuration.

```js
{
	selector: '#content',
	component: <MyComponent />,
	customData: { theme: 'dark' },
	componentId: 'main-content'
}
```

These properties are available in the callback:

```js
(target, elem) => {
	render(target.component, elem);
	console.log(target.customData); // { theme: 'dark' }
	console.log(target.componentId); // 'main-content'
}
```

## Methods

### `retarget` method
If the targets are created after the DomTargeter and `DOMContentLoaded` event has fired, the `retarget` method can be used to manually search for and process all targets. It will execute the `onTarget` callback for any newly found elements.

```js
// manually retarget
contentTarget.retarget();
```

### `getTargets` method
Returns the array of targets specified during construction.

```js
const targets = contentTarget.getTargets();
```

## Complete Example

```js
import { DomTargeter } from '@searchspring/snap-toolbox';
import { render } from 'preact';

const targeter = new DomTargeter(
	[
		{
			selector: '#searchspring-content',
			component: <SearchResults />,
			hideTarget: true,
			autoRetarget: true,
			unsetTargetMinHeight: true
		},
		{
			selector: '#searchspring-sidebar',
			component: <Filters />,
			inject: {
				action: 'prepend',
				element: (target, originalElem) => {
					const wrapper = document.createElement('div');
					wrapper.className = 'ss-filters-wrapper';
					return wrapper;
				}
			},
			hideTarget: true,
			clickRetarget: '.apply-filters'
		}
	],
	(target, elem, originalElem) => {
		render(target.component, elem);
	}
);

// Later, manually retarget if needed
targeter.retarget();
```