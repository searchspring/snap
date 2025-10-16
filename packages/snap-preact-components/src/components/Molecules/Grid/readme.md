# Grid

Renders an Grid of options

## Components Used
- image

## Usage
```jsx
import { Grid } from '@searchspring/snap-preact-components';
```

### options
The required `options` prop specifies an array of options to render.

```jsx
const options: SwatchOption = [
		{
			value: 'one',
			disabled: true,
		},
		{
			value: 'two',
		},
		{
			value: 'three',
		},
	],

<Grid options={options} />
```

### gapSize
The optional `gapsize` props specifies the gap size between rows and columns.

```jsx
<Grid options={options} gapsize={'15px'} />
```

### columns
The optional `columns` prop specifies the number of columns to show in the grid. (defaults to 4)

```jsx
<Grid options={options} columns={3} />
```

### rows
The optional `rows` prop specifies the number of rows to show in the grid. Should be noted that if more `options` are passed than are allowed via `columns` and `rows` props, then the component will hide the overflow options behind a `+ 4 more` overflow button. 

```jsx
<Grid options={options} rows={2} />
```

### disableOverflowAction
The optional `disableOverflowAction` prop will disable the overflow action from the overflow button (`+ 4 more`s). This is to be used when you want the overflow button to show render but you do not want the grid to expand and show all options onclick of the overflow button. 

```jsx
<Grid options={options} rows={2} disableOverflowAction={true}/>
```

### overflowButton
The optional `overflowButton` prop accepts a custom JSX element to render instead of the default overflow button. The custom component will be passed the current expanded state of the grid, as well as the number of options hidden 

```jsx

const overflowButton = (expanded, remainder) => {
    return (
       expanded ? (
            <span>
                show {remainder} more
            </span>
        ) : (
            <span>
                Show Less
            </span>
        )
    )
}

<Grid options={options} rows={2} overflowButton={overflowButton}/>
```

### overflowButtonInGrid
The optional `overflowButtonInGrid` prop specifies if the overflow button should be rendered in the grid or below. 

```jsx
<Grid options={options} overflowButtonInGrid={true} />
```

### onOverflowButtonClick
The optional `onOverflowButtonClick` prop specifies to custom function to call onClick of the overflow button. 

```jsx
const onOverflowButtonClick = (expandedState: boolean, remainder: number) => {
    console.log(expandedState, remainder);
}

<Grid options={options} onOverflowButtonClick={onOverflowButtonClick} />
```

### hideLabels
The optional `hideLabels` prop specifies if option labels should be hidden. 

```jsx
<Grid options={options} hideLabels={true} />
```

### hideShowLess
The optional `hideShowLess` prop specifies if show less button should be hidden. 

```jsx
<Grid options={options} hideShowLess={true} />
```

### multiselect
The optional `multiselect` prop specifies if more than a single option can be selected at once. 

```jsx
<Grid options={options} multiselect={true} />
```

### onSelect
The optional `onSelect` prop specifies callback function to be called on option click. 

```jsx
const onSelectFunc = (event, clickedOption, currenctlySelectedOptionArray) => {
    console.log(event, clickedOption, currenctlySelectedOptionArray)
}

<Grid options={options} onSelect={onSelectFunc} />
```

### titleText
The optional `titleText` prop specifies the text to be rendered in the grid title. 

```jsx
<Grid options={options} titleText={"Grid Title"} />
```

### selected
The optional `selected` prop specifies the selected option(s) if the selected state is handled outside of the component. 

```jsx

const selectedOption: SwatchOption = [
    {
        value: 'two',
    },
]

<Grid options={options} selected={selectedOption} />
```


