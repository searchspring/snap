# Facet

Renders a single complete facet. This includes determining the correct options type, a collapsable header, and overflow options. 

## Sub-components
- Dropdown
- FacetHierarchyOptions
- FacetGridOptions
- FacetListOptions
- FacetPaletteOptions
- Slider
- Icon

## Usage

### facet
The required `facet` prop specifies a reference to any single facet object within the facets store array. 

```jsx
<Facet facet={controller.store.facets[0]} />
```

### disableCollapse
The `disableCollapse` prop prevents the facet from toggling its collapse state. 

```jsx
<Facet facet={controller.store.facets[0]} disableCollapse={true} />
```

### color
The `color` prop sets the facet name and icon color.

```jsx
<Facet facet={controller.store.facets[0]} color={'#222222'} />
```

### optionsLimit
The `optionsLimit` prop sets the number of options to display before the remaining options overflow and a show more/less button is displayed. 

```jsx
<Facet facet={controller.store.facets[0]} optionsLimit={10} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value is focused. 

```jsx
<Facet facet={controller.store.facets[0]} previewOnFocus={true} />
```

### valueProps
The `valueProps` prop will be spread onto each value's `<a>` element. Typical usage would be to provide custom callback functions when used within Autocomplete.

```typescript
const valueProps = {
	onMouseEnter: (e) => {
		clearTimeout(delayTimeout);
		delayTimeout = setTimeout(() => {
			e.target.focus();
		}, delayTime);
	},
	onMouseLeave: () => {
		clearTimeout(delayTimeout);
	},
}
```

```jsx
<Facet facet={controller.store.facets[0]} valueProps={valueProps} />
```

### hideIcon
The `hideIcon` prop prevents the facet collapse icon from rendering.

```jsx
<Facet facet={controller.store.facets[0]} hideIcon={true} />
```

### iconExpand
The `iconExpand` prop is the name of the icon to render when the facet is in its collapsed state.

```jsx
<Facet facet={controller.store.facets[0]} iconExpand={'angle-down'} />
```

### iconCollapse
The `iconCollapse` prop is the name of the icon to render when the facet is in its open state.

```jsx
<Facet facet={controller.store.facets[0]} iconCollapse={'angle-up'} />
```

### iconColor
The `iconColor` prop sets the facet icon color.

```jsx
<Facet facet={controller.store.facets[0]} iconColor={'#222222'} />
```
