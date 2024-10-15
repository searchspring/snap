# Filter Summary

Renders all selected filters including a wrapper with a title and a 'clear all' button. 

## Components Used
- Filter
## Usage


### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<FilterSummary controller={controller} />
```

### filters
The `filters` prop specifies a reference to the filters store array. If no filters prop is passed in, the component will default to using the filters in controller.store. 

```jsx
<FilterSummary filters={controller.store.filters} />
```

### title
The `title` prop specifies the title of the filter summary wrapper. The default is `'Current Filters'`.

```jsx
<FilterSummary filters={controller.store.filters} title={'Current Filters'} />
```

### hideTitle
The `hideTitle` prop will hide the title element.

```jsx
<FilterSummary filters={controller.store.filters} title={'Current Filters'} hideTitle={true}/>
```
### filterIcon
The `filterIcon` prop is the name of the icon to render for each filter. 

```jsx
<FilterSummary filters={controller.store.filters} filterIcon={'close-thin'} />
```

### clearAllIcon
The `clearAllIcon` prop is the name of the icon to render for the 'clear all' button. 

```jsx
<FilterSummary filters={controller.store.filters} clearAllIcon={'close-thin'} />
```

### separator
The `separator` prop will specify the separator character between `facetLabel` and `valueLabel` of the `<Filter />` sub-component.

```jsx
<FilterSummary filters={controller.store.filters} separator={': '} />
```

### hideFacetLabel
The `hideFacetLabel` prop prevents the filter label (selected facet name) from displaying. Only the value selected will be displayed. Use of this prop will nullify the `separator` prop.

```jsx
<FilterSummary filters={controller.store.filters} hideFacetLabel={true} />
```

### clearAllLabel
The `clearAllLabel` prop is the 'clear all' button text. This is passed to the `<Filter />` sub-component `valueLabel` prop. The default value is `'Clear All'`.

```jsx
<FilterSummary filters={controller.store.filters} clearAllLabel={'Clear All'} />
```

### hideClearAll
The `hideClearAll` prop prevents the 'clear all' button from rendering.

```jsx
<FilterSummary filters={controller.store.filters} hideClearAll={true} />
```

### Events

#### onClick
The `onClick` prop allows for a custom callback function for when any of the selected filters are clicked.

```jsx
<FilterSummary filters={controller.store.filters} onClick={(e, filter) => {console.log(e, filter)}} />
```

#### onClearAllClick
The `onClearAllClick` prop allows for a custom callback function for when the 'clear all' button is clicked.

```jsx
<FilterSummary filters={controller.store.filters} onClearAllClick={(e) => {console.log(e)}} />
```
