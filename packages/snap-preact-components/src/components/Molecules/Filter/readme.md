# Filter

Renders a facet filter.

## Sub-components
- Icon
- Button

## Usage
```jsx
import { Filter } from '@searchspring/snap-preact-components';
```

### facetLabel
The `facetLabel` prop specifies the filter label. Typically set to the facet label.

```jsx
<Filter facetLabel={'Brand'} />
```

### valueLabel
The `valueLabel` prop specifies the filter value. Typically set to the facet value label.

```jsx
<Filter valueLabel={'Nike'} />
```

### url
The `url` prop specifies a link to clear the filter selection.

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} url={filter.url} />
```

### hideFacetLabel
The `hideFacetLabel` prop will disable the filter facet label.

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} hideFacetLabel={true} />
```
### separator
The `separator` prop will specify the separator character between `facetLabel` and `valueLabel`.

```jsx
<Filter facetLabel={filter.facet.label} valueLabel={filter.value.label} separator={': '} />
```

### icon
The `icon` prop specifies a path within the `Icon` component paths (see Icon Gallery).

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when a filter is clicked.

```jsx
<Filter onClick={(e)=>{console.log(e)}}/>
```
