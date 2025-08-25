# Toolbar

Renders a search results toolbar.

## Sub-components

- SearchHeader
- FilterSummary
- MobileSidebar
- LayoutSelector
- PerPage
- SortBy
- Pagination
- PaginationInfo
- Button
- Banner
- FacetsHorizontal;


## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Toolbar controller={controller.store.results} />
```

### layout
The `layout` prop is used to specify which child components render and where. The prop takes an array of specific module names, the order of these module names determines the order in which they will be rendered. Additionally you can pass arrays of modules to the array to specify new rows in the display.

The `_` module is used a seperator module to center,left,right justify the other elements in the layout.

available modules to use in the layout are 

`searchHeader`, `filterSummary`,  `breadcrumbs`, `mobileSidebar`, `layoutSelector`, `perPage`, `sortBy`, `pagination`, `paginationInfo`, `_`, `button.sidebar-toggle`, `banner.header`, `banner.banner`, `banner.footer`, `facetsHorizontal`;


```jsx
<Toolbar controller={controller.store.results} layout={['mobileSidebar', 'filterSummary', 'paginationInfo', 'sortBy', 'perPage', 'pagination']}/>
```

### toggleSideBarButton
The required `toggleSideBarButton` prop specifies an element to be used as the toggleSideBarButton. This element will render in the layout as `button.sidebar-toggle`. If it is not provided in the layout, the button will not render.

```jsx

const button = () => {
    return <div>Toggle Sidebar</div>
}
<Toolbar controller={controller.store.results} toggleSideBarButton={button} layout={[`button.sidebar-toggle`]}/>
```


