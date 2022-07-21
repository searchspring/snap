# Facet Palette Options

Renders a grid of facet palette options. 

## Sub-components
- Icon

## Usage

### values
The required `values` prop specifies all facet values where the facet type is 'palette'.

```jsx
<FacetPaletteOptions values={paletteFacet.values} />
```

### hideLabel
The `hideLabel` prop will disable the facet label.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideLabel={true} />
```

### columns
The `columns` prop is the number of columns the grid should contain.

```jsx
<FacetPaletteOptions values={paletteFacet.values} columns={3} />
```

### gapSize
The `gapSize` prop is the gap size between rows and columns.

```jsx
<FacetPaletteOptions values={paletteFacet.values} gapSize={'10px'} />
```

### hideIcon
The `hideIcon` prop will disable the facet icon from being rendered.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideIcon={true} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value is focused. 

```jsx
<Autocomplete>
	...
	<FacetPaletteOptions values={paletteFacet.values} previewOnFocus={true} />
	...
</Autocomplete>
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
<FacetPaletteOptions values={paletteFacet.values} valueProps={valueProps} />
```

### icon
The `icon` prop specifiesan object with `Icon` component props. 

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when a facet value is clicked.

```jsx
<FacetPaletteOptions values={paletteFacet.values} onClick={(e)=>{console.log(e)}} />
```
