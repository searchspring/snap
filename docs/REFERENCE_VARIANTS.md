# Variants

Product variants allow you to represent different versions of the same base product - such as different sizes, colors, styles or other attributes that distinguish product options. This helps to improve the shopping experience by making product options easily discoverable, and allow customers to switch between variants directly from search/category pages. Common examples include:

- Clothing items available in multiple sizes and colors
- Electronics with different storage capacities or features
- Furniture pieces with different fabric or finish options
- Beauty products in different scents or formulations

Snap's variants functionality helps manage these product variations by providing tools to configure, display and interact with variant data in your components.

Configure variants by setting the variant field in either:
- Controller config: `controllers[controller].config.settings.variants.field`
- Recommendation config: `instantiators.recommendation.config.settings.variants.field`

```js
const config = {
	instantiators: {
		recommendation: {
			components: {
				Bundle: async () => (await import('./components/Recommendations/Bundle/Bundle')).Bundle,
			},
			config: {
				settings: {
					variants: {
						field: 'ss_variants',
					},
				},
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					settings: {
						variants: {
							field: 'ss_variants',
						},
					},
				},
			},
		],
	},
};

const snap = new Snap(config);
```

Once configured, each result that has variants in `controller.store.results` should include a `variants` object with:

| Property | Description |
| --- | --- |
| `active` | Currently selected variant data |
| `data` | Array of all available variants |
| `selections` | Variant selection state and options (detailed below) |
| `setActive(variant)` | Select a specific variant |
| `update(newData)` | Update variant data post-initialization |

## Updating Variant Data

Use `result.variants.update(newData)` to modify variant data after initialization. This is useful for adding dynamic data like:
- Pricing
- Inventory levels  
- Swatch information

The update function expects the new variant data to match the variantData type.

```js
export type VariantData = {
	mappings: SearchResponseModelResultMappings;
	attributes: Record<string, unknown>;
	options: Record<string,
		{
			value: string;
			background?: string;
			backgroundImageUrl?: string;
			attributeId?: string;
			optionId?: string;
			optionValue?: string;
		}
	>;
};

snap.getController('search').then((search) => {
	search.on('afterStore', async (eventData, next) => {
		search.store.results.forEach((result) => {
			//fetch new variant data from external source
			const newVariantData: VariantData = await fetchVariantData(result.id);
			//update the variant data in the result
			result.variants.update(newVariantData);
		});
		await next();
	});
});
```

## `result.variants.selections`

The `result.variants.selections` object helps you build variant option picker components (like size/color selectors). When a user makes a selection, it automatically:
- Refines selection value options to update available sibling options based on current selections
- Updates the active variant on the main result
- Updates the `result.display` property with the selected variant's data (eg: price, image URL, name, etc..)

| Property | Description |
| :--- | :--- |
| `field` | Selection field name (e.g. "Color", "Size") |
| `selected` | Currently selected value (type: VariantSelectionValue) |
| `previouslySelected` | Previously selected value (type: VariantSelectionValue) |
| `values` | Array of available selection values (type: VariantSelectionValue[]) |
| `select(value)` | Select a variant option (e.g. `selection.select('blue')`) |
| `reset()` | Reset selection to default state |

```js
export type VariantSelectionValue = {
	value: string;
	label?: string;
	thumbnailImageUrl?: string;
	backgroundImageUrl?: string;
	background?: string;
	available?: boolean;
};
```

Below is a React component demonstrating how to implement variant selections:

```jsx
const selections = result.variants.selections;

{ selections?.map((selection) => (
    <div className="ss__selection">
        <h5 className="ss__selection__field">{selection.field}</h5>
        <ul className="ss__selection__options">
            {selection.values.map((option) => {
                const selected = selection.selected.value == option.value;
                return (
                    <li
                        className={
                            `ss__selection__options__option 
                            ${selected ? 'ss__selection__options__option--selected' : ''} 
                            ${option?.available === false ? 'ss__selection__options__option--unavailable' : ''}`
                        }
                        onClick={(e) => selection.select(option.value)}
                        title={option.label}
                        role="option"
                        aria-selected={selected}
                    >
                        <label className="ss__selection__options__option__label">{option.label || option.value}</label>
                    </li>
                );
            })}
        </ul>
    </div>
)) }
```

## Realtime Variants

Automatically sync variant selections between your product page and recommendation results by:

1. Enable the feature in your instantiator config:

```js
const config = {
	instantiators: {
		recommendation: {
			components: {
				Bundle: async () => (await import('./components/Recommendations/Bundle/Bundle')).Bundle,
			},
			config: {
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
						},
					},
				},
			},
		},
	},
},
```

2. On your product detail page, add the following attributes to the variant selectors for the main product. (see example below)

On your product page templates, add these attributes to the clickable variant selector elements:

- `ss-variant-option="${field}:${value}"` on each option element (e.g. "Color:Blue")
- `ss-variant-option-selected` on currently selected options

Alternatively, you can use the `controller/selectVariantOptions` global event to programmatically select variants. See [Global Events](https://github.com/searchspring/snap/tree/main/docs/REFERENCE_CONFIGURATION_MIDDLEWARE.md) for details.

The following shows color and size selectors with "Night" and "S" selected:

```jsx
<div class="option-selectors">
    <div class="option-selector-fieldset">
        <a ss-variant-option="Color:Lawn Party" href="/products/hightide-crew-lawn-party">Lawn Party</a>
        <a ss-variant-option="Color:Night" ss-variant-option-selected href="/products/hightide-crew-night">Night</a>
        <a ss-variant-option="Color:Pitch Black" href="/products/hightide-crew-pitch-black">Pitch Black</a>
        <a ss-variant-option="Color:Cornflower" href="/products/hightide-crew-cornflower">Cornflower</a>
    </div>
    <div class="option-selector-fieldset">
        <input class="option" type="radio" value="S" checked required/>
        <label ss-variant-option="Size:S" ss-variant-option-selected class="opt-label" >S</label>   
        
        <input class="option" type="radio" value="M" required/>
        <label ss-variant-option="Size:M" class="opt-label" >M</label>   
        <input class="option" type="radio" value="L" required/>
        <label ss-variant-option="Size:L" class="opt-label" >L</label>   
        <input class="option" type="radio" value="XL" required/>
        <label ss-variant-option="Size:XL" class="opt-label" >XL</label>   
    </div>
</div>
```

### Realtime Variant Filters

You can filter which results update in realtime by adding filters to your config:

- `first` - Updates only the first product in results (useful for Bundle Recommendations' seed product)
- `unaltered` - Updates only products that haven't been manually selected by the user on the current page.

```js
variants: {
    field: 'ss_variants',
    realtime: {
        enabled: true,
        filters: ['first']
    }
}
```

### Variant options

Configure individual variant fields using `controllers[controller].config.settings.variants.options`. This object is keyed by option field name for field-specific settings.

| Property | Description | Default | Required |
| :--- | :--- | :---: | :---: |
| `label` | Custom display label for the option field (e.g., "color" → "colour") | ➖ | |
| `preSelected` | Array of option values to select by default (e.g., `['red', 'blue']`) | ➖ | |
| `thumbnailBackgroundImages` | When true, uses variant thumbnail images as option background images | ➖ | |
| `mappings` | Object containing value-specific overrides | ➖ | |
| `mappings[optionValue].label` | Override display label for a specific option value | ➖ | |
| `mappings[optionValue].background` | Override background color for a specific option value | ➖ | |
| `mappings[optionValue].backgroundImageUrl` | Override background image URL for a specific option value | ➖ | |

```js
const config = {
	settings:  {
		variants: {
			field: "ss_variants",
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