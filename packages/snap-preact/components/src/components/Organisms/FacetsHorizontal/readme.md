# FacetsHorizontal

Renders all facets in a horizontal display. Also incluses MobileSidebar.

## Sub-components
- Facet
- Dropdown
- MobileSidebar

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<FacetsHorizontal controller={controller} />
```

### facets
The optional`facets` prop specifies a reference to the facets store array. If no facets prop is passed in, the component will default to using the facets in controller.store. 

```jsx
<FacetsHorizontal facets={facets} />
```

### iconExpand
The `iconExpand` prop is the name of the icon to render when the facet is in its collapsed state.

```jsx
<FacetsHorizontal facets={facets} iconExpand={'angle-down'} />
```

### iconCollapse
The `iconCollapse` prop is the name of the icon to render when the facet is in its open state.

```jsx
<FacetsHorizontal facets={facets} iconCollapse={'angle-up'} />
```

### limit
The `limit` prop will limit the maximum number of facets to display before displaying the overflow button and MobidleSidebar.

```jsx
<FacetsHorizontal controller={controller} limit={6}/>
```

### alwaysShowFiltersButton
The `alwaysShowFiltersButton` prop will always render the button and MobileSidebar, not just when facets are overflowing.

```jsx
<FacetsHorizontal controller={controller} alwaysShowFiltersButton={true} />
```

### hideFiltersButton
The `hideFiltersButton` specifies wether the filters button should be rendered or not. If true, the button will render when there are more filters to show than the limit prop allows (unless the alwaysShowFiltersButton prop is passed, which will ignore the limit). 

```jsx
<FacetsHorizontal controller={controller} hideFiltersButton={true}/>
```


### onFacetOptionClick
The `onFacetOptionClick` callback function for when a facet option is clicked. 

```jsx
<FacetsHorizontal controller={controller} onFacetOptionClick={clickfunc}/>
```

### overlay
The `overlay` prop will render the facet options in a dropdown overlay.

```jsx
<FacetsHorizontal controller={controller} overlay={true}/>
```
