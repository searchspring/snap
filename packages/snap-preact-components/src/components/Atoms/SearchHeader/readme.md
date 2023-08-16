# Search Header

Renders a search header.

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<SearchHeader controller={controller} />
```
### titleText
The `titleText` prop specifies the text to render in the title. This can be either a string, or a function that returns a string, functions are passed the controller. This defaults to - 
```jsx 
`Showing ${pagination.multiplePages ? `<span class="ss-results-count-range"> ${pagination.begin} - ${pagination.end} of </span>` : ''} 
		<span class="ss-results-count-total">${pagination.totalResults}</span> 
		result${pagination.totalResults == 1 ? '' : 's'} 
		${search?.query ? `<span>for <span class="ss-results-query">"${search.query.string}"</span></span>` : ''}`,
```

```jsx
<SearchHeader controller={controller} titleText={'Search Results'}/>
```

functional example -

```jsx
const getTitle = (controller) => {
	const { pagination, search } = controller.store;
	return `Showing ${pagination.multiplePages ? `<span class="ss-results-count-range"> ${pagination.begin} - ${pagination.end} of </span>` : ''} 
		<span class="ss-results-count-total">${pagination.totalResults}</span> 
		result${pagination.totalResults == 1 ? '' : 's'} 
		${search?.query ? `<span>for <span class="ss-results-query">"${search.query.string}"</span></span>` : ''}
	`
}
<SearchHeader controller={controller} titleText={getTitle}/>
```


### subTitleText
The `subTitleText` prop specifies an optional subtitle to render under the title. This can be either a string, or a function that returns a string, functions are passed the controller.

```jsx
<SearchHeader controller={controller} subTitleText={'Narrow your search!'} />
```

### oqText
The `oqText` prop specifies the text to show when there is an originalQuery. This can be either a string, or a function that returns a string, functions are passed the controller. 
Defaults to - 
```jsx
`No results found for ${store.search.originalQuery?.string}, showing results for ${store.search.query?.string} instead`.
```

```jsx
<SearchHeader controller={controller}  oqText={'Nothing found!'} />
```

### noResultsText
The `noResultsText` prop specifies the text to show when the totalResults count is 0. This can be either a string, or a function that returns a string, functions are passed the controller. 
Defaults to -
```jsx
`${store.search?.query ? 
		`<span>
			No results for <span class="ss-results-query">"${store.search.query.string}"</span> found.
		</span>`
	: 
		`<span>No results found.</span>`
}`,
```

```jsx
<SearchHeader controller={controller} noResultsText={'No Results Found, Please try another term'} />
```

