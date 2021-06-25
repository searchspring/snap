# Recommendation

Renders a basic recommendation component.

## Sub-components
- Result

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

### responsive
An object that modifies the responsive behavior of the `<Result />` sub-components.

The responsive prop can be used to adjust the layout and how many products are shown at any screen size. There is no limit to how many responsive settings you can pass in. The viewport prop is the number representing the screen size the breakpoint should be used at and below.

For example, if you had `viewport: 480`, those specific responsive settings would be used from 480px wide and below.

`viewport` - required, viewport width when this rule is active

`numAcross` - required, number of columns to display at the given `viewport`

`numRows` - optional, number of rows to display at the given `viewport`

`layout` - optional, layout type `'grid'` or `'list'` at the given `viewport`

```typescript
const defaultResponsiveOptions = [
	{
		viewport: 480,
		numAcross: 1,
		layout: 'list',
	},
	{
		viewport: 768,
		numAcross: 2,
	},
	{
		viewport: 1024,
		numAcross: 3,
	},
	{
		viewport: 1200,
		numAcross: 4,
	},
]
```

```typescript
const responsive = [
	{
		viewport: 768,
		numAcross: 1,
		layout: 'list',
	},
	{
		viewport: 1024,
		numAcross: 3,
	},
]
```

```jsx
<Recommendation results={controller.store.results} responsive={responsive} />
```
