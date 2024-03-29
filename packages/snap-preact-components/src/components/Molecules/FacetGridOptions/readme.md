# Facet Grid Options

Renders a grid of facet options.

## Usage

### values
The `values` prop specifies all facet values where the facet type is 'grid'. Overrides values passed via the facet prop. 

```jsx
<FacetGridOptions values={sizeFacet.values} />
```

### facet
The `facet` prop specifies the reference to the facet object in the store.

```jsx
<FacetGridOptions facet={sizeFacet} />
```

### columns
The `columns` prop is the number of columns the grid should contain.

```jsx
<FacetGridOptions values={sizeFacet.values} columns={3} />
```

### gapSize
The `gapSize` prop is the gap size between rows and columns.

```jsx
<FacetGridOptions values={sizeFacet.values} gapSize={'10px'} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value has been hovered over. 

```jsx
<Autocomplete>
	...
	<FacetGridOptions values={sizeFacet.values} previewOnFocus={true} />
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
<FacetGridOptions values={sizeFacet.values} valueProps={valueProps} />
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when when a facet value is clicked.

```jsx
<FacetGridOptions values={sizeFacet.values} onClick={(e)=>{console.log(e)}} />
```
