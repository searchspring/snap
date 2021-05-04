## Facet Hierarchy Options

Renders a list of hierarchy options.

## Usage

### values
The required `values` prop contains all facet values where the facet type is 'hierarchy'

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} />
```

### hideCount
The `hideCount` prop will disable the facet count values

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} hideCount={true} />
```


### Events

#### onClick
Callback function for when a facet value is clicked.

```jsx
<FacetHierarchyOptions values={hierarchyFacet.values} onClick={(e)=>{console.log(e)}} />
```
