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

### layout 
The `layout` prop is used to specify which child components render and where. The prop takes an array of specific module names, the order of these module names determines the order in which they will be rendered. Additionally you can pass arrays of modules to the array to specify new rows in the display.

The `_` module is used a seperator module to center|left|right justify the other elements in the layout.

available modules to use in the layout are 

`filterSummary`, `sortBy`, `perPage`, `facets`, `banner.left`, `paginationInfo`, `layoutSelector`, `_`;

```jsx
<Sidebar controller={controller} layout={['filterSummary', 'sortBy', 'perPage', 'facets', 'banner.left']}/>
```

### hideTitleText
The `hideTitleText` prop will disable the sidebar title from rendering.

```jsx
<Sidebar controller={controller} hideTitleText />
```

### titleText
The `titleText` prop will change the inner text of the sidebar title.

```jsx
<Sidebar controller={controller} titleText={'Filter By: '} />
```

### sticky
The `sticky` prop enables the sidebar to remain fixed at the top of the viewport as the user scrolls the page.

```jsx
<Sidebar controller={controller} sticky={'true'} />
```


### stickyOffset
The `stickyOffset` prop sets the number of pixels from the top of the viewport that the sticky sidebar should be offset. This is useful if you have a fixed header or other elements at the top of the page and want the sidebar to remain visible below them when scrolling.

```jsx
<Sidebar controller={controller} stickyOffset={50} />
```