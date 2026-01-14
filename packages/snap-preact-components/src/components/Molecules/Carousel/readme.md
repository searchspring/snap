# Carousel

Renders a carousel of slides using children, built with [Swiper v11](https://swiperjs.com/get-started)

## Sub-components
- Icon

## Usage
```jsx
import { Carousel } from '@searchspring/snap-preact-components';
```

Additional [Swiper Component Props](https://swiperjs.com/react#swiper-props) can be specified, but may need to be camelCased where appropriate.
Additional [Swiper Modules](https://swiperjs.com/swiper-api#modules) can be provided via the `modules` prop; these may need additional props and or stylesheets.

```jsx
<Carousel>{children}</Carousel>
```
### loop
The `loop` prop enables 'infinite' looping through the result set when swiping or using the arrow buttons.

```jsx
<Carousel loop={true}>{children}</Carousel>
```

### pagination
The `pagination` prop can take a bool to enable pagination dots, or an object containing a SwiperOptions.pagination config object. Types can be found in [swiper docs](https://swiperjs.com/swiper-api#pagination). 

```jsx
<Carousel pagination={true}>{children}</Carousel>
```

or

```js
const paginationConfig = {
	bulletActiveClass: "active",
	bulletClass: 'bullet',
	clickable: false
};
```
```jsx
<Carousel pagination={paginationConfig}>{children}</Carousel>
```

### vertical 
The `vertical` prop changes the carousel slide direction from horizontal, to vertical. 

```jsx
<Carousel vertical={true}>{children}</Carousel>
```

### hideButtons
The `hideButtons` prop specifies if the carousel should hide prev/next buttons.

```jsx
<Carousel hideButtons={true}>{children}</Carousel>
```

### prevButton
The `prevButton` prop specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<Carousel prevButton={'<'}>{children}</Carousel>
```

### nextButton
The `nextButton` prop specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<Carousel nextButton={'>'}>{children}</Carousel>
```

### onPrevButtonClick
The `onPrevButtonClick` prop can be used to handle click events on the prevButton.

```jsx
<Carousel onPrevButtonClick={() => { /* do something */ }}>{children}</Carousel>
```

### onNextButtonClick
The `onNextButtonClick` prop can be used to handle click events on the prevButton.

```jsx
<Carousel onNextButtonClick={() => { /* do something */ }}>{children}</Carousel>
```

### onClick
The `onClick` prop can be used to handle click events on the swiper component.

```jsx
<Carousel onClick={(swiper, e) => { /* do something */ }}>{children}</Carousel>
```

### onInit
The `onInit` prop can be used to tie into the initialization event for swiper.

```jsx
<Carousel onInit={(swiper, e) => { /* do something */ }}>{children}</Carousel>
```

### modules
The `modules` prop accepts additional [Swiper Modules](https://swiperjs.com/swiper-api#modules) - these may need additional props and or stylesheets to function. We include `Navigation`, `Pagination` and `A11y` modules by default.

```jsx
import { Scrollbar } from 'swiper';
<Carousel modules={[Scrollbar]} scrollbar={{ draggable: true }}>{children}</Carousel>
```

### autoAdjustSlides
The `autoAdjustSlides` prop when set to `false` will disable the carousel from automatically adjusting the `slidesPerGroup`, `slidesPerView` and `loop` props when the `children` length is less than the current `slidesPerView`

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specifies the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however **`any Carousel props`** or [Swiper API parameters](https://swiperjs.com/react#swiper-props) can also be specified. 

`slidesPerView` - number of products to display per page (for a peekaboo effect use a decimal number here)

`slidesPerGroup` - number of products to scroll by when next/previous button is clicked

`spaceBetween` - spacing between each product

```js
const defaultCarouselBreakpoints = {
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

const defaultVerticalCarouselBreakpoints = {
	0: {
		slidesPerView: 1,
		slidesPerGroup: 1,
		spaceBetween: 0,
	},
};
```

```jsx
<Carousel breakpoints={defaultCarouselBreakpoints}>{children}</Carousel>
```
