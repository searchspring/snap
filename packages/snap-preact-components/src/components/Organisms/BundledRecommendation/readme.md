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
<BundledRecommendations controller={controller} />
```

### onAddToCart 
the required `onAddToCart` prop sets a the callback function for when a add to cart button is clicked. This function will be passed an array of selected item ids and their quantities. 

```jsx
<BundledRecommendations controller={controller} onAddToCart={(items)=>{console.log(items)}} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`. Note the first result will be displayed as the `seed` product. 

```jsx
<BundledRecommendations controller={controller} results={controller.store.results} />
```

### addToCartButtonText
The `addToCartButtonText` prop specifies the inner text to render in the add to cart button.

```jsx
<BundledRecommendations controller={controller} addToCartButtonText={'Add Bundle'} />
```

### title
The `title` prop specifies the carousel title

```jsx
<BundledRecommendations controller={controller} title={'Recommended Bundle'} />
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
<BundledRecommendations controller={controller} resultComponent={<ResultSlot />} />
```

### ctaSlot
The `ctaSlot` prop allows for a custom add to cart cta component to be rendered. This component will be passed the following props -

```jsx
	interface selectedItem {
		id: string;
		quantity: number;
	};
	
	{ 
		selectedItems: selectedItem[],
		bundlePrice: number, 
		strikePrice: number, 
		onclick: (e:any) => void
	}
```

```jsx
<BundledRecommendations controller={controller} ctaSlot={<CTASlot />} />
```

### preselectedCount
The `preselectedCount` prop specifies how many products in the bundle will be preselected. This number will include the seed. Example `preselectedCount={3}` would be `seed` + 2 preselected items. If not provided, this will default to however many products are initially visible. 

```jsx
<BundledRecommendations controller={controller} preselectedCount={4} />
```

### seedInCarousel
The `seedInCarousel` prop specifies if the seed product should be included in the carousel or not.  

```jsx
<BundledRecommendations controller={controller} seedInCarousel={true} />
```

### seedText
The `seedText` prop specifies text to be rendered as a badge in the seed product.   

```jsx
<BundledRecommendations controller={controller} seedText={"Main Product"} />
```

### seperatorIcon
The `seperatorIcon` prop specifies the icon to render between products. Takes an object with `Icon` component props or a string.     

```jsx
<BundledRecommendations controller={controller} seperatorIcon={'cog'} />
```

### seedSeparatorIconOnly
The `seedSeparatorIconOnly` prop specifies if the seperator Icon should only be rendered after the seed or after every product.     

```jsx
<BundledRecommendations controller={controller} seedSeparatorIconOnly={true} />
```

### stackedCTA
The `stackedCTA` prop specifies if the add to cart display should be block or inline witht the carousel.

```jsx
<BundledRecommendations controller={controller} stackedCTA={true} />
```

### peekaboo
The `peekaboo` prop enables the peek-a-boo display in the carousel.

```jsx
<BundledRecommendations controller={controller} peekaboo={true} />
```

### showQuantityPicker
The `showQuantityPicker` prop specifies if the quantity picker inputs should be rendered. 

```jsx
<BundledRecommendations controller={controller} showQuantityPicker={true} />
```

### showCheckboxes
The `showCheckboxes` prop specifies if the bundle checkboxes should be rendered. 

```jsx
<BundledRecommendations controller={controller} showCheckboxes={true} />
```

### pagination
The `pagination` prop specifies if the carousel should display pagination dots. 

```jsx
<BundledRecommendations controller={controller} pagination={true} />
```

### hideButtons
The `hideButtons` prop specifies if the carousel should hide prev/next buttons.

```jsx
<BundledRecommendations hideButtons={true} controller={controller}><Recommendation/>
```

### prevButton
The `prevButton` prop specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<BundledRecommendations controller={controller} prevButton={'<'} />
```

### nextButton
The `nextButton` prop specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<BundledRecommendations controller={controller} nextButton={'>'} />
```

### modules
The `modules` prop accepts additional [Swiper Modules](https://swiper6.vercel.app/swiper-api#modules) - these may need additional props and or stylesheets to function. We include `Navigation` and `Pagination` modules by default.

```jsx
import { Scrollbar } from 'swiper';
<BundledRecommendations controller={controller} modules={[Scrollbar]} scrollbar={{ draggable: true }} />
```

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however **`any Recommendation props`**, or [Swiper API parameters](https://swiper6.vercel.app/swiper-api#parameters) can also be specified. 

`slidesPerView` - number of products to display per page

`slidesPerGroup` - number of products to scroll by when next/previous button is clicked

`spaceBetween` - spacing between each product

```typescript
const defaultRecommendationBreakpoints = {
	0: {
		slidesPerView: 2,
		slidesPerGroup: 2,
		spaceBetween: 10,
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
<BundledRecommendations controller={controller} breakpoints={defaultRecommendationBreakpoints} />
```

