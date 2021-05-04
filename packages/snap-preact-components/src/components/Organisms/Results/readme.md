## Results

Renders a page of results utilizing `<Result />` components
   
## Sub-components
- Result
- InlineBanner

## Usage

### results
The required `results` prop contains a reference to the results store array. 

```jsx
<Results results={controller.store.results} />
```

### layout
The `layout` prop specifies if this result will be rendered in a `grid` or `list` layout

```jsx
<Results results={controller.store.results} layout={'grid'} />
```

### responsive
An object that modifies the responsive behavior of the `<Result />` sub-components.

The responsive prop can be used to adjust the layout and how many products are shown at any screen size. There is no limit to how many responsive settings you can pass in. The viewport prop is the number representing the screen size the breakpoint should be used at and below.

For example, if you had `viewport: 500`, those specific responsive settings would be used from 500px wide and below.

`viewport` - required, viewport width when this rule is active

`numAcross` - required, number of columns to display at the given `viewport`

`numRows` - optional, number of rows to display at the given `viewport`

`layout` - optional, layout type `'grid'` or `'list'` at the given `viewport`


```typescript
const responsive = [
	{
		viewport: 350,
		numAcross: 1,
		numRows: 5,	
			
	},
	{
		viewport: 450,
		numAcross: 2,
		numRows: 3,	
		layout: "list",	
	},
	{
		viewport: 500,
		numAcross: 3,
		numRows: 2,	
	},
	{
		viewport: 600,
		numAcross: 5,
		numRows: 4,	
	},
	{
		viewport: 700,
		numAcross: 5,
	}
]
```

```jsx
<Results results={controller.store.results} responsive={responsive} />
```
