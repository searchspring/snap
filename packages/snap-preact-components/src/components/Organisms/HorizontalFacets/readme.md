# HorizontalFacets

Renders all facets in a horizontal display. Incluses FilterSummary and MobileSidebar

## Sub-components
- Facet
- FilterSummary
- Dropdown
- MobileSidebar

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<HorizontalFacets controller={controller} />
```

### facets
The optional`facets` prop specifies a reference to the facets store array. If no facets prop is passed in, the component will default to using the facets in controller.store. 

```jsx
<HorizontalFacets facets={facets} />
```

### limit
The `limit` prop will limit the maximum number of facets to display before displaying the overflow button and MobidleSidebar.

```jsx
<HorizontalFacets controller={controller} limit={6}/>
```

### hideFiltersButton
The `hideFiltersButton` prop will hide the overflow button and MobileSidebar if facets are overflowing due to `limit` prop. 

```jsx
<HorizontalFacets controller={controller} hideFiltersButton={true} />
```

### alwaysShowFiltersButton
The `alwaysShowFiltersButton` prop will always render the button and MobileSidebar.

```jsx
<HorizontalFacets controller={controller} alwaysShowFiltersButton={true} />
```