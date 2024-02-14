# Toolbar

Renders a search results toolbar.

## Sub-components

- FilterSummary
- Pagination
- SortBy
- PerPage

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Toolbar controller={controller.store.results} />
```

### hideFilterSummary
The `hideFilterSummary` prop specifies if the FilterSummary component should be rendered.  

```jsx
<Toolbar hideFilterSummary={true} />
```

### hideLayoutSelector
The `hideLayoutSelector` prop specifies if the LayoutSelector component should be rendered.  

```jsx
<Toolbar hideLayoutSelector={true} />
```

### hidePerPage
The `hidePerPage` prop specifies if the PerPage component should be rendered.  

```jsx
<Toolbar hidePerPage={true} />
```

### hideSortBy
The `hideSortBy` prop specifies if the SortBy component should be rendered.  

```jsx
<Toolbar hideSortBy={true} />
```

### hidePagination
The `hidePagination` prop specifies if the Pagination component should be rendered.  

```jsx
<Toolbar hidePagination={true} />
```
