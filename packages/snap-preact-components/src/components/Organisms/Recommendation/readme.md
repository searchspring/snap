# Recommendation

Renders a carousel of product recommendations, built using [Swiper](https://swiperjs.com/)

If using children, the provided children elements array length and order must match the results stored in the `controller.store.results` to avoid unexpected tracking behaviour.

Any modification to the results are recommended to be made using an `afterSearch` or `afterStore` event via the Controller instead of making modifications in the component.


## Sub-components
- Result (default)
- Icon

## Usage

Additional [Swiper API parameters](https://swiperjs.com/swiper-api#parameters) can be specified as props, but may need to be camelCased where appropriate.

### controller
The required `controller` prop specifies a reference to the RecommendationController

```jsx
<Results controller={controller} />
```
### loop
The `loop` prop enables 'infinite' looping through the result set when swiping or using the arrow buttons.

```jsx
<Results controller={controller} layout={'grid'} />
```

### title
The `title` prop specifies the carousel title

```jsx
<Results controller={controller} title={'Recommended Products'} />
```

### pagination
The `pagination` prop specifies if the carousel should display pagination dots. 

```jsx
<Results controller={controller} pagination={true} />
```

### prevButton
The `prevButton` prop specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<Results controller={controller} prevButton={'<'} />
```

### nextButton
The `nextButton` prop specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<Results controller={controller} nextButton={'>'} />
```

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however any [Swiper API parameters](https://swiperjs.com/swiper-api#parameters) can also be specified. 

`slidesPerView` - number of products to display per page

`slidesPerGroup` - number of products to scroll by when next/previous button is clicked

`spaceBetween` - spacing between each product

```typescript
const defaultRecommendationResponsive = {
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
```

```jsx
<Recommendation controller={controller} breakpoints={defaultRecommendationResponsive} />
```
