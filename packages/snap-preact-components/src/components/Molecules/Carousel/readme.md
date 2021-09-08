# Carousel

Renders a carousel of slides using children, built with [Swiper](https://swiperjs.com/)

## Sub-components
- Icon

## Usage

Additional [Swiper API parameters](https://swiperjs.com/swiper-api#parameters) can be specified as props, but may need to be camelCased where appropriate.

```jsx
<Carousel>{children}<Carousel/>
```
### loop
The `loop` prop enables 'infinite' looping through the result set when swiping or using the arrow buttons.

```jsx
<Carousel loop>{children}<Carousel/>
```

### pagination
The `pagination` prop specifies if the carousel should display pagination dots. 

```jsx
<Carousel pagination>{children}<Carousel/>
```

### verticalSlide 
The `verticalSlide` prop changes the carousel slide direction from horizontal, to vertical. 

```jsx
<Carousel verticalSlide>{children}<Carousel/>
```

### hideButtons
The `hideButtons` prop specifies if the carousel should hide prev/next buttons.

```jsx
<Carousel hideButtons>{children}<Carousel/>
```

### prevButton
The `prevButton` prop specifies the previous button element of the carousel. This can be a string or JSX element. 

```jsx
<Carousel prevButton={'<'}>{children}<Carousel/>
```

### nextButton
The `nextButton` prop specifies the next button element of the carousel. This can be a string or JSX element. 

```jsx
<Carousel nextButton={'>'}>{children}<Carousel/>
```

### onPrevButtonClick
The `onPrevButtonClick` prop can be used to handle click events on the prevButton.

```jsx
<Carousel onPrevButtonClick={() => { /* do something */ }}>{children}<Carousel/>
```

### onNextButtonClick
The `onNextButtonClick` prop can be used to handle click events on the prevButton.

```jsx
<Carousel onNextButtonClick={() => { /* do something */ }}>{children}<Carousel/>
```

### onClick
The `onClick` prop can be used to handle click events on the swiper component.

```jsx
<Carousel onClick={(swiper, e) => { /* do something */ }}>{children}<Carousel/>
```

### onInit
The `onInit` prop can be used to tie into the initialization event for swiper.

```jsx
<Carousel onInit={(swiper, e) => { /* do something */ }}>{children}<Carousel/>
```

### breakpoints
An object that modifies the responsive behavior of the carousel at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

The default configuration contains the following properties, however any [Swiper API parameters](https://swiperjs.com/swiper-api#parameters) can also be specified. 

`slidesPerView` - number of products to display per page

`slidesPerGroup` - number of products to scroll by when next/previous button is clicked

`spaceBetween` - spacing between each product

```typescript
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
```

```jsx
<Carousel breakpoints={defaultCarouselBreakpoints}>{children}<Carousel/>
```
