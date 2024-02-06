# Facets

Renders all facets utilizing the `<Facet />` component.

## Sub-components
- Facet

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<Facets controller={controller} />
```

### facets
The optional`facets` prop specifies a reference to the facets store array. If no facets prop is passed in, the component will default to using the facets in controller.store. 

```jsx
<Facets controller={controller} facets={facets} />
```

### limit
The `limit` prop will limit the maximum number of facets to display.

```jsx
<Facets controller={controller} facets={facets} limit={3}/>
```