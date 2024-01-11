Snap components allows for theming at both the global and component level.

### Theme object
A theme object contains a `components` object with one or more objects where the key is the name of the component (lowercase), and the value is an object containing prop keys and values.

For example, this `globalTheme` theme object will apply the prop `color={'blue'}` for all `<Button />` components and `hideCount={false}` for all `<facetListOptions />` components.

```typescript
const globalTheme = {
	components: {
		button: {
			color: 'blue',
		},
		facetListOptions: {
			hideCount: false,
		},
	},
};
```

If a component contains multiple sub-components (ie. Molecule or Organisms), it is also possible to provide sub-component props as follows:

```typescript
const globalTheme = {
	components: {
		facetListOptions: {
			hideCount: false,
			theme: {
				components: {
					checkbox: {
						native: true
					}
				}
			}
		}
	}
};
```

The theme object also contains colors used throughout components:

```typescript
const globalTheme = {
	variables: {
		color: {
			primary: '#3A23AD',
			secondary: '#00cee1',
			accent: '#4c3ce2',
			active: {
				foreground: '#333333',
				background: '#f8f6fd',
				accent: '#3A23AD',
			},
			hover: {
				foreground: '#333333',
				background: '#f8f6fd',
				accent: '#3A23AD',
			},
		},
	},
	components: {}
}
```

### ThemeProvider
Using a ThemeProvider applies a global theme to all its children components

```typescript
import { ThemeProvider, Button } from '@searchspring/snap-preact-components'
```

```jsx
<ThemeProvider theme={globalTheme}>
	<Button content={'click me!'} />
</ThemeProvider>
```

### Component Theme
The `theme` prop is available on all components and allows for theming of a single component. 

The component `theme` is merged with the global theme, therefore component theme props will overwrite any common props on the global theme object.

In the following example, the `<Button />` component will contain `color={'green'}` from `propTheme` and `native={true}` from `globalTheme`

```typescript
const globalTheme = {
	components: {
		button: {
			color: 'blue',
			native: true
		},
	},
};
const propTheme = {
	components: {
		button: {
			color: 'green',
		},
	},
};
```

```jsx

<ThemeProvider theme={globalTheme}>
    <Button content={'click me!'} theme={propTheme} />
</ThemeProvider>
```


### Component Style
The `style` prop is available on all components and allows for styling of components at the global (via the `theme` prop) or the component level (via the `style` prop)

Styles are applied to the root element of the component and uses CSS object syntax.

Standard CSS:
```css
{
	background-color: red;
	color: #cccccc;
}
```

In CSS object syntax, properties are camel case and `'-'` are removed:
```typescript
{ 
	backgroundColor: '#ffff00',
	color: '#cccccc',
}
```

<!-- TODO: once classnames are standardized, document how to target sub elements -->

Global level styling via `theme` prop:

```typescript
const globalTheme = {
	components: {
		button: {
			style: {
				backgroundColor: '#ffff00',
				color: '#cccccc'
			}
		},
	},
};
```

```jsx
<ThemeProvider theme={globalTheme}>
    <Button content={'click me!'} />
</ThemeProvider>
```

Component level styling via `style` prop:

```typescript
const buttonStyles = {
	backgroundColor: '#ffff00',
	color: '#cccccc'
};
```

```jsx
<Button content={'click me!'} style={buttonStyles} />
```

### Disable Component Styles
The `disableStyles` prop is available on all components and allows for disabling all styles of the component, including any styles being applied at the global or component level. 

This can be done at the global level:

```typescript
const globalTheme = {
	components: {
		button: {
			disableStyles: true,
	},
};
```

```jsx
<ThemeProvider theme={globalTheme}>
    <Button content={'click me!'} />
</ThemeProvider>
```

Or at the component level:

```jsx
<Button content={'click me!'} disableStyles={true} />
```


### Component Class Names
The `className` prop is available on all components and allows for adding a class to the root level class list of a component. 

By default, all components will contain a class name of `ss-${componentname}`, for example `'ss-button'`

This can be done at the global level:

```typescript
const globalTheme = {
	components: {
		button: {
			className: 'my-btn-class',
	},
};
```

```jsx
<ThemeProvider theme={globalTheme}>
    <Button content={'click me!'} />
</ThemeProvider>
```

Or at the component level:

```jsx
<Button content={'click me!'} className={'my-btn-class'} />
```
