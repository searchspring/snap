# LayoutSelector

Renders a layout selector to be used with snap templates for changing result layout settings. 

## Sub-components
- Select
- RadioList 
- List


## Usage

### options
The required `options` prop specifies an array of layoutOptions to render. When using Snap Templates, overrides can be provided in each option - these overrides will be applied when the option is selected.

```jsx
const layoutOptions = [
	{
		value: 1,
		label: 'Single Column',
		icon: 'square',
		overrides: {
			components: {
				'results': {
					columns: 1,
				},
			},
		},
	},
	{
		value: 2,
		label: 'Two Columns',
		default: true,
		icon: 'layout-large',
		overrides: {
			components: {
				'results': {
					columns: 2,
				},
			},
		},
	},
],

<LayoutSelector options={layoutOptions} />
```

### onSelect
The required `onSelect` sets the callback function for when a selection has been made. the function will be passed the click event and the selected option. 

```jsx

<LayoutSelector onSelect={(e, option) => callback()} options={layoutOptions} />

```

### type
The `type` prop specifies the type of selector to render. Options are `'radio'`, `'list'`, or `'dropdown'`. Defaults to `"dropdown"`.

```jsx
<LayoutSelector type={"list"} onSelect={(e, option) => callback()} options={layoutOptions} />
```

### selected
The `selected` prop specifies the intitially selected option. 

```jsx
<LayoutSelector onSelect={(e, option) => callback()} selected={layoutOptions[0]} options={layoutOptions} />
```

### label
The `label` prop specifies the label to render. Defaults to `"Layout"`.

```jsx
<LayoutSelector label={"Layout"} onSelect={(e, option) => callback()} options={layoutOptions} />
```

### hideLabel
The `hideLabel` prop hides the selector label.

```jsx
<LayoutSelector hideLabel={true} label={"Layout"} onSelect={(e, option) => callback()} options={layoutOptions} />
```

### hideOptionLabels
The `hideOptionLabels` prop hides the option labels.

```jsx
<LayoutSelector hideOptionLabels={true} onSelect={(e, option) => callback()} options={layoutOptions} />
```

### showSingleOption
The `showSingleOption` prop specifies if the component should render if the provided options prop contains a single option. 
```jsx
<LayoutSelector showSingleOption={true} onSelect={(e, option) => callback()} options={layoutOptions.slice(0, 1)} />
```
