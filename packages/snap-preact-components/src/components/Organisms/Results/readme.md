# Results

Renders a page of results utilizing `<Result />` components.

## Sub-components
- Result

- InlineBanner

## Usage

### results
The required `results` prop specifies a reference to the results store array. 

```jsx
<Results results={controller.store.results} />
```

### layout
The `layout` prop specifies if this result will be rendered in a `grid` or `list` layout.

```jsx
<Results results={controller.store.results} layout={'grid'} />
```

### columns
The `columns` prop specifies the number of columns to display in a grid layout.

```jsx
<Results results={controller.store.results} columns={4} />
```

### rows
The `rows` prop specifies the number of rows to display in a grid layout.

```jsx
<Results results={controller.store.results} rows={2} />
```

### gapSize
The `gapSize` prop specifies the gap size between each result within a grid layout.

```jsx
<Results results={controller.store.results} gapSize={'10px'} />
```

### responsive
An object that modifies the responsive behavior of the `<Result />` component.

Each entry within the responsive object contains a numeric key of the viewport when the sub-object of props will take effect. Any props listed above can be specified. (ie. columns, rows, layout, gapSize)

Typically used to adjust the layout and how many products are shown at any screen size. There is no limit to how many responsive settings you can pass in.


Default Results `responsive` object:

```typescript
const responsive = {
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
<Results results={controller.store.results} responsive={responsive} />
```
