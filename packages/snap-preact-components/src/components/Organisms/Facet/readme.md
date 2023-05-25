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
- SearchInput

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

### limit
The `limit` prop sets the number of options to display before the remaining options overflow and a show more/less button is displayed. 

```jsx
<Facet facet={controller.store.facets[0]} limit={10} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value has been hovered over. 

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

### showMoreText
The `showMoreText` prop contains the text to display in the facet overflow button when collapsed. Default is `'Show More'`

```jsx
<Facet facet={controller.store.facets[0]} showMoreText={'Show More'} />
```

### showLessText
The `showLessText` prop contains the text to display in the facet overflow button when expanded. Default is `'Show Less'`

```jsx
<Facet facet={controller.store.facets[0]} showLessText={'Show Less'} />
```

### iconOverflowMore
The `iconOverflowMore` prop contains the icon name of the facet overflow button when collapsed. Default is `'plus'`

```jsx
<Facet facet={controller.store.facets[0]} iconOverflowMore={'plus'} />
```

### iconOverflowLess
The `iconOverflowLess` prop contains the icon name of the facet overflow button when expanded. Default is `'minus'`

```jsx
<Facet facet={controller.store.facets[0]} iconOverflowLess={'minus'} />
```

### overflowSlot
The `overflowSlot` prop is a JSX element used to change the display of the show more/less toggle.

```typescript
const Overflow = (props) => {
	const facet = props.facet;
	return (
		<div>Show { facet.overflow.remaining > 0 ? `${facet.overflow.remaining} ` : ''}{facet.overflow.remaining > 0 ? 'more' : 'less'}...</div>
	)
}
```

```jsx
<Facet facet={controller.store.facets[0]} overflowSlot={<Overflow/>} />
```


### fields
The `fields` prop allows you to manually change prop values on a per-facet level, sorted by the facet field.

```typescript
const fieldsProp = {
	Color: {
		limit: 6,
	},
	Size: { 
		disableOverflow: true,
		disableCollapse: true,
	}
},
```

```jsx
<Facet facet={controller.store.facets[0]} fields={fieldsProp} />
```


### optionsSlot
The `optionsSlot` prop is a JSX element used to manually set the options component used, regardless of the facet.display type. Returns the facet,valueProps, limit, & previewOnFocus prop values.

```typescript
const CustomFacetOptions = (props) => {
	const facet = props.facet;
	return (
		<div>
			{facet && facet.values.map(value => <span>{value.label}</span>)}
		</div>
	)
}
```

```jsx
<Facet facet={controller.store.facets[0]} optionsSlot={<CustomFacetOptions/>} />
```


### iconColor
The `iconColor` prop sets the facet icon color.

```jsx
<Facet facet={controller.store.facets[0]} iconColor={'#222222'} />
```
