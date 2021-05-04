## Facet List Options

Renders a list of facet options.

## Sub-components
- Checkbox

## Usage

### values
The required `values` prop contains all facet values where the facet type is 'list'

```jsx
<FacetListOptions values={listFacet.values} />
```

### hideCheckbox
The `hideCheckbox` prop will disable the facet checkbox. Typically used if the facet can only have 1 value selected at a time.

```jsx
<FacetListOptions values={listFacet.values} hideCheckbox={true} />
```

### hideCount
The `hideCount` prop will disable the facet count values

```jsx
<FacetListOptions values={listFacet.values} hideCount={true} />
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
<FacetListOptions values={listFacet.values} valueProps={valueProps} />
```

### checkbox
The `checkbox` prop contains an object with `Checkbox` component props. See `Checkbox` component documentation for further details.


### Events

#### onClick
Callback function for when a facet value is clicked.

```jsx
<FacetListOptions values={listFacet.values} onClick={(e)=>{console.log(e)}} />
```
