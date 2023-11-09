# Facet Toggle

Renders a facet option toggle switch

## Sub-components
- toggle

## Usage

### value
The required `value` prop specifies a single facet value to use.

```jsx
<FacetToggle value={facet.values[0]} />
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
