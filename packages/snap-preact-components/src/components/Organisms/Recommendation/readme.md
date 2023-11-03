# Recommendation

Renders a carousel of product recommendations, built using the Carousel Component.

If using children, the provided children elements array length and order must match the results stored in the `controller.store.results` (or `results` prop) to avoid unexpected tracking behaviour.

Any modification to the results array and data are recommended to be made using an `afterSearch` and/or `afterStore` event via the Controller instead of making modifications in the component.


## Sub-components
- Carousel
- Result (default)

## Usage

Additional [Swiper Component Props](https://swiper6.vercel.app/swiper-api#parameters) can be specified, but may need to be camelCased where appropriate.
Additional [Swiper Modules](https://swiper6.vercel.app/swiper-api#modules) can be provided via the `modules` prop; these may need additional props and or stylesheets.

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<Recommendation controller={controller} />
```
### loop
The `loop` prop enables 'infinite' looping through the result set when swiping or using the arrow buttons.

```jsx
<Recommendation controller={controller} loop={true} />
```

### results
The `results` prop specifies a reference to the results store array to use instead of the default `controller.store.results`

If using children, the provided children elements array length and order must match the results stored in the `results` prop to avoid unexpected tracking behaviour.

```jsx
<Recommendation controller={controller} results={controller.store.results} />
```

### title
The `title` prop specifies the carousel title

```jsx
<Recommendation controller={controller} title={'Recommended Products'} />
```

### pagination
The `pagination` prop specifies if the carousel should display pagination dots. 

```jsx
<Recommendation controller={controller} pagination={true} />
```

### vertical
The `vertical` prop sets the carousel scroll direction to vertical.

```jsx
<Recommendation vertical={true}>{children}<Recommendation/>
```

### hideButtons
The `hideButtons` prop specifies if the carousel should hide prev/next buttons.

```jsx
<Recommendation hideButtons={true}>{children}<Recommendation/>
```

### prevButton
The `prevButton` prop specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<Recommendation controller={controller} prevButton={'<'} />
```

### nextButton
The `nextButton` prop specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<Recommendation controller={controller} nextButton={'>'} />
```

### modules
The `modules` prop accepts additional [Swiper Modules](https://swiper6.vercel.app/swiper-api#modules) - these may need additional props and or stylesheets to function. We include `Navigation` and `Pagination` modules by default.

```jsx
import { Scrollbar } from 'swiper';
<Recommendation controller={controller} modules={[Scrollbar]} scrollbar={{ draggable: true }} />
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
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
	},
	480: {
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
		slidesPerView: 4,
		slidesPerGroup: 4,
		spaceBetween: 10,
	},
	1200: {
		slidesPerView: 5,
		slidesPerGroup: 5,
		spaceBetween: 10,
	},
};

const defaultVerticalRecommendationBreakpoints = {
	0: {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
	},
};
```

```jsx
<Recommendation controller={controller} breakpoints={defaultRecommendationBreakpoints} />
```
