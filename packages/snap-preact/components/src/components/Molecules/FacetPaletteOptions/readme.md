# Facet Palette Options

Renders a grid of facet palette options. 

## Sub-components
- Icon

## Usage

### values
The `values` prop specifies all facet values where the facet type is 'palette'. Overrides values passed via the facet prop. 

```jsx
<FacetPaletteOptions values={paletteFacet.values} />
```

### facet
The `facet` prop specifies the reference to the facet object in the store.

```jsx
<FacetPaletteOptions facet={paletteFacet} />
```

### hideLabel
The `hideLabel` prop will disable the facet label.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideLabel={true} />
```

### horizontal
The `horizontal` prop render facet options horizontally.

```jsx
<FacetPaletteOptions values={paletteFacet.values} horizontal={true} />
```

### columns
The `columns` prop is the number of columns the grid should contain. Not applicable if using `horizontal` prop'.

```jsx
<FacetPaletteOptions values={paletteFacet.values} columns={3} />
```

### gapSize
The `gapSize` prop is the gap size between rows and columns.

```jsx
<FacetPaletteOptions values={paletteFacet.values} gapSize={'10px'} />
```

### gridSize
The `gridSize` prop is the size of each palette item. Does not apply if using `columns` prop.

```jsx
<FacetPaletteOptions values={paletteFacet.values} gridSize={'45px'} columns={0} />
```

### hideIcon
The `hideIcon` prop will disable the facet icon from being rendered.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideIcon={true} />
```

### hideCount
The `hideCount` prop will disable the facet option counts from being rendered.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideCount={true} />
```

### hideCheckbox
The `hideCheckbox` prop will disable the facet option checkboxes from being rendered.

```jsx
<FacetPaletteOptions values={paletteFacet.values} hideCheckbox={true} />
```

### layout
The `layout` prop determines if the options should render as a `list` or `grid`. By default `grid` will be used.
```jsx
<FacetPaletteOptions values={paletteFacet.values} hideCheckbox={true} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value has been hovered over.

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


#### colorMapping
The colorMapping prop allows for custom color mapping overrides. The object used is keyed by a color label, and can take background and label properties. The color label can be any accepted CSS background property value. So a color, string, hash, RGB, gradiant, or an image URL could be used. The label takes a string value and replaces the color's original label for display.

```jsx
const colorMapping = {
	'Camo': {
		background: 'brown',
		label: 'Army'
	},
	'Striped': {
		background: "url(https://mysite.com/cdn/shop/files/candy-stripe-square_small.jpg)",
		label: "stripy"
	},
	'rainbow': {
		background: `linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		)`,
	}
}
<FacetPaletteOptions values={paletteFacet.values} colorMapping={colorMapping} />
```


