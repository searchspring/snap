# LoadMore

Renders a "Load More" button that displays the next page of results. Recommended to be used with SearchController's `infinite` config

## Sub-components
- Button

## Usage

### pagination / controller
The required `pagination` (or `controller`) prop specifies a reference to the pagination store object.

```jsx
<LoadMore pagination={controller.store.pagination} />
```

```jsx
<LoadMore controller={controller} />
```

### autoFetch
The `autoFetch` prop will not render a "Show More" button and instead fetch the next page of results when the component appears in the viewport. Recommended to place underneath Results to allow for infinite scrolling. 

```jsx
<LoadMore pagination={controller.store.pagination} autoFetch={true} />
```

Can be used in combination with `hideProgressIndicator` and `hideProgressText` to not display anything and have infinite scrolling still function:

```jsx
<LoadMore pagination={controller.store.pagination} autoFetch={true} hideProgressIndicator={true} hideProgressText={true} />
```

### intersectionOffset + autoFetch
Requires `autoFetch` prop to be `true`. The `intersectionOffset` prop defines the IntersectionObserver's `rootMargin` value. This is an offset added to each side of the component's bounding box to create the final root bounds. These bounds then determine when the component is in the viewport and the next results are fetched. Default: `0px`

```jsx
<LoadMore pagination={controller.store.pagination} autoFetch={true} intersectionOffset={'40px'} />
```

### loading
The `loading` prop is not required if the `controller` prop is provided.

If the `pagination` prop is used, the `loading` prop should contain a value from `controller.store.loading` to allow for the "Load More" button to be disabled and the spinner icon visible while fetching results.

```jsx
<LoadMore pagination={controller.store.pagination} loading={controller.store.loading} />
```

### loadMoreText
The `loadMoreText` prop sets the button text. Default value: "Load More"

```jsx
<LoadMore pagination={controller.store.pagination} loadMoreText={'Load More'} />
```

### color
The `color` prop specifies the color of the indicator active state.

```jsx
<LoadMore pagination={controller.store.pagination} color={'#ffff00'} />
```

### backgroundColor
The `backgroundColor` prop specifies the background color of the indicator.

```jsx
<LoadMore pagination={controller.store.pagination} backgroundColor={'#eeeeee'} />
```

### progressIndicator
The `progressIndicator` prop allows you to pick from two progress indicator designs: `bar` (default) or `radial`

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicator={'bar'} />
```

### progressIndicatorWidth
The `progressIndicatorWidth` prop sets the progress indicator width. Recommended units: `px`, `rem`, `em`, `vw`. Unsupported unit: `%` not recommended. 

When `progressIndicator='bar'` the default is `300px` (bar width.) When `progressIndicator='radial'` the default is `70px` (width and height.)

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicatorWidth={'300px'} />
```

### progressIndicatorSize
The `progressIndicatorSize` prop sets the progress indicator size. Recommended units: `px`, `rem`, `em`, `vw`. Unsupported unit: `%` not recommended. 

When `progressIndicator='bar'` the default is `5px` (bar height.) When `progressIndicator='radial'` the default is `10px` (thickness between inner and outer radials)

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicatorSize={'5px'} />
```

### hideProgressIndicator
The `hideProgressIndicator` prop hides the progress indicator.

```jsx
<LoadMore pagination={controller.store.pagination} hideProgressIndicator={true} />
```

### hideProgressText
The `hideProgressText` prop hides the progress text.

```jsx
<LoadMore pagination={controller.store.pagination} hideProgressText={true} />
```

### hideProgressIndicator + hideProgressText
When both `hideProgressIndicator` and `hideProgressText` props are `true` only the button will be displayed.

```jsx
<LoadMore pagination={controller.store.pagination} hideProgressIndicator={true} hideProgressText={true} />
```

### loadingIcon
The `loadingIcon` prop defines the icon used when loading. Default: `spinner`
```jsx
<LoadMore pagination={controller.store.pagination} loadingIcon={'spinner'} />
```

### loadingLocation
The `loadingLocation` prop defines the location of the loading icon. Default: `button` will be displayed within the "Load More" button. Alternative value of `outside` will display the loading icon in place of the button.

### onClick
The `onClick` prop allows for a custom callback function for when the button is clicked.

```jsx
<LoadMore pagination={controller.store.pagination} onClick={(e)=>{console.log(e)}} />
```
