# Result

Renders a single product card. 

## Sub-components
- Badge
- Price
- Image

## Usage

### result
The required `result` prop specifies a reference to a product object from the `results` store array.

```jsx
<Result result={controller.store.results[0]} />
```

### hideBadge
The `hideBadge` prop will prevent the `<OverlayBadge />` and `<CalloutBadge />` components from rendering.

```jsx
<Result result={controller.store.results[0]} hideBadge={true} />
```

### hideTitle
The `hideTitle` prop will prevent to product title from rendering.

```jsx
<Result result={controller.store.results[0]} hideTitle={true} />
```

### hideRating
The `hideRating` prop will prevent to product rating from rendering.

```jsx
<Result result={controller.store.results[0]} hideRating={true} />
```

### hideATCButton
The `hideATCButton` prop will prevent to product add to cart button from rendering.

```jsx
<Result result={controller.store.results[0]} hideATCButton={true} />
```

### ATCButtonText
The `ATCButtonText` prop will will change the text rendered in the add to cart button.

```jsx
<Result result={controller.store.results[0]} ATCButtonText={'Add To Cart'} />
```

### hidePricing
The `hidePricing` prop will prevent the pricing from rendering.

```jsx
<Result result={controller.store.results[0]} hidePricing={true} />
```


### onAddToCartClick
The `onAddToCartClick` prop is a function to be called on add to cart button click. In addition to the built in platform addToCart function on the controller. 

```jsx
<Result result={controller.store.results[0]} hidePricing={true} />
```
### hideImage
The `hideImage` prop will prevent the image from rendering.

```jsx
<Result result={controller.store.results[0]} hideImage={true} />
```

### detailSlot
The `detailSlot` prop is a JSX element to used display additional content below the title and pricing sections.

```typescript
const productDetails = (props) => {
	const listEntries = props?.product?.attributes?.descriptionList.split('|');
	return (
		listEntries && (
			<ul>
				{listEntries.map(entry => (
					<li>{entry}</li>
				))}
			</ul>
		)
	)
}
```

```jsx
<Result result={controller.store.results[0]} detailSlot={<productDetails product={controller.store.results[0]/>} />
```

### fallback
The `fallback` prop will be passed to the `<Image />` sub-component. If the primary image does not display, this fallback image will be displayed instead. 

```jsx
<Result result={controller.store.results[0]} fallback={'https://www.example.com/imgs/placeholder.jpg'} />
```

### width
The `width` prop sets the width of this Result.

```jsx
<Result result={controller.store.results[0]} width={'25%'} />
```

### layout
The `layout` prop specifies if this Result will be contained in a `grid` or `list` layout.

```jsx
<Result result={controller.store.results[0]} layout={'grid'} />
```

### truncateTitle
The `truncateTitle` prop utililizes the truncate filter from the snap-toolbox to allow you truncate the product title at a certain character length, and optionally append an additional string such as "..."

```jsx
<Result result={controller.store.results[0]} truncateTitle={ limit: 5, append: '...' } />
```