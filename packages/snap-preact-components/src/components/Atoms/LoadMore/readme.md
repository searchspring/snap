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

### auto
The `auto` prop will not render a "Show More" button and instead fetch the next page of results when the component appears in the viewport. Recommended to place underneath Results to allow for infinite scrolling. 

```jsx
<LoadMore pagination={controller.store.pagination} auto={true} />
```

Can be used in combination with `` and `` to not display anything and have infinite scrolling still function:

```jsx
<LoadMore pagination={controller.store.pagination} auto={true} hideProgressIndicator={true} hideProgressText={true} />
```

### intersectionOffset + auto
Requires `auto` prop to be `true`. The `intersectionOffset` prop defines the IntersectionObserver's `rootMargin` value. This is an offset added to each side of the component's bounding box to create the final root bounds. These bounds then determine when the component is in the viewport and the next results are fetched. Default: `0px`

```jsx
<LoadMore pagination={controller.store.pagination} auto={true} intersectionOffset={'40px'} />
```

```jsx
<LoadMore pagination={controller.store.pagination} auto={true} intersectionOffset={'100%'} />
```

### loading
The `loading` prop is not required if the `controller` prop is provided or `hideProgressIndicator` and `hideProgressText` are both `true`


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
<LoadMore pagination={controller.store.pagination} color={'#eeeeee'} />
```

### progressIndicator
The `progressIndicator` prop allows you to pick from two progress indicator designs: `bar` (default) or `radial`

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicator={'bar'} />
```

### progressIndicatorWidth
The `progressIndicatorWidth` prop sets the progress indicator width in pixels. When `progressIndicator='bar'` the default is `300` (bar width.) When `progressIndicator='radial'` the default is `70` (width and height.)

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicatorWidth={70} />
```

### progressIndicatorSize
The `progressIndicatorSize` prop sets the progress indicator size in pixels. When `progressIndicator='bar'` the default is `5` (bar height.) When `progressIndicator='radial'` the default is `10` (thickness between inner and outer radials)

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicatorSize={5} />
```

### hideProgressIndicator
The `hideProgressIndicator` prop hides the progress indicator.

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicator={true} />
```

### hideProgressText
The `hideProgressText` prop hides the progress text.

```jsx
<LoadMore pagination={controller.store.pagination} hideProgressText={true} />
```

### hideProgressIndicator + hideProgressText
When both `hideProgressIndicator` and `hideProgressText` props are `true` only the button will be displayed.

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicator={true} hideProgressText={true} />
```

#### onClick
The `onClick` prop allows for a custom callback function for when the button is clicked. Only supported if `progressIndicator={'bar'}`

```jsx
<LoadMore pagination={controller.store.pagination} progressIndicator={'bar'} onClick={(e)=>{console.log(e)}} />
```
