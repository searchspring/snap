# Facet List Options

Renders a list of facet options.

## Sub-components
- Checkbox

## Usage

### values
The `values` prop specifies all facet values where the facet type is 'list'. Overrides values passed via the facet prop. 

```jsx
<FacetListOptions values={listFacet.values} />
```

### facet
The `facet` prop specifies the reference to the facet object in the store.

```jsx
<FacetListOptions facet={listFacet} />
```

### hideCheckbox
The `hideCheckbox` prop will disable the facet checkbox. Typically used if the facet can only have a single value selected at a time.

```jsx
<FacetListOptions values={listFacet.values} hideCheckbox={true} />
```

### hideCount
The `hideCount` prop will disable the facet count values.

```jsx
<FacetListOptions values={listFacet.values} hideCount={true} />
```

### hideCountParenthesis
The `hideCountParenthesis` prop will disable the facet count parenthesis from rendering.

```jsx
<FacetListOptions values={listFacet.values} hideCountParenthesis={true} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value has been hovered over.

```jsx
<Autocomplete>
	...
	<FacetListOptions values={listFacet.values} previewOnFocus={true} />
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
<FacetListOptions values={listFacet.values} valueProps={valueProps} />
```

### checkbox
The `checkbox` prop specifies an object with `Checkbox` component props. See `Checkbox` component documentation for further details.


### Events

#### onClick
The `onClick` prop allows for a custom callback function for when a facet value is clicked.

```jsx
<FacetListOptions values={listFacet.values} onClick={(e)=>{console.log(e)}} />
```
