# SearchHorizontal Template

Renders a Search Results Page.

## Sub-components

- FacetsHorizontal
- LayoutSelector
- Results
- NoResults
- Toolbar
- SearchHeader
- Banner

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<SearchHorizontal controller={controller} />
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

<SearchHorizontal controller={controller} resultComponent={CustomResult} />
```

### hideSearchHeader
The `hideSearchHeader` prop specifies if the SearchHeader component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideSearchHeader={true} />
```

### hidetopToolBar
The `hidetopToolBar` prop specifies if the top ToolBar component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hidetopToolBar={true} />
```

### hideBottomToolBar
The `hideBottomToolBar` prop specifies if the bottom ToolBar component should be rendered.  

```jsx
<SearchHorizontal controller={controller} hideBottomToolBar={true} />
```


### hideMerchandisingBanners
The `hideMerchandisingBanners` prop specifies if merchandising banners should render. This can take a boolean to hide all banners, or an array of specific banner types you wish to hide. 

```jsx
<SearchHorizontal controller={controller} hideMerchandisingBanners={true} />
```
or

```jsx
<SearchHorizontal controller={controller} hideMerchandisingBanners={["Footer", "Header", "Banner", "left"]} />
```

### hideLayoutSelector
The `hideLayoutSelector` prop specifies if the layoutSelector component should be rendered. 

```jsx
<SearchHorizontal controller={controller} hideLayoutSelector={true} />
```

### layoutConfig
The `layoutConfig` prop specifies the configuration for the layoutSelector.  

```jsx
const layoutConfig = {
    default: {
        label: "5 wide",
        value: {
            columns:5,
        }
    },
    options: [
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
            label: "list",
            value: {
                icon: {
                    icon: 'layout-list',
                },
                component: (props) => <Result {...props} controller={controller} layout={ResultsLayout.list}/>,
                columns:1,
            }
        },
    ]	
}

<SearchHorizontal controller={controller} layoutConfig={layoutConfig} />
```