## Results
Renders a group of results, in grid or list layout. with responsive props. Inline merchandising banner support built in. 

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
    

## Components Used
- Result
- inlineBanner

## Usage

Default
```jsx
<Results results={controller?.store?.results} />
```

List Layout
```jsx
<Results layout='list' results={controller?.store?.results} />
```

Grid Layout
```jsx
<Results layout='grid' results={controller?.store?.results} />
```

Custom Responsive Settings 
```jsx
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
<Results layout='list' results={controller?.store?.results} responsive={responsive} />
```