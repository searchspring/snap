# PaginationInfo

Renders a current count of the current products available.

## Usage

### controller
The `controller` prop specifies a reference to the search controller.

```jsx
<PaginationInfo controller={controller} />
```

### Store Props
Alternatively to using the `controller` prop, you can pass the required pagination store individually. The `pagination` prop specifies a reference to the SearchPaginationStore. 

```jsx
<PaginationInfo pagination={SearchPaginationStore} />
```

### infoText
The `infoText` prop specifies the text to render in the component. This can be either a string, or a function that returns a string, functions are passed the pagination store for reference to build out custom text.

```jsx
<PaginationInfo controller={controller} infoText={(pagination) => (`${pagination.totalResults} Results`)}/>
```