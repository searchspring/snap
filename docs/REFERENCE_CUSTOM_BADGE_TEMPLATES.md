# Custom Badge Templates

Custom Badge Templates can be created and sync to the Searchspring Management Console using the Snapfu CLI. See [Welcome > Setup](https://searchspring.github.io/snap/snap-setup) for installing Snapfu

## Initialize Custom Badges

First we'll initialize a new custom badge. The code examples on this page will use a `[badgename]` of `CustomBadge`

```sh
snapfu badges init [badgename]
```
This will create two files:

- `src/components/Badges/[badgename]/[badgename].jsx` - The jsx file is the badge component itself that will be displayed by `OverlayBadge` and `CalloutBadge`. The badge `tag`, `value`, and template `parameters` will be passed down as props. If badge template parameters are going to be modifying css we recommend using `@emotion/react`, otherwise this can be removed

```jsx
import { css } from '@emotion/react';
import { observer } from 'mobx-react';

// css in js styling using dynamic template parameters
const CSS = {
	Custom: (parameters) => {
		// const { bg_color } = parameters;
		return css({
			// background: bg_color
		});
	}
};

export const CustomBadge = observer((props) => {
	
	const { tag, value, parameters } = props;

	return (
		<div css={CSS.Custom(parameters)} className={`ss__badge-custombadge ss__badge-custombadge--${tag}`}>{ value }</div>
	)
});
```

- `src/components/Badges/[badgename]/[badgename].json` - The json file describes the badge template and its parameters. See `Badge Template Parameters` section below for possible parameters

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

## Syncing Custom Badges

Next we'll sync our custom badge - registering it to the Searchspring Management Console

```sh
snapfu badges sync [badgename]
```

## Using Custom Badges

Finally in order to use a custom badge component, we'll need to provide a `componentMap` prop containing a mapping of our custom components to the `OverlayBadge` and `CalloutBadge` components

**Note:** This is not required if using the default selection of badges

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

The `componentMap` prop can also be used to overwrite the default badge components without the need of initializing and syncing a dedicated custom component

## Badge Template Overview (JSON file)

| Field | Required | Description |
|-------|----------|-------------|
| `type` | ✔️ | Should not be changed. It is utilized by the Snapfu CLI when syncing |
| `name` | ✔️ | Unique badge template identifier |
| `label` | ✔️ | Label that is displayed when selecting this badge template within the Searchspring Management Console |
| `description` | ✔️ | Badge template description |
| `component` | ✔️ | Component name this badge template should use. It should line up with the mapping provided to the `componentMap` props. See `Using Custom Badges` section above |
| `locations` | ✔️ | A list of template locations this badge template can be placed in. This can be used to restrict certain badges to certain locations. See `Custom Badge Locations` section below for adding locations. See `Badge Template Locations` section below for possible values |
| `parameters` | ✔️ | A list of badge template parameters. Can be an empty array to not contain template parameters. See `Badge Template Parameters` section below for possible parameters |
| `value.enabled` | ➖ | Boolean that when true, required a badge `value` to be provided when using this template |
| `value.validations.min` | ➖ | Ensures `value` meets a numerical minimum or string length |
| `value.validations.max` | ➖ | Ensures `value` meets a numerical maximum or string length |
| `value.validations.regex` | ➖ | Ensures `value` meets a regex definition. Must also provide `value.validations.regexExplain` |
| `value.validations.regexExplain` | ➖ | Required if using `value.validations.regex`. Describes the regex definition and is displayed as an error message if the regex validation fails |


## Badge Template Locations
Badge template locations is an array of strings

Possible values when using default locations: `left`, `left/left`, `right`, `right/right`, `callout`, `callout/callout`

Possible values when using **custom** locations: `left`, `left/[tag]`, `right`, `right/[tag]`, `callout`, `callout/[tag]`. See `Custom Badge Locations` section below for creating custom locations

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


## Badge Template Parameters
Badge template parameters is an array of objects. Each object is a template parameter and contains the following properties:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | ✔️ | string | Unique badge parameter identifier |
| `type` | ✔️ | string | Parameter value type. Available types: `array`, `string`, `color`, `url`, `integer`, `decimal`, `boolean`, `checkbox`, `toggle`. See example below for example usage of each type |
| `label` | ✔️ | string | Label that is displayed when selecting this badge parameter within the Searchspring Management Console |
| `description` | ✔️ | string | Badge parameter description |
| `options` | ✔️* | string[] | Required only if `type` is `array`. Define an array of strings containing dropdown value options |
| `defaultValue` | ➖ | string | Default value that will be used unless specified when configuring a new badge rule. Must be a string regardless of different `type` options |
| `validations` | ➖ | object | Only applicable if `type` is `string`, `url`, `integer`, `decimal` |
| `validations.min` | ➖ | number | Only applicable if `type` is `integer`, `decimal`, `string`, `url`. Should be a number (negative values also accepted). If `type` is `integer` or `decimal`, ensures `defaultValue` or the user defined `value` meets a **numerical minimum**. If `type` is `string` or `url`, ensures `defaultValue` or the user defined `value` meets a minimum **character length** |
| `validations.max` | ➖ | number | Only applicable if `type` is `integer`, `decimal`, `string`, `url`. Should be a number (negative values also accepted). If `type` is `integer` or `decimal`, ensures `defaultValue` or the user defined `value` meets a **numerical maximum**. If `type` is `string` or `url`, ensures `defaultValue` or the user defined `value` meets a maximum **character length** |
| `validations.regex` | ➖ | string | Ensures `defaultValue` or the user defined `value` meets a regex definition. Must also provide `validations.regexExplain` |
| `validations.regexExplain` | ➖ | string | Required if using `validations.regex`. Describes the regex definition and is displayed as an error message if the regex validation fails |

*Required only when `type` is `array`


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
			"name": "bg_color",
			"type": "color",
			"label": "Badge background color",
			"description": "Select the badge background color",
			"defaultValue": "rgba(0,0,255,1.0)"
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

Custom Badge Locations can be created and synced to the Searchspring Management Console using the Snapfu CLI. See [Welcome > Setup](https://searchspring.github.io/snap/snap-setup) for installing Snapfu

Custom overlay and callout locations can be created by defining a `locations.json` file in the project. It is recommended to create it at: `src/components/Badges/locations.json`

`type` - should not be changed. It is utilized by the Snapfu CLI when syncing

`left`, `right`, `callout` - should not be changed and always included

- `left` and `right` define overlay locations used by `OverlayBadge`
- `callout` define callout locations used by `CalloutBadge`

`['left' | 'right' | 'callout'].tag` - unique badge location identifier

`['left' | 'right' | 'callout'].name` - badge location name that is displayed when selecting this location within the Searchspring Management Console

**important** - it is strongly recommended to keep the default location tags (ie. `left[0].tag="left"`, `right[0].tag="right"`, `callout[0].tag="callout"`) to ensure any existing badges are backwards compatible with additional locations

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