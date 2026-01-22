# Swatches

Renders a swatch component.

## Components Used
- carousel
- Swatches
- image

## Usage
```jsx
import { Swatches } from '@searchspring/snap-preact-components';
```

### options
The required `options` prop specifies an array of options to render. Each option requires a value, but can optionally provide label, background, backgroundImageUrl, and disabled properties. 
if no background or backgroundImageUrl provided, the value will be used as the css background color. 

```jsx
const options: SwatchOption = [
        {
            value: 'Rainbow',
            label: 'Rainbow',
            background: `linear-gradient(
                90deg,
                rgba(255, 0, 0, 1) 0%,
                rgba(255, 154, 0, 1) 10%,
                rgba(208, 222, 33, 1) 20%,
                rgba(79, 220, 74, 1) 30%,
                rgba(63, 218, 216, 1) 40%,
                rgba(47, 201, 226, 1) 50%,
                rgba(28, 127, 238, 1) 60%,
                rgba(95, 21, 242, 1) 70%,
                rgba(186, 12, 248, 1) 80%,
                rgba(251, 7, 217, 1) 90%,
                rgba(255, 0, 0, 1) 100%
            )`,
        },
        {
            value: 'red',
            label: 'red',
            backgroundImageUrl:
                'https://htmlcolorcodes.com/assets/images/colors/dark-red-color-solid-background-1920x1080.png',
        },
		{ value: 'Blue', label: 'Blue' },
		{ value: 'Green', label: 'Green' },
		{ value: 'Orange', label: 'Orange', disabled: true },
		{ value: 'Tan', label: 'Tan' },
		{ value: 'Pink', label: 'Pink'},
		{ value: 'Black', label: 'Black' },
		{ value: 'White', label: 'White'},
	],

<Swatches options={options} />
```

### type
The optional `type` prop specifies if what the swatch options should be rendered as. Type options are `carousel` or `grid`, with `carousel` as default. When a type is set, you can optionally pass additional child props to be spread in to each sub component. 

```jsx
const carouselProps: Partial<CarouselProps> = {
    loop: true,
    nextButton: 'Next',
    prevButton: "Prev"
}

<Swatches options={options} type={"carousel"} carousel={carouselProps}/>
```
or
```jsx
const gridProps: Partial<GridProps> = {
    rows: 1, 
    columns: 6,
}

<Swatches options={options} type={"grid"} grid={gridProps}/>
```

### hideLabels
The optional `hideLabels` prop specifies if option labels should be hidden. 

```jsx
<Swatches options={options} hideLabels={true} />
```

### onSelect
The optional `onSelect` prop specifies callback function to be called on option click. 

```jsx
const onSelectFunc = (event, clickedOption) => {
    console.log(event, clickedOption)
}

<Swatches options={options} onSelect={onSelectFunc} />
```

### titleText
The optional `titleText` prop specifies the text to be rendered in the Swatches title. 

```jsx
<Swatches options={options} titleText={"Swatches Title"} />
```

### selected
The optional `selected` prop specifies the selected option if the selected state is handled outside of the component. 

```jsx

const selectedOption: SwatchOption = { value: 'Red', label: 'Red', disabled: false },

<Swatches options={options} selected={selectedOption} />
```


### breakpoints
An object that modifies the responsive behavior of the swatches at various viewports. 

The object key specified the viewport for when the parameters will be applied. 

Depending on the `type` prop passed, the default configuration contains the following properties, however **`any swatches props`**, can be specified. 

```js
    const defaultCarouselBreakpoints = {
		0: {
			carousel: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				spaceBetween: 10,
			}
		},
		768: {
			carousel: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 10,
			}
		},
		1200: {
			carousel: {
				slidesPerView: 4,
				slidesPerGroup: 4,
				spaceBetween: 10,
			}
		},
	};

	const defaultGridBreakpoints = {
		0: {
			grid: {
				rows: 1, 
				columns: 5,
				overflowButtonInGrid: true,
				disableOverflowAction: true,
			}
		},
	};

    const customBreakpoints = {
        0: {
            type={'carousel'}
			carousel: {
				slidesPerView: 2,
				slidesPerGroup: 2,
				spaceBetween: 10,
			},
            hideLabels: true,
            
		},
		768: {
            type={'carousel'}
			carousel: {
				slidesPerView: 3,
				slidesPerGroup: 3,
				spaceBetween: 10,
			},
            hideLabels: true,
		},
		1200: {
            type={'grid'}
			grid: {
				rows: 1, 
				columns: 5,
				overflowButtonInGrid: true,
				disableOverflowAction: true,
			}
		},
    }
```

```jsx
<Swatches options={options} breakpoints={customBreakpoints} />
```

