# BundleRecommendations

Renders a recommended bundle of products with seed, carousel of recommendations and add to cart display.

## Sub-components
- Carousel
- Result (default)

## Usage

Additional [Swiper Component Props](https://swiper6.vercel.app/swiper-api#parameters) can be specified, but may need to be camelCased where appropriate.
Additional [Swiper Modules](https://swiper6.vercel.app/swiper-api#modules) can be provided via the `modules` prop; these may need additional props and or stylesheets.

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} />
```

### onAddToCart 
the required `onAddToCart` prop sets a the callback function for when a add to cart button is clicked. This function will be passed an array of selected item ids and their quantities. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`. Note the first result will be displayed as the `seed` product. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} results={controller.store.results} />
```

### carousel 
The `carousel` prop specifies an object of carousel settings. These settings will be merged with the default settings (listed below). Available settings are as follows

```jsx
interface CarouselProps {
	enabled: boolean;
	peekaboo?: boolean | .1 | .2 | .3 | .4 | .5 | .6 | .7 | .8 | .9;
	seedInCarousel?: boolean;
	prevButton?: JSX.Element | string;
	nextButton?: JSX.Element | string;
	hideButtons?: boolean;
	loop?: boolean;
	pagination?: boolean;
}

const defaultCarouselProps = {
	enabled: true,
	loop: false,
}
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ defaultCarouselProps } />
```

### enabled
The `enabled` prop is a sub prop under the `carousel` prop. It specifies weather the bundle should render as a carousel or not.

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ enabled:false } />
```

### seedInCarousel
The `seedInCarousel` prop is a sub prop under the `carousel` prop. It specifies if the seed product should be included in the carousel or not.  

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ seedInCarousel:true } />
```

### peekaboo
The `peekaboo` prop  is a sub prop under the `carousel` prop. It enables the peek-a-boo display in the carousel. if passed `true` it will show the default (show half of the next  available product card). Or you can pass it a decimal to customize how much of the next available product card should show. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ peekaboo:true } />
```

or 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ peekaboo:.2 } />
```

### pagination
The `pagination` prop is a sub prop under the `carousel` prop. It specifies if the carousel should display pagination dots. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ pagination:true } />
```

### hideButtons
The `hideButtons` is a sub prop under the `carousel` prop. It specifies if the carousel should hide prev/next buttons.

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ hideButtons:true }><Recommendation/>
```

### prevButton
The `prevButton` prop is a sub prop under the `carousel` prop. It specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ prevButton: '<' } />
```

### nextButton
The `nextButton` prop  is a sub prop under the `carousel` prop. It specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} carousel={ nextButton: '>' } />
```


### addToCartButtonText
The `addToCartButtonText` prop specifies the inner text to render in the add to cart button.

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} addToCartButtonText={'Add Bundle'} />
```

### title
The `title` prop specifies the carousel title

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} title={'Recommended Bundle'} />
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
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} resultComponent={<ResultSlot />} />
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
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} ctaSlot={<CTASlot />} />
```

### preselectedCount
The `preselectedCount` prop specifies how many products in the bundle will be preselected. This number will include the seed. Example `preselectedCount={3}` would be `seed` + 2 preselected items. If not provided, this will default to however many products are initially visible. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} preselectedCount={4} />
```


### seedText
The `seedText` prop specifies text to be rendered as a badge in the seed product.   

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} seedText={"Main Product"} />
```

### seperatorIcon
The `seperatorIcon` prop specifies the icon to render between products. Takes an object with `Icon` component props or a string.     

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} seperatorIcon={'cog'} />
```

### seedSeparatorIconOnly
The `seedSeparatorIconOnly` prop specifies if the seperator Icon should only be rendered after the seed or after every product.     

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} seedSeparatorIconOnly={true} />
```

### stackedCTA
The `stackedCTA` prop specifies if the add to cart display should be block or inline witht the carousel.

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} stackedCTA={true} />
```


### showCheckboxes
The `showCheckboxes` prop specifies if the bundle checkboxes should be rendered. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} showCheckboxes={true} />
```

### modules
The `modules` prop accepts additional [Swiper Modules](https://swiper6.vercel.app/swiper-api#modules) - these may need additional props and or stylesheets to function. We include `Navigation` and `Pagination` modules by default.

```jsx
import { Scrollbar } from 'swiper';
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} modules={[Scrollbar]} scrollbar={{ draggable: true }} />
```

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however **`any BundleRecommendation props`**, or [Swiper API parameters](https://swiper6.vercel.app/swiper-api#parameters) can also be specified. 

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
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} breakpoints={defaultRecommendationBreakpoints} />
```

