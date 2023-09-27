# Search Template

Renders a Search Results Page.

## Sub-components

- Results
- NoResults
- Sidebar
- Toolbar
- SearchHeader
- MobileSidebar
- Dropdown
- Button
- Banner

## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<Search controller={controller} />
```

### mobileSidebarDisplayAt
The `mobileSidebarDisplayAt` prop specifies a CSS media query for when the MobileSidebar component will render. By default, the component will render at "991px".

```jsx
<Search controller={controller} mobileSidebarDisplayAt={'400px'} />
```

### hideSidebar
The `hideSidebar` prop specifies if the Sidebar component should be rendered.  

```jsx
<Search controller={controller} hideSidebar={true} />
```

### hideMobileSidebar
The `hideMobileSidebar` prop specifies if the MobileSidebar component should be rendered.  

```jsx
<Search controller={controller} hideMobileSidebar={true} />
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
The `toggleSidebarButtonText` prop specifies the inner text of the Sidebar toggle button. If passed, the sidebar will be rendered inside a Dropdown component.   

```jsx
<Search controller={controller} toggleSidebarButtonText={'Toggle Facets'} />
```

### hideMerchandisingBanners
The `hideMerchandisingBanners` prop specifies if merchandising banners should render. This can take a boolean to hide all banners, or an array of specific banner types you wish to hide. 

```jsx
<Search controller={controller} hideMerchandisingBanners={true} />
```
or
```jsx
<Search controller={controller} hideMerchandisingBanners={["Footer", "Header"]} />
```