# Autocomplete

Renders an autocomplete popup that binds to an `<input>` element.

The autocomplete layout renders terms, facets, banners, and results.

## Components Used
- Facets
- Banner
- Results
- Icon

## Usage

### input
The required `input` prop expects either:

- a string CSS selector that targets `<input>` element(s) to bind to

- an `<input>` element to bind to

```jsx
<Autocomplete controller={controller} input={'#searchInput'} />
```

### controller
The required `controller` prop specifies a reference to the autocomplete controller.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} />
```

### width
The `width` prop specifies a width for the overall component. The default value is '100%'.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} width="800px" />
```

### horizontalTerms
The `horizontalTerms` prop will alter autocomplete's CSS to display terms horizontally.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} horizontalTerms={true} />
```

### vertical
The `vertical` prop will alter autocomplete's CSS to display in a vertical layout.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} vertical={true} />
```

### termsTitle
The `termsTitle` prop will display the given text above the autocomplete terms area. The default value is blank and does not affect the trending terms title `trendingTitle`.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} termsTitle={'Terms'} />
```

### trendingTitle
The `trendingTitle` prop will display the given text above the autocomplete terms area when trending terms are displayed. The default value is 'Popular Searches' and does not affect non-trending terms title `termsTitle`. Also requires `controller.config.settings.trending.limit` to be configured)

```jsx
<Autocomplete controller={controller} input={'#searchInput'} trendingTitle={'Trending'} />
```

### facetsTitle
The `facetsTitle` prop will display the given text above the autocomplete facets area. (default is blank)

```jsx
<Autocomplete controller={controller} input={'#searchInput'} facetsTitle={'Filter By'} />
```

### contentTitle
The `contentTitle` prop will display the given text above the autocomplete content area. (default is blank)

```jsx
<Autocomplete controller={controller} input={'#searchInput'} contentTitle={'Results'} />
```

### viewportMaxHeight
The `viewportMaxHeight` prop will restrict autocomplete from overflowing the viewport. The max height of autocomplete will always be visible in the viewport. 

```jsx
<Autocomplete controller={controller} input={'#searchInput'} viewportMaxHeight={true} />
```

### termsSlot
The `termsSlot` prop accepts a custom JSX element to render instead of the default terms section. This will also replace the trending terms.

The following props are available to be used within your custom component: `terms`, `trending`, `termsTitle`, `trendingTitle`, `showTrending`, `controller`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} termsSlot={<CustomTermsComponent />} />
```

### facetsSlot
The `facetsSlot` prop accepts a custom JSX element to render instead of the default facets section. 

The following props are available to be used within your custom component: `facets`, `merchandising`, `facetsTitle`, `hideBanners`, `controller`, `valueProps`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} facetsSlot={<CustomFacetsComponent />} />
```

### contentSlot
The `contentSlot` prop accepts a custom JSX element to render instead of the default content section. 

The following props are available to be used within your custom component: `results`, `merchandising`, `search`, `pagination`, `filters`, `controller`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} contentSlot={<CustomContentComponent />} />
```

### resultsSlot
The `resultsSlot` prop accepts a custom JSX element to render instead of the default results section. 

The following props are available to be used within your custom component: `results`, `contentTitle`, `controller`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} resultsSlot={<CustomResultsComponent />} />
```

### noResultsSlot
The `noResultsSlot` prop accepts a custom JSX element to render instead of the default no results section. 

The following props are available to be used within your custom component: `search`, `pagination`, `controller`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} noResultsSlot={<CustomNoResultsComponent />} />
```

### linkSlot
The `linkSlot` prop accepts a custom JSX element to render instead of the default "see n results for keyword" link section. 

The following props are available to be used within your custom component: `search`, `results`, `pagination`, `filters`, `controller`

```jsx
<Autocomplete controller={controller} input={'#searchInput'} linkSlot={<CustomLinkComponent />} />
```

### hideFacets
The `hideFacets` prop specifies if the facets within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideFacets={true} />
```

### hideTerms
The `hideTerms` prop specifies if the terms within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideTerms={true} />
```

### hideContent
The `hideContent` prop specifies if the content area within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideContent={true} />
```

### hideBanners
The `hideBanners` prop specifies if the banners within autocomplete should be rendered. (inline banners not affected)

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideBanners={true} />
```

### hideLink
The `hideLink` prop specifies if the "see n results for keyword" text within autocomplete should be rendered.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} hideLink={true} />
```

### breakpoints
The `breakpoints` prop contains a breakpoints object that is passed to the `<Results />` sub-component.
When the viewport is between the Object's key value, those props will be merged with any exisiting Autocomplete component props.

Default Autocomplete `breakpoints` object:

```typescript
const breakpoints = {
    0: {
        columns: 2,
        rows: 1,
        hideFacets: true,
        vertical: true,
    },
    540: {
        columns: 3,
        rows: 1,
        vertical: true,
    },
    768: {
        columns: 2,
        rows: 3,
    },
};
```

See `<Results />` component documentation for further details.

```jsx
<Autocomplete controller={controller} input={'#searchInput'} breakpoints={breakpoints} />
```
