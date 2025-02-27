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

### hidePaginationInfo
The `hidePaginationInfo` prop specifies if the PaginationInfo component should be rendered.  

```jsx
<Toolbar hidePaginationInfo={true} />
```

### hideTopSlot
The `hideTopSlot` prop specifies if the component in the top slot should be rendered. Requires `topSlot` prop to also be set.

```jsx
<Toolbar topSlot={<CustomComponent />} hideTopSlot={true} />
```

### hideBottomSlot
The `hideBottomSlot` prop specifies if the component in the bottom slot should be rendered. Requires `bottomSlot` prop to also be set.

```jsx
<Toolbar bottomSlot={<CustomComponent />} hideBottomSlot={true} />
```

### hideMobileSidebar
The `hideMobileSidebar` prop specifies if the MobileSidebar component should be rendered.  

```jsx
<Toolbar hideMobileSidebar={true} />
```

### topSlot
The `topSlot` prop specifies a component to be rendered in the top slot.

```jsx
const CustomComponent = (props) => {
    return (<button>click me!</button>)
}
<Toolbar topSlot={<CustomComponent />} />
```

### bottomSlot
The `bottomSlot` prop specifies a component to be rendered in the bottom slot.

```jsx
const CustomComponent = (props) => {
    return (<button>click me!</button>)
}
<Toolbar bottomSlot={<CustomComponent />} />
```

