## Badges

Badges are self-configured in the Searchspring Management Console.

To displays badges the Result card must include the [OverlayBadge](https://searchspring.github.io/snap/#/components-preact?params=%3Fpath%3D%2Fstory%2Fmolecules-overlaybadge--default) and [CalloutBadge](https://searchspring.github.io/snap/#/components-preact?params=%3Fpath%3D%2Fstory%2Fmolecules-calloutbadge--default) components. 


### OverlayBadge

The `OverlayBadge` component wraps elements (children) that should have badges overlayed - typically the product image.

```jsx
<OverlayBadge controller={controller} result={controller.store.results[0]}>
	<img src='/images/example.png'/>
</OverlayBadge>
```

### CalloutBadge

The `CalloutBadge` component displays badges inline and can be placed in any position in the Result card. 

```jsx
<CalloutBadge result={controller.store.results[0]} />
```

## Custom Badge Templates

Custom Badge Templates can be created and sync to the Searchspring Management Console using the Snapfu CLI. See [Getting Started > Setup](https://searchspring.github.io/snap/#/start-setup) for installing Snapfu.

### Initialize Custom Badges

First we'll initialize a new custom badge. The code examples on this page will use a `[badgename]` of `CustomBadge`

```sh
snapfu badges init [badgename]
```
This will create two files:

- `src/components/Badges/[badgename]/[badgename].jsx` - The jsx file is the badge component itself that will be displayed by `OverlayBadge` and `CalloutBadge`. The badge `tag`, `value`, and template `parameters` will be passed down as props.

```jsx
export const CustomBadge = observer((props) => {
	
	const { tag, value, parameters } = props;
	const {} = parameters;

	return (
		<div className={`ss__badge-custombadge ss__badge-custombadge--${tag}`}>{ value }</div>
	)
});
```

- `src/components/Badges/[badgename]/[badgename].json` - The json file describes the badge template and its parameters. See `Badge Template Parameters` section below for possible parameters.

```json
{
	"type": "snap/badge/default",
	"name": "custombadge",
	"label": "CustomBadge Badge",
	"description": "custombadge custom template",
	"component": "CustomBadge",
	"locations": [
		"left",
		"right",
		"callout"
	],
	"value": {
		"enabled": true
	},
	"parameters": []
}
```

### Syncing Custom Badges

Next we'll sync our custom badge - registering it to the Searchspring Management Console. 

```sh
snapfu badges sync [badgename]
```

### Using Custom Badges

Finally, in order to use our custom badge component, we'll need to provide a `componentMap` prop containing a mapping of our custom components to the `OverlayBadge` and `CalloutBadge` components.

```jsx
import { CustomBadge } from './components/Badges/CustomBadge';

<OverlayBadge 
	controller={controller} 
	result={controller.store.results[0]}
	componentMap={{
        'CustomBadge': () => CustomBadge
    }}
>
	<img src='/images/example.png'/>
</OverlayBadge>

<CalloutBadge 
	result={controller.store.results[0]} 
	componentMap={{
        'CustomBadge': () => CustomBadge
    }}
/>
```

The `componentMap` prop can also be used to overwrite the default badge components without the need of initializing and syncing a dedicated custom component.

### Badge Template Overview

The following badge template properties are **required**:

`type` - should not be changed. It is utilized by the Snapfu CLI when syncing

`name` - unique badge template identifier

`label` - label that is displayed when selecting this badge template within the Searchspring Management Console

`description` - badge template description

`component` - the component name this badge template should use

`locations` - a list of template locations this badge template can be placed in. This can be used to restrict certain badges to certain locations. See `Custom Badge Locations` section below for adding locations. See `Badge Template Locations` section below for possible values.

`value.enabled` - boolean that when true, required a badge `value` to be provided when using this template

`value.validations.min` - ensures `value` meets a numerical minimum or `string` / `url` length

`value.validations.max` - ensures `value` meets a numerical maximum or `string` / `url` length

`value.validations.regex` - ensures `value` meets a regex definition. Must also provide `value.validations.regexExplain`

`value.validations.regexExplain` - required if using `value.validations.regex`. Describes the regex definition and is displayed as an error message if the regex validation fails

`parameters` - a list of badge template parameters. See `Badge Template Parameters` section below for possible parameters.

### Badge Template Locations
Badge template locations is an array of strings. 

Possible values when using default locations: `left`, `left/left`, `right`, `right/right`, `callout`, `callout/callout`

Possible values when using **custom** locations: `left`, `left/[tag]`, `right`, `right/[tag]`, `callout`, `callout/[tag]`. See `Custom Badge Locations` section below for creating custom locations.

For example, if the locations.json file contains the following location definition:

```json
{
	"left": [
		{
			"tag": "left",
			"name": "Top Left"
		},
		{
			"tag": "left-bottom",
			"name": "Bottom Left"
		}
	]
}
```

To restrict a badge template to a custom location, the badge template `locations` array should contain the `tag` of the locations. Ie. `left/left-bottom`


### Badge Template Parameters
Badge template parameters is an array of objects. Each object is a template parameter and contains the following properties: 

`name` - unique badge location identifier

`type` - parameter value type. Available types: `array`, `string`, `color`, `url`, `integer`, `decimal`, `boolean`, `checkbox`, `toggle`. See example below for example usage of each type. 

`label` - label that is displayed when selecting this badge location within the Searchspring Management Console

`description` - badge location description

`defaultValue` - optional default value that will be used unless specified when configuring a new badge rule. Must be a string regardless of different `type` options.

`validations` - only applicable if `type` is `string`, `url`. `integer`, `decimal`

`validations.min` - only applicable if `type` is `integer` or `decimal`. Ensures `defaultValue` or the user defined `value` meets a numerical minimum or `string` / `url` length

`validations.max` - only applicable if `type` is `integer` or `decimal`. Ensures `defaultValue` or the user defined `value` meets a numerical maximum or `string` / `url` length

`validations.regex` - ensures `defaultValue` or the user defined `value` meets a regex definition. Must also provide `validations.regexExplain`

`validations.regexExplain` - required if using `validations.regex`. Describes the regex definition and is displayed as an error message if the regex validation fails

`options` - required if `type` is `array`. Defined a list of available values to select.

```json
{
	"parameters": [
		{
			"name": "font_size",
			"type": "array",
			"label": "Font Size",
			"description": "Select the badge font size",
			"defaultValue": "14px",
			"options": ["14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px"]
		},
		{
			"name": "prefix",
			"type": "string",
			"label": "Prefix Symbol",
			"description": "Display a prefix before the badge value. Ie. currency symbol",
			"validations": {
				"regex": "^[$€]$",
				"regexExplain": "Only $ or € currency symbols are allowed"
			}
		},
		{
			"name": "background",
			"type": "color",
			"label": "Badge background color",
			"description": "Select the badge background color",
			"defaultValue": "#0000ff"
		},
		{
			"name": "link",
			"type": "url",
			"label": "Redirect to URL on click",
			"description": "Redirect to a URL when the badge is clicked"
		},
		{
			"name": "zindex",
			"type": "integer",
			"label": "Z-index",
			"description": "Set a z-index value for the badge",
			"validations": {
				"min": -1,
				"max": 2147483647
			}
		},
		{
			"name": "opacity",
			"type": "decimal",
			"label": "Opacity",
			"description": "Badge opacity value between 0 and 1.0",
			"defaultValue": "1.0",
			"validations": {
				"min": 0,
				"max": 1
			}
		},
		{
			"name": "bold_value",
			"type": "boolean",
			"label": "Make value bold",
			"description": "Should the badge value be bold text?",
			"defaultValue": "false"
		},
		{
			"name": "show_border",
			"type": "checkbox",
			"label": "Show border",
			"description": "Display a border around the badge",
			"defaultValue": "false"
		},
		{
			"name": "show_shadow",
			"type": "toggle",
			"label": "Show shadow",
			"description": "Display a shadow behind the badge",
			"defaultValue": "true"
		}
	]
}
```

## Custom Badge Locations

Custom Badge Locations can be created and sync to the Searchspring Management Console using the Snapfu CLI. See [Getting Started > Setup](https://searchspring.github.io/snap/#/start-setup) for installing Snapfu.

We can create custom overlay and callout locations by defining a `locations.json` file in the project path: `src/components/Badges/locations.json`

`type` - should not be changed. It is utilized by the Snapfu CLI when syncing

`left`, `right`, `callout` - should not be changed and always included. `left` and `right` defined overlay locations, `callout` defined callout locations

`['left' | 'right' | 'callout'].tag` - unique badge location identifier

`['left' | 'right' | 'callout'].name` - badge location name that is displayed when selecting this location within the Searchspring Management Console

**important** - it is strongly recommended to keep the default location tags (ie. `left[0].tag="left"`, `right[0].tag="right"`, `callout[0].tag="callout"`) to ensure any existing badge rules are backwards compatible with additional locations. 

```json
{
	"type": "snap/badge/locations",
	"left": [
		{
			"tag": "left",
			"name": "Top Left"
		},
		{
			"tag": "left-bottom",
			"name": "Bottom Left"
		}
	],
	"right": [
		{
			"tag": "right",
			"name": "Top Right"
		},
		{
			"tag": "right-bottom",
			"name": "Bottom Right"
		}
	],
	"callout": [
		{
			"tag": "callout",
			"name": "Callout"
		},
		{
			"tag": "callout_secondary",
			"name": "Secondary Callout"
		}
	]
}
```