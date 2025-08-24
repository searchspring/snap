# Rating

Renders a component for a product rating. By default it supports partial star icons (eg. 4.5 / 50% width). The component will render only when the `value` prop is above zero - unless a `count` prop greater than zero is provided or the `alwaysRender` prop is used.

## Sub-components
- Icon

## Usage

### value
The `value` prop is required and expects a number between 0 and 5.

```jsx
<Rating value={4.4} />
```

### count
The `count` prop specifies the number of ratings for the product, this number will show after the rating icons.

```jsx
<Rating value={5} count={70} />
```

### text
An optional `text` prop specifies any additional text to display next to the rating icons (shows after the count if used)

```jsx
<Rating value={5} text="Product Rating" />
```

### alwaysRender
The `alwaysRender` prop will allow a product with no rating, or a zero rating to render.

```jsx
<Rating value={0} alwaysRender />
```

### disablePartialFill
The `disablePartialFill` prop will specify wether or not to show a partial star rating (eg. 3.3). When using this prop stars will round down. For example, a `value` of 3.3 would display as 3, and a `value` of 4.9 would round down to 4.

```jsx
<Rating value={3.3} disablePartialFill />
```

### fullIcon
The `fullIcon` prop specifies a path within the `Icon` component to use for the "full icons". The default value is `star`.

```jsx
<Rating value={4} fullIcon="heart" />
```

### emptyIcon
The `emptyIcon` prop specifies a path within the `Icon` component to use for the "full icons". The default value is `star-o`.

```jsx
<Rating value={4} emptyIcon="heart-o" />
```