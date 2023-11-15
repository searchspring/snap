# Facet Toggle

Renders a facet option toggle switch. Note this component will only render when used with a single facet value.

## Sub-components
- toggle

## Usage

### values
The `values` prop specifies facet values to use. Overrides values passed via the facet prop. Note this component will only render when used with a single facet value.

```jsx
<FacetToggle values={facet.values} />
```

## facet
The `facet` prop specifies the reference to the facet object in the store. Note this component will only render when used with a single facet value.

```jsx
<FacetToggle facet={sizeFacet} />
```

### label
The `label` prop specifies the label to render. 

```jsx
<FacetToggle value={facet.values[0]} label={facet.values[0].label} />
```

### onClick
The `onClick` prop allows for a custom callback function for when the toggle is clicked.

```jsx
<FacetToggle value={facet.values[0]} onClick={(e)=>{console.log(e)}} />
```
