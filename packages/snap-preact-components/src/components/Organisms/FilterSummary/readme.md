## Filter Summary
Renders a list of selected filter, A title, and a clear all button. Lots of props to make this very customizable. 


## Components Used
- Filter

## Usage

Default
```jsx
<FilterSummary  filters={controller?.store?.filters} />
```

Custom title
```jsx
<FilterSummary title='Selected Filters' filters={controller?.store?.filters} />
```

No facet label
```jsx
<FilterSummary hideFacetLabel={true} filters={controller?.store?.filters} />
```