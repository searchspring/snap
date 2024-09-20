# RecommendationGrid

Renders a List of results utilizing `<Result />` components.

## Sub-components
- Result

## Usage

### controller
The `controller` prop specifies a reference to the recommendation controller.

```jsx
<RecommendationGrid controller={controller.store.results} />
```

### results
The `results` prop specifies a reference to the results store array. If no results prop is passed in, the component will default to using the results in controller.store. 

```jsx
<RecommendationGrid results={controller.store.results} />
```

### title
The `title` prop specifies the title text to render.

```jsx
<RecommendationGrid results={controller.store.results} title={'Recommended For You'} />
```

### columns
The `columns` prop specifies the number of columns to display. 

```jsx
<RecommendationGrid results={controller.store.results} columns={4} />
```

### rows
The `rows` prop specifies the number of rows to display.

```jsx
<RecommendationGrid results={controller.store.results} rows={2} />
```

### trim
The `trim` prop specifies whether we should trim off excess results in order to have equal rows and columns.

```jsx
<RecommendationGrid results={controller.store.results} rows={3} trim={true} />
```

### gapSize
The `gapSize` prop specifies the gap size between each result.

```jsx
<RecommendationGrid results={controller.store.results} gapSize={'10px'} />
```


### lazyRender 
The `lazyRender` prop specifies an object of lazy rendering settings. The settings include an `enable` toggle (defaults to `true`) as well as an `offset` (default `"10%"`) to specify at what distance the component should start rendering relative to the bottom of the viewport.

```jsx
const customLazyRenderProps = {
	enabled: true,
	offset: "20px" // any css margin values accepted - px, %, etc...
}

<RecommendationGrid results={controller.store.results} lazyRender={ customLazyRenderProps } />
```

### breakpoints
An object that modifies the responsive behavior of the `<Result />` component.

Each entry within the breakpoints object contains a numeric key of the viewport when the sub-object of props will take effect. Any props listed above can be specified. (ie. columns, rows, layout, gapSize)

Typically used to adjust the layout and how many products are shown at any screen size. There is no limit to how many breakpoints settings you can pass in.


Default Results `breakpoints` object:

```typescript
const breakpoints = {
	0: {
		columns: 1,
	},
	540: {
		columns: 2,
	},
	768: {
		columns: 3,
	},
	991: {
		columns: 4,
	},
};
```

```jsx
<RecommendationGrid results={controller.store.results} breakpoints={breakpoints} />
```

### ResultComponent
The `ResultCompnent` prop specifies a custom result component to render.

```jsx

const CustomResult = ({
	controller 
	result
	theme
}) => {
	return <div>{result.mappings.core?.name}</div>
}

<RecommendationGrid results={controller.store.results} resultComponent={CustomResult} />
```