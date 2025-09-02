# Pagination

Renders pagination page links for the given search response. 

## Sub-components
- Icon

## Usage
```jsx
import { Pagination } from '@searchspring/snap-preact-components';
```

### pagination
The required `pagination` prop specifies a reference to the pagination store object.

```jsx
<Pagination pagination={controller.store.pagination} />
```

### pages
The `pages` prop specifies the number of pages to retrieve. This value is passed to the `store.pagination.getPages()` method.

```jsx
<Pagination pagination={controller.store.pagination} pages={5} />
```

### pagesLeft
The `pagesLeft` prop specifies the number of pages to retrieve before the current page. This value is passed to the `store.pagination.getPages()` method along with `pagesRight`. Must be used with `pagesRight` prop.

```jsx
<Pagination pagination={controller.store.pagination} pagesLeft={2} />
```

### pagesRight
The `pagesLeft` prop specifies the number of pages to retrieve after the current page. This value is passed to the `store.pagination.getPages()` method along with `pagesLeft`. Must be used with `pagesLeft` prop.

```jsx
<Pagination pagination={controller.store.pagination} pagesRight={2} />
```

### hideFirst
The `hideFirst` prop disables the first page.

```jsx
<Pagination pagination={controller.store.pagination} hideFirst={true} />
```

### hideLast
The `hideLast` prop disables the last page.

```jsx
<Pagination pagination={controller.store.pagination} hideLast={true} />
```

### hideEllipsis
The `hideEllipsis` prop disables the hideEllipsis after the first page, or the last page when applicable. 

```jsx
<Pagination pagination={controller.store.pagination} hideEllipsis={true} />
```

### hideNext
The `hideNext` prop disables the next page.

```jsx
<Pagination pagination={controller.store.pagination} hideNext={true} />
```

### hidePrev
The `hidePrev` prop disables the previous page.

```jsx
<Pagination pagination={controller.store.pagination} hidePrev={true} />
```

### nextButton
The `nextButton` prop specifies the next page button content. This can be a string or JSX element.

```jsx
<Pagination pagination={controller.store.pagination} nextButton={'Next'} />
```

### prevButton
The `prevButton` prop specifies the previous page button content. This can be a string or JSX element.

```jsx
<Pagination pagination={controller.store.pagination} prevButton={'Prev'} />
```

### firstButton
The `firstButton` prop specifies the first page button content. This can be a string or JSX element.

```jsx
<Pagination pagination={controller.store.pagination} firstButton={'First'} />
```

### lastButton
The `lastButton` prop specifies the last page button content. This can be a string or JSX element.

```jsx
<Pagination pagination={controller.store.pagination} lastButton={'Prev'} />
```