## Facet Grid Options

Renders a grid of facet options.

## Usage

### values
The required `values` prop contains all facet values where the facet type is 'grid'

```jsx
<FacetGridOptions values={sizeFacet.values} />
```

### columns
The `columns` prop is the number of columns the grid should contain

```jsx
<FacetGridOptions values={sizeFacet.values} columns={3} />
```

### gapSize
The `gapSize` prop is the gap size between rows and columns

```jsx
<FacetGridOptions values={sizeFacet.values} gapSize={'10px'} />
```

### previewOnFocus
If using within Autocomplete, the `previewOnFocus` prop will invoke the `value.preview()` method when the value is focused. 

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
Callback function for when a facet value is clicked.

```jsx
<FacetGridOptions values={sizeFacet.values} onClick={(e)=>{console.log(e)}} />
```
