# AutocompleteSlideout

Renders an autocomplete popup that binds to an `<input>` element.

The AutocompleteSlideout component is very similar to the Autocomplete component in functionality, however the main difference is that the AutocompleteSlideout components layout is determined by the layout prop, which specifies what child components render and where.

## Components Used
- autocompleteLayout
- Slideout
- SearchInput

## Usage

### input
The required `input` prop expects either:

- a string CSS selector that targets `<input>` element(s) to bind to

- an `<input>` element to bind to

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} />
```

### controller
The required `controller` prop specifies a reference to the autocomplete controller.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} />
```

### layout
The `layout` prop is used to specify which child components render and where. The prop takes an array of specific module names, the order of these module names determines the order in which they will be rendered. Additionally you can pass arrays of modules to the array to specify new rows in the display.

There are also a few special module names - `C1`, `C2`, `C3`, `C4`, & `_` 

All of the `Cx` modules represent Columns which also have their own layout array by default, and can be overwrote via their own layout props. IE - `C1` module can be overwrote via the `column1` prop. 

The `_` module is used a seperator module to center|left|right justify the other elements in the layout.

available modules to use in the layout are 

`C1`, `C2`, `C3`, `C4`,`TermsList`, `Terms.history`, `Terms.trending`, `Terms.suggestions`, `Facets`, `FacetsHorizontal`, `Button.see-more`, `Content`, `_`, `Banner.left`, `Banner.banner`, `Banner.footer`, `Banner.header`.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} layout={[['C1','C2','C3']]}/>
```

### column1
The `column1` prop specifies the layout to render in the `C1` module. Takes an object with two properties, 

`width` which specifies how wide the the column should be. This can be a string - `150px` or `auto`. If set to auto, the column will automatically grow and shrink based on its surroundings. 

`layout` which specifies an array of modules to render in the column. Defaults to `['TermsList']`. All layout modules are available to use with the exception of the `Cx` modules. Additional arrays for new rows are also supported.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} column1={{
    width: '150px',
    layout: ['Terms.history', 'Terms.trending']
}}/>
```

### column2
The `column2` prop specifies a layout array to render in the `C2` module. Takes an object with two properties, 

`width` which specifies how wide the the column should be. This can be a string - `150px` or `auto`. If set to auto, the column will automatically grow and shrink based on its surroundings. 

`layout` which specifies an array of modules to render in the column. Defaults to `['Facets']`. All layout modules are available to use with the exception of the `Cx` modules. Additional arrays for new rows are also supported.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} column2={{
    width: '150px',
    layout: ['Facets']
}}/>
```

### column3
The `column3` prop specifies a layout array to render in the `C3` module. Takes an object with two properties, 

`width` which specifies how wide the the column should be. This can be a string - `150px` or `auto`. If set to auto, the column will automatically grow and shrink based on its surroundings. 

`layout` which specifies an array of modules to render in the column. Defaults to `[['Content'], ['_', 'Button.see-more']]`. All layout modules are available to use with the exception of the `Cx` modules. Additional arrays for new rows are also supported.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} column3={{
    width: '150px',
    layout: [['Content', ['_', 'Button.see-more', '_']]]
}}/>
```

### column4
The `column4` prop specifies a layout array to render in the `C4` module. Takes an object with two properties, 

`width` which specifies how wide the the column should be. This can be a string - `150px` or `auto`. If set to auto, the column will automatically grow and shrink based on its surroundings. 

`layout` which specifies an array of modules to render in the column. Defaults to `[['Content'], ['_', 'Button.see-more']]`. All layout modules are available to use with the exception of the `Cx` modules. Additional arrays for new rows are also supported.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} column4={{
width: '150px',
layout: ['Facets']
}}/>
```

### buttonSelector
The `buttonSelector` prop defines a CSS selector for the element that triggers the Modal to open. By default, it uses the selector provided in the `input` prop.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} buttonSelector={".openSearchButton"} />
```

### overlayColor
The `overlayColor` prop specifies the color of the overlay.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} overlayColor={'rgba(0,0,0,0.8)'} />
```

### renderInput
The `renderInput` prop specifies whether the Search Input should be rendered. 

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} renderInput={false} />
```

### width
The `width` prop specifies a width for the overall component. The default value is '100%'.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} width="800px" />
```

### excludeBanners
The `excludeBanners` prop specifies if the Autocomplete should automatically include banners. 

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} excludeBanners={true} />
```

### facetsTitle
The `facetsTitle` prop will display the given text above the facets area.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} facetsTitle={'Facets'} />
```

### contentTitle
The `contentTitle` prop will display the given text above the content area.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} contentTitle={'Search Results'} />
```

### viewportMaxHeight
The `viewportMaxHeight` prop will restrict autocomplete from overflowing the viewport. The max height of autocomplete will always be visible in the viewport. 

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} viewportMaxHeight={true} />
```

### slideDirection
The `slideDirection` prop sets the direction that the slideout slides in. Defaults to `left`. Available values are `left`, `right`, `top`, & `bottom`.

```jsx
<AutocompleteSlideout controller={controller} input={'#searchInput'} slideDirection={'right'} />
```
