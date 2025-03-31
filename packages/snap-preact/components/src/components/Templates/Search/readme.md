# Search Template

Renders a Search Results Page.

## Sub-components

- Results
- NoResults
- Sidebar
- Toolbar
- SearchHeader
- MobileSidebar
- Button

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Search controller={controller} />
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

### hideSearchHeader
The `hideSearchHeader` prop specifies if the SearchHeader component should be rendered.  

```jsx
<Search controller={controller} hideSearchHeader={true} />
```

### hidetopToolBar
The `hidetopToolBar` prop specifies if the top ToolBar component should be rendered.  

```jsx
<Search controller={controller} hidetopToolBar={true} />
```

### hideBottomToolBar
The `hideBottomToolBar` prop specifies if the bottom ToolBar component should be rendered.  

```jsx
<Search controller={controller} hideBottomToolBar={true} />
```

### toggleSidebarButtonText
The `toggleSidebarButtonText` prop specifies the inner text of the Sidebar toggle button. If left undefined, no button will render. 

```jsx
<Search controller={controller} toggleSidebarButtonText={'Toggle Facets'} />
```

### hideToggleSidebarButton
The `hideToggleSidebarButton` prop hides the Sidebar toggle button.

```jsx
<Search controller={controller} toggleSidebarButtonText={'Toggle Facets'} hideToggleSidebarButton={true} />
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

<Search controller={controller} layoutConfig={layoutConfig} />
```