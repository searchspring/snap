# Variants

This is applicable to Search, Autocomplete, or Recommendation Controller configurations.

## Variant Options Configuration
The `settings.variants.options` is an object keyed by individual option field name for configuration of any option settings.

| option | description | default value | required | 
|---|---|:---:|:---:|
| label | allows for changing the label of the option - (color -> colour) | ➖ |   | 
| preSelected | array of option values to preselect - ['red','blue'] | ➖ |   | 
| thumbnailBackgroundImages | boolean used for setting the option background image as the variant thumbnail image  | ➖ |   | 
| mappings | object keyed by individual optionValues for mapping value attribute overrides  | ➖ |   | 
| mappings[optionValue].label | setting to override the value label  | ➖ |   | 
| mappings[optionValue].background | setting to override the value background  | ➖ |   | 
| mappings[optionValue].backgroundImageUrl | setting to override the value backgroundImageUrl  | ➖ |   | 

```jsx
const config = {
	settings:  {
		variants: {
			field: "ss__variants",
			options: {
				color: {
					label: "Colour",
					preSelected: ['transparent'],
					mappings: {
						red: {
							label: 'Cherry',
							backroundImageUrl: '/images/cherry.png'
						},
						blue: {
							label: "Sky",
							background: "teal",
						}
					}
				}
			}
		}
	}	
}
```
## Realtime Variants

### Variant Option Attributes:
When `realtime` is enabled the attributes `ss-variant-option` and `ss-variant-option-selected` are queried for and used to determine current variant selection and to also attach click events to know when to adjust variant selections in the selection stores. These attributes are needed in order for realtime variants to work properly. 

The attributes are to be added on each variant option in the platform product page main option buttons. The `ss-variant-option` attribute also expects a value of the option feild and option value seperated by a `:`. 

```jsx
<div>
	<a href="/products/tee--red" ss-variant-option="Color:red" ss-variant-option-selected>Red</a>
	<a href="/products/tee--blue" ss-variant-option="Color:Blue">Blue</a>
	<a href="/products/tee--green" ss-variant-option="Color:Green">Green</a>
	<a href="/products/tee--yellow" ss-variant-option="Color:Yellow">Yellow</a>
</div>
```

## Variant Option filters:
When `realtime` is enabled, by default the realtime updates will apply to all results in the store that have matching options available. However if this is not desired behaviour you may pass an array of filters to `settings.variants.realtime.filters`. 

Available filters include `first` and `unaltered`. The `first` filter will only update the first result in the store. The `unaltered` filter will update any result that has not yet been altered by the user. 

