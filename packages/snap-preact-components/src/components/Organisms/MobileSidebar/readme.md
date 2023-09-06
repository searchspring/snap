# MobileSidebar
Renders a Sidebar component wrapped in a Slideout Component to be used on mobile. 


## Components Used
- Sidebar
- Slideout
- Button


## Usage

### controller
The required `controller` prop specifies a reference to the search controller.

```jsx
<MobileSidebar controller={controller} />
```

### openButtonText
The `openButtonText` prop will change the inner text of the slideout button

```jsx
<MobileSidebar controller={controller} openButtonText={'Click To Filter'} />
```

### displayAt
The `displayAt` prop specifies a CSS media query for when the max width the component will render. By default, the component will render at 650px or less. 

```jsx
<MobileSidebar controller={controller} displayAt={'600px'}/>
```

### iconOpen
The `iconOpen` prop specifies the name of an icon to add to the slideout button, in addition the the slideout button text.

```jsx
<MobileSidebar controller={controller} iconOpen={'filter'} />
```

### iconClose
The `iconClose` prop specifies the name of an icon to add to the sidebar close button, in addition the the sidebar titleText.

```jsx
<MobileSidebar controller={controller} iconClose={'close'} />
```

### applyButtonIcon 
The `applyButtonIcon` prop specifies the name of an icon to add to the sidebar apply filters button.

```jsx
<MobileSidebar controller={controller} applyButtonIcon={'cog'} />
```

### clearButtonIcon 
The `clearButtonIcon` prop specifies the name of an icon to add to the sidebar clear all filters button.

```jsx
<MobileSidebar controller={controller} clearButtonIcon={'close'} />
```

### closeButtonIcon 
The `closeButtonIcon` prop specifies the name of an icon to add to the close sidebar button.

```jsx
<MobileSidebar controller={controller} closeButtonIcon={'close'} />
```

### openButtonIcon
The `openButtonIcon` prop specifies the name of an icon to add to the slideout open sidebar button.

```jsx
<MobileSidebar controller={controller} openButtonIcon={'cog'} />
```

### hideHeader
The `hideHeader` prop will disable the sidebar header from rendering. 

```jsx
<MobileSidebar controller={controller} hideHeader />
```

### hideFooter
The `hideFooter` prop will disable the sidebar footer from rendering. 

```jsx
<MobileSidebar controller={controller} hideFooter />
```

### hideCloseButton
The `hideCloseButton` prop will disable the close Button component from rendering.

```jsx
<MobileSidebar controller={controller} hideCloseButton />
```

### closeButtonText
The `closeButtonText` prop will change the inner text of the sidebar close button.
```jsx
<MobileSidebar controller={controller} closeButtonText={'Close Sidebar'} />
```

### titleText
The `titleText` prop will change the inner text of the sidebar title.
```jsx
<MobileSidebar controller={controller} titleText={'Filter By: '} />
```

### hideTitle
The `hideTitle` prop will disable the sidebar title from rendering.

```jsx
<MobileSidebar controller={controller} hideTitle />
```

### hideFacets
The `hideFacets` prop will disable the Facets component from rendering.
```jsx
<MobileSidebar controller={controller} hideFacets/>
```

### hidePerPage
The `hidePerPage` prop will disable the PerPage component from rendering.

```jsx
<MobileSidebar controller={controller} hidePerPage />
```

### hideSortBy
The `hideSortBy` prop will disable the SortBy component from rendering.

```jsx
<MobileSidebar controller={controller} hideSortBy />
```
### hideFilterSummary
The `hideFilterSummary` prop will disable the FilterSummary component from rendering.

```jsx
<MobileSidebar controller={controller} hideFilterSummary />
```

### hideClearButton
The `hideClearButton` prop will disable the clear all Button component from rendering.

```jsx
<MobileSidebar controller={controller} hideClearButton />
```

### clearButtonText
The `clearButtonText` prop will change the inner text of the clear all Button component.

```jsx
<MobileSidebar controller={controller} clearButtonText={'Start Over'} />
```

### hideApplyButton
The `hideApplyButton` prop will disable the apply Button component from rendering.

```jsx
<MobileSidebar controller={controller} hideApplyButton />
```

### applyButtonText
The `applyButtonText` prop will change the inner text of the apply Button component.

```jsx
<MobileSidebar controller={controller} applyButtonText={'Apply Changees'} />
```