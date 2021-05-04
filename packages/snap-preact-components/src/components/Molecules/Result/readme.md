## Result

Renders a single product card. 

## Sub-components
- Badge
- Price
- Image

## Usage

### result
The required `result` prop contains a reference to a product object from the `results` store array

```jsx
<Result result={controller.store.results[0]} />
```

### hideBadge
The `hideBadge` prop will prevent the `<Badge />` component from rendering.

```jsx
<Result result={controller.store.results[0]} hideBadge={true} />
```

### hideTitle
The `hideTitle` prop will prevent to product title from rendering.

```jsx
<Result result={controller.store.results[0]} hideTitle={true} />
```

### hidePricing
The `hidePricing` prop will prevent the pricing from rendering.

```jsx
<Result result={controller.store.results[0]} hidePricing={true} />
```

### detailsSlot
The `detailsSlot` prop can contain a string or JSX element to display in place of the title and pricing sections. This can be used to display any additional information.

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
<Result result={controller.store.results[0]} detailsSlot={<productDetails product={controller.store.results[0]}>} /> ///////////
```

### buttonSlot
The `buttonSlot` prop is a placeholder and renders before the `detailsSlot` section. It can contain a string or JSX element. Typically used to add a CTA button.

```typescript
const addToCartButton = (props) => {
	return (
		<button onClick={addToCartByID(props.id)}>Add to Cart</button>
	)
}
```

```jsx
<Result result={controller.store.results[0]} buttonSlot={<addToCartButton id={controller.store.results[0].attributes.productid}/>} />
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
The `layout` prop specifies if this Result will be contained in a `grid` or `list` layout

```jsx
<Result result={controller.store.results[0]} layout={'grid'} />
```
