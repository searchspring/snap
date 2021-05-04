## Results

Renders a page of results utilizing `<Result />` components

## Additional Info
The responsive prop can be used to adjust the layout and how many products are shown at any screensize. There is no limit to how many responsive settings you can pass in. The viewport prop is a number representing the screen size the breakpoint should be used at and below.  
For example, if you had a viewport: 500, those specific resposive settings would be used from 500px wide and below.

The types are as follows
- responsive?: ResponsiveProps[];  
    ResponsiveProps: 
    - viewport: number;
    - numAcross: number;
    - numRows?: number;
    - layout?: "grid" | "list";
    

## Sub Components
- Result
- InlineBanner

## Usage

### results
The required `results` prop contains a reference to the results store array. 

```jsx
<Results results={controller.store.results} />
```

### layout
The `layout` prop specifies the if this result will be rendered in a `grid` or `list` layout

```jsx
<Results results={controller.store.results} layout={'grid'} />
```

### responsive
An object that modifies the responsive behaviour of the `<Result />` sub components.

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
