# Search Header

Will render a series of heading elements to build a search header. Depending on current store data, it may show verbiage for the search title & subtitle, corrected and original search query, no results title, or even a landing page title from the merchandising store. 

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<SearchHeader controller={controller} />
```

### Store Props
Alternatively to using the `controller` prop, you can pass each of the required stores individually as props. The `queryStore` prop specifies a reference to the SearchQueryStore, the `paginationStore` prop specifies a reference to the SearchPaginationStore, and the `merchandisingStore` prop specifies a reference to the SearchMerchandisingStore. 

```jsx
<SearchHeader queryStore={SearchQueryStore} paginationStore={SearchPaginationStore} merchandisingStore={SearchMerchandisingStore} />
```

### titleText
The `titleText` prop specifies the text to render in the title. This can be either a string, or a function that returns a string, functions are passed the controller.

```jsx
<SearchHeader controller={controller} titleText={'Search Results'}/>
```

### subTitleText
The `subTitleText` prop specifies an optional subtitle to render under the title. This can be either a string, or a function that returns a string, functions are passed the controller.

```jsx
<SearchHeader controller={controller} subTitleText={'Narrow your search!'} />
```

### correctedQueryText
The `correctedQueryText` prop specifies the text to show when there is an originalQuery. This can be either a string, or a function that returns a string, functions are passed the controller. 

```jsx
const getCorrected = (controller) => {
	const { pagination, search } = controller.store;
	return `<div class="ss__search-header__corrected">No results found for <em>"${search?.originalQuery?.string}"</em>, showing results for <em>"${search?.query?.string}"</em> instead.</div>`
}
<SearchHeader controller={controller} correctedQueryText={getCorrected} />
```

### noResultsText
The `noResultsText` prop specifies the text to show when the totalResults count is 0. This can be either a string, or a function that returns a string, functions are passed the controller. 

```jsx
<SearchHeader controller={controller} noResultsText={'No Results Found, Please try another term'} />
```

