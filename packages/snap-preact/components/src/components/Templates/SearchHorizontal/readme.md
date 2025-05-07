# SearchHorizontal Template

Renders a Search Results Page.

## Sub-components

- FacetsHorizontal
- Results
- NoResults
- Toolbar

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<SearchHorizontal controller={controller} />
```

### resultComponent
The `resultComponent` prop specifies a custom result component to render.

```jsx

const CustomResult = ({
	controller 
	result
	theme
}) => {
	return <div>{result.mappings.core?.name}</div>
}

<SearchHorizontal controller={controller} resultComponent={CustomResult} />
```

### hideTopToolBar
The `hideTopToolBar` prop specifies if the top ToolBar component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideTopToolBar={true} />
```

### hideMiddleToolBar
The `hideMiddleToolBar` prop specifies if the middle ToolBar component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideMiddleToolBar={true} />
```

### hideBottomToolBar
The `hideBottomToolBar` prop specifies if the bottom ToolBar component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideBottomToolBar={true} />
```


### hideFacetsHorizontal
The `hideFacetsHorizontal` prop specifies if the FacetsHorizontal component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideFacetsHorizontal={true} />
```

