# RecommendationBundleVertical

Vertically renders a recommended bundle of products with seed, recommendations and add to cart display.

## Sub-components
- RecommendationBundle

## Usage

Additional [Swiper Component Props](https://swiperjs.com/react#swiper-props) can be specified, but may need to be camelCased where appropriate.
Additional [Swiper Modules](https://swiperjs.com/swiper-api#modules) can be provided via the `modules` prop; these may need additional props and or stylesheets.

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### onAddToCart 
the required `onAddToCart` prop sets a the callback function for when a add to cart button is clicked. This function will be passed an array of selected item ids and their quantities. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`. Note the first result will be displayed as the `seed` product. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} results={controller.store.results} />
```

### carousel 
The `carousel` prop specifies an object of carousel settings. These settings will be merged with the default settings (listed below). All valid Carousel component props (and any non-documented SwiperJS props) can be used here. The below example uses the `prevButton`, `nextButton` and `loop` props from the Carousel:

```jsx
type BundleCarouselProps = {
	enabled: boolean;
	seedInCarousel?: boolean;
} & CarouselProps

const customCarouselProps = {
	enabled: false
}

<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ customCarouselProps } />
```

### enabled
The `enabled` prop is a sub prop under the `carousel` prop. It specifies weather the bundle should render as a carousel or not.

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ enabled:true } />
```

### hideSeed
The `hideSeed` prop specifies if the seed result should be rendered or not.  

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} hideSeed={true} />
```

### seedInCarousel
The `seedInCarousel` prop is a sub prop under the `carousel` prop. It specifies if the seed product should be included in the carousel or not.  

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ seedInCarousel:true } />
```

### pagination
The `pagination` prop is a sub prop under the `carousel` prop. It specifies if the carousel should display pagination dots. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ pagination:true } />
```

### hideButtons
The `hideButtons` is a sub prop under the `carousel` prop. It specifies if the carousel should hide prev/next buttons.

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ hideButtons:true }><Recommendation/>
```

### prevButton
The `prevButton` prop is a sub prop under the `carousel` prop. It specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ prevButton: '<' } />
```

### nextButton
The `nextButton` prop  is a sub prop under the `carousel` prop. It specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} carousel={ nextButton: '>' } />
```

### title
The `title` prop specifies the carousel title

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} title={'Recommended Bundle'} />
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
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} resultComponent={<ResultSlot />} />
```

### ctaButtonText
The `ctaButtonText` prop specifies the inner text to render in the add to cart button.

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonText={'Add Bundle'} />
```

### ctaButtonSuccessText
The `ctaButtonSuccessText` prop specifies text to temporarily render in the add to cart button after it is clicked.

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessText={'Thanks for Shopping!'} />
```

### ctaButtonSuccessTimeout
The `ctaButtonSuccessTimeout` prop specifies number of ms to show success text in add to cart button before reverting back to normal text

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaButtonSuccessTimeout={1500} />
```

### ctaIcon
The `ctaIcon` prop specifies the icon to render in the CTA. Takes an object with `Icon` component props or a string.     

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaIcon={'bag'} />
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
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} ctaSlot={<CTASlot />} />
```

### preselectedCount
The `preselectedCount` prop specifies how many products in the bundle will be preselected. This number will include the seed. Example `preselectedCount={3}` would be `seed` + 2 preselected items. If not provided, this will default to however many products are initially visible. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} preselectedCount={4} />
```

### seedText
The `seedText` prop specifies text to be rendered as a badge in the seed product.   

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} seedText={"Main Product"} />
```

### separatorIcon
The `separatorIcon` prop specifies the icon to render between products. Takes an object with `Icon` component props or a string.     

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} separatorIcon={'cog'} />
```

### separatorIconSeedOnly
The `separatorIconSeedOnly` prop specifies if the seperator Icon should only be rendered after the seed or after every product.     

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} separatorIconSeedOnly={true} />
```


### hideCheckboxes
The `hideCheckboxes` prop specifies if the bundle checkboxes should be rendered. 

```jsx
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} hideCheckboxes={true} />
```

### modules
The `modules` prop accepts additional [Swiper Modules](https://swiperjs.com/swiper-api#modules) - these may need additional props and or stylesheets to function. We include `Navigation` and `Pagination` modules by default.

```jsx
import { Scrollbar } from 'swiper';
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} modules={[Scrollbar]} scrollbar={{ draggable: true }} />
```

### lazyRender 
The `lazyRender` prop specifies an object of lazy rendering settings. The settings include an `enable` toggle (defaults to `true`) as well as an `offset` (default `"10%"`) to specify at what distance the component should start rendering relative to the bottom of the viewport.

```jsx
const customLazyRenderProps = {
	enabled: true,
	offset: "20px" // any css margin values accepted - px, %, etc...
}

<RecommendationBundleVertical controller={controller} lazyRender={ customLazyRenderProps } onAddToCart={(e, items)=>{console.log(items)}} />
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
<RecommendationBundleVertical controller={controller} onAddToCart={(e, items)=>{console.log(items)}} breakpoints={defaultRecommendationBreakpoints} />
```

