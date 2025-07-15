# Search Template

Renders a Search Results Page.

## Sub-components

- Results
- NoResults
- Sidebar
- Toolbar

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Search controller={controller} />
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

<Search controller={controller} resultComponent={CustomResult} />
```

### mobileDisplayAt
The `mobileDisplayAt` prop specifies a CSS media query for when the MobileSidebar component will render. By default, the component will render at "991px".

```jsx
<Search controller={controller} mobileDisplayAt={'400px'} />
```

### hideSidebar
The `hideSidebar` prop specifies if the Sidebar component should be rendered.  

```jsx
<Search controller={controller} hideSidebar={true} />
```

### hideTopToolbar
The `hideTopToolbar` prop specifies if the top ToolBar component should be rendered.  

```jsx
<Search controller={controller} hideTopToolbar={true} />
```

### hideMiddleToolbar
The `hideMiddleToolbar` prop specifies if the middle ToolBar component should be rendered.  

```jsx
<Search controller={controller} hideMiddleToolbar={true} />
```

### hideBottomToolbar
The `hideBottomToolbar` prop specifies if the bottom ToolBar component should be rendered.  

```jsx
<Search controller={controller} hideBottomToolbar={true} />
```

### toggleSidebarButtonText
The `toggleSidebarButtonText` prop specifies the inner text of the Sidebar toggle button. If left undefined, no button will render. 

```jsx
<Search controller={controller} toggleSidebarButtonText={'Toggle Facets'} />
```

### toggleSidebarStartClosed
The `toggleSidebarStartClosed` prop specifies if the sidebar toggle should start closed.

```jsx
<Search controller={controller} toggleSidebarStartClosed={true} />
```

### hideToggleSidebarButton
The `hideToggleSidebarButton` prop hides the Sidebar toggle button.

```jsx
<Search controller={controller} toggleSidebarButtonText={'Toggle Facets'} hideToggleSidebarButton={true} />
```

### layoutOptions
The `layoutOptions` prop allows you to customize the layout of the Search component by specifying an array of layout option objects. These options can be used to control which layouts are available to the user (such as grid or list view), set a default layout, and provide custom icons or labels for each layout option. 




```jsx

type ListOption = {
    value: string | number;
    label?: string;
    disabled?: boolean;
    default?: boolean;
    icon?: IconType | Partial<IconProps>;
    overrides?: ThemeMinimal;
    url?: UrlManager;
    available?: boolean;
}

const layoutOptions: ListOption[] = [
	{
		value: 1,
		label: 'Single Column',
		icon: 'square',
		overrides: {
			components: {
				'search results': {
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
				'search results': {
					columns: 2,
				},
			},
		},
	},
]

<Search controller={controller} layoutOptions={layoutOptions} />
```