# Sidebar

Renders a sidebar element containing a title, FilterSummary, SortBy, PerPage, and Facets components.


## Components Used
- FilterSummary
- Facets
- SortBy
- PerPage


## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Sidebar controller={controller} />
```

### hideTitle
The `hideTitle` prop will disable the sidebar title from rendering.

```jsx
<Sidebar controller={controller} hideTitle />
```

### titleText
The `titleText` prop will change the inner text of the sidebar title.

```jsx
<Sidebar controller={controller} titleText={'Filter By: '} />
```

### hideFacets
The `hideFacets` prop will disable the Facets component from rendering.

```jsx
<Sidebar controller={controller} hideFacets/>
```

### hidePerPage
The `hidePerPage` prop will disable the PerPage component from rendering.

```jsx
<Sidebar controller={controller} hidePerPage />
```

### hideSortBy
The `hideSortBy` prop will disable the SortBy component from rendering.

```jsx
<Sidebar controller={controller} hideSortBy />
```
### hideFilterSummary
The `hideFilterSummary` prop will disable the FilterSummary component from rendering.

```jsx
<Sidebar controller={controller} hideFilterSummary />
```
