## Facet
Renders a single facet, using `<Dropdownm />`. Automatically renders proper facet option component based on display of props.facet. Props available to disableCollapse of `<Dropdown/>`, customize or hide the `<Icon/>`, limit the options rendered. Built in Show More/Show Less functionality. 

## Components Used
- Dropdown
- FacetListOptions
- FacetGridOptions
- FacetPaletteOptions
- Slider
- Icon

## Usage
```jsx
<Facet facet={controller?.store?.facets[0]} />
```