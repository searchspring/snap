## Filter

Renders a facet filter.

## Sub Components
- Icon
- Button

## Usage

### facetLabel
The `facetLabel` prop contains the filter label. Typically set to the facet name.

```jsx
<Filter facetLabel={'Brand'} />
```

### valueLabel
The `valueLabel` prop contains the filter value. Typically set to the facet value.

```jsx
<Filter valueLabel={'Nike'} />
```

### url
The `url` prop contains a link to clear the filter selection.

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} url={filter.url} />
```

### hideFacetLabel
The `hideFacetLabel` prop will disable the filter facet label.

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} hideFacetLabel={true} />
```
### separator
The `separator` prop will specify the separator character between `facetLabel` and `valueLabel`

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} separator={': '} />
```

### icon
The `icon` prop contains an object with `Icon` component props. 

### Events

#### onClick
Callback function when facet filter is clicked.

```jsx
<Filter onClick={(e)=>{console.log(e)}}/>
```
