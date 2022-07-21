# Facet Hierarchy Options

Renders a list of hierarchy options.

## Usage

### values
The required `values` prop specifies all facet values where the facet type is 'hierarchy'.

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} />
```

### hideCount
The `hideCount` prop will disable the facet count values.

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} hideCount={true} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value is focused. 

```jsx
<Autocomplete>
    ...
	<FacetHierarchyOptions values={hierarchyFacet.values} previewOnFocus={true} />
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
<FacetHierarchyOptions values={hierarchyFacet.values} valueProps={valueProps} />
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when a facet value is clicked.

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} onClick={(e)=>{console.log(e)}} />
```
