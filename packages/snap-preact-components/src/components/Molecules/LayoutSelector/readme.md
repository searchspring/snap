# LayoutSelector

Renders a layout selector to be used with snap templates for changing result layout settings. 

## Sub-components
- Select
- RadioList 
- List


## Usage

### options
The required `options` prop specifies an array of layoutOptions to render.

```jsx

const layoutOptions:layoutOption[] = [
	{
		label: "1 wide",
		value: {
			icon: "square",
			columns:1,
		}
	},
	{
		label: "2 wide",
		value: {
			icon: {
				icon: "layout-large",
			},
			columns:2,
		}
	},
	{
		label: "3 wide",
		value: {
			icon: {
				icon: 'layout-grid',
			},
			columns:3,
		}
	},
	{
		label: "4 wide",
		value: {
			columns:4,
		}
	},
	{
		label: "custom",
		value: {
			component: (props) => <div className="custom">custom</div>,
		}
	}	
]

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


