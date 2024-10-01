# RecommendationBundleEasyAdd

Renders a single recommended product and bundle CTA section that includes a visually hidden seed product. Like all of the bundle components, the first result passed will be treated as the seed. The Seed will not be rendered, but will be included in the cartstore, bundle pricing, and items included when adding to the cart. 

## Sub-components
- RecommendationBundle


### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### onAddToCart 
the required `onAddToCart` prop sets a the callback function for when a add to cart button is clicked. This function will be passed an array of selected item ids and their quantities. 

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`. Note the first result will be displayed as the `seed` product. 

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} results={controller.store.results} />
```

### title
The `title` prop specifies the carousel title

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} title={'Recommended Bundle'} />
```

### resultComponent
The `resultComponent` prop allows for a custom result component to be rendered. This component will be passed the following props -

```jsx
	{ 
		result: Product, 
		seed: boolean, 
		selected: boolean, 
		onProductSelect: (result:Product) => void
	}
```

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} resultComponent={<ResultSlot />} />
```

### ctaButtonText
The `ctaButtonText` prop specifies the inner text to render in the add to cart button.

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonText={'Add Bundle'} />
```

### ctaButtonSuccessText
The `ctaButtonSuccessText` prop specifies text to temporarily render in the add to cart button after it is clicked.

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessText={'Thanks for Shopping!'} />
```

### ctaButtonSuccessTimeout
The `ctaButtonSuccessTimeout` prop specifies number of ms to show success text in add to cart button before reverting back to normal text

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessTimeout={1500} />
```

### ctaIcon
The `ctaIcon` prop specifies the icon to render in the CTA. Takes an object with `Icon` component props or a string.     

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaIcon={'bag'} />
```

### ctaInline
The `ctaInline` prop specifies if the add to cart display should be block or inline witht the carousel.

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaInline={true} />
```

### ctaSlot
The `ctaSlot` prop allows for a custom add to cart cta component to be rendered. This component will be passed the following props -

```jsx	
	{ 
		cartStore: CartStore;
		onclick: (e:any) => void
	}
```

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaSlot={<CTASlot />} />
```

### seedText
The `seedText` prop specifies text to be rendered as a badge in the seed product.   

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} seedText={"Main Product"} />
```

### vertical
The `vertical` prop sets the carousel scroll direction to vertical.

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} vertical={true} />
```

### lazyRender 
The `lazyRender` prop specifies an object of lazy rendering settings. The settings include an `enable` toggle (defaults to `true`) as well as an `offset` (default `"10%"`) to specify at what distance the component should start rendering relative to the bottom of the viewport.

```jsx
const customLazyRenderProps = {
	enabled: true,
	offset: "20px" // any css margin values accepted - px, %, etc...
}

<RecommendationBundleEasyAdd controller={controller} lazyRender={ customLazyRenderProps } onAddToCart={(e, items)=>{console.log(items)}} />
```

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however **`any BundleRecommendation props`**, or [Swiper API parameters](https://swiperjs.com/react#swiper-props) can also be specified. 

`slidesPerView` - number of products to display per page

`slidesPerGroup` - number of products to scroll by when next/previous button is clicked

`spaceBetween` - spacing between each product

```typescript
const defaultRecommendationBreakpoints = {
	0: {
		carousel: {
			enabled: false,
		},
		limit: 2
	},
	768: {
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 10,
	},
	1024: {
		slidesPerView: 3,
		slidesPerGroup: 3,
		spaceBetween: 10,
	},
	1200: {
		slidesPerView: 4,
		slidesPerGroup: 4,
		spaceBetween: 10,
	},
};
```

```jsx
<RecommendationBundleEasyAdd controller={controller} onAddToCart={(e, items)=>{console.log(items)}} breakpoints={defaultRecommendationBreakpoints} />
```

