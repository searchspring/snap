# Search Header

Will render a series of heading elements to build a search header. Depending on current store data, it may show verbiage for the search title, corrected and original search query, no results title, or even a landing page title from the merchandising store.

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<SearchHeader controller={controller} />
```

### Store Props
Alternatively to using the `controller` prop, you can pass each of the required stores individually as props. The `query` prop specifies a reference to the SearchQueryStore, the `pagination` prop specifies a reference to the SearchPaginationStore, and the `merchandisingStore` prop specifies a reference to the SearchMerchandisingStore. 

```jsx
<SearchHeader query={SearchQueryStore} pagination={SearchPaginationStore} merchandising={SearchMerchandisingStore} />
```

### titleText
The `titleText` prop specifies the text to render in the title. This can be either a string, or a function that returns a string, functions are passed the controller.

```jsx
<SearchHeader controller={controller} titleText={'Search Results'}/>
```

### subtitleText
The `subtitleText` prop specifies an optional subtitle to render under the the rest of the headings. This can be either a string, or a function that returns a string, functions are passed the controller.

```jsx
<SearchHeader controller={controller} subtitleText={'Narrow your search!'} />
```

### correctedQueryText
The `correctedQueryText` prop specifies the text to show when there is an originalQuery. This can be either a string, or a function that returns a string, functions are passed the pagination and query store for reference to build out custom text.

```jsx
const getCorrected = (controller) => {
	const { pagination, search } = controller.store;
	return `<div class="ss__search-header__corrected">No results found for "<em>${search?.originalQuery?.string}</em>", showing results for "<em>${search?.query?.string}</em>" instead.</div>`
}
<SearchHeader controller={controller} correctedQueryText={getCorrected} />
```

### noResultsText
The `noResultsText` prop specifies the text to show when the totalResults count is 0. This can be either a string, or a function that returns a string, functions are passed the pagination and query store for reference to build out custom text.

```jsx
<SearchHeader controller={controller} noResultsText={'No Results Found, Please try another term'} />
```


### didYouMeanText
The `didYouMeanText` prop specifies the text to show when there is a "didYouMean" query. This can be either a string, or a function that returns a string, functions are passed the pagination and query store for reference to build out custom text.

```jsx
const getDym = (controller) => {
	const { search } = controller.store;
	return `<div class="ss__search-header__dym">Sorry, but did you mean "<em><a href=${search?.didYouMean?.url.href}>${search?.didYouMean?.string}</a></em>"</div>`
}
<SearchHeader controller={controller} didYouMeanText={getDym} />
```

### expandedSearchText
The `expandedSearchText` prop specifies the text to show when the search matchType equals 'expanded'.
```jsx
<SearchHeader controller={controller} expandedSearchText={"We couldn't find an exact match for that, but heres something similar:"} />
```

### hideTitleText
The `hideTitleText` prop hides the title text.

```jsx
<SearchHeader controller={controller} hideTitleText={true} />
```

### hideSubtitleText
The `hideSubtitleText` prop hides the subtitle text.

```jsx
<SearchHeader controller={controller} hideSubtitleText={true} />
```

### hideCorrectedQueryText
The `hideCorrectedQueryText` prop hides the corrected query text.

```jsx
<SearchHeader controller={controller} hideCorrectedQueryText={true} />
```

### hideNoResultsText
The `hideNoResultsText` prop hides the no results text.

```jsx
<SearchHeader controller={controller} hideNoResultsText={true} />
```

### hideDidYouMeanText
The `hideDidYouMeanText` prop hides did you mean text.

```jsx
<SearchHeader controller={controller} hideDidYouMeanText={true} />
```

### hideExpandedSearchText
The `hideExpandedSearchText` prop hides the expanded search text.

```jsx
<SearchHeader controller={controller} hideExpandedSearchText={true} />
```