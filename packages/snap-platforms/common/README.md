# Common Platform
This platform library gives you helper functions to use for all integrations regardless of the platform. 


## Snap Usage 
To use the platform library, simply import what you wish to use from `@searchspring/snap-platforms/common`.

```jsx
import { scrollToTop } from '@searchspring/snap-platforms/common';
const scrollToTopConfig = {
	enabled: true,
	selector: '#searchspring-layout',
}
controller.plugin(scrollToTop, scrollToTopConfig);
```

## SnapTemplates Usage
To use a plugin in [SnapTemplates](https://github.com/searchspring/snap/blob/main/docs/TEMPLATES_ABOUT.md), it can be defined and configured in the `config.plugins` section.

```jsx
const scrollToTopConfig = {
	enabled: true,
	selector: '#searchspring-layout',
}
...
plugins: {
	common: {
		scrollToTop: scrollToTopConfig
	}
}
```

## backgroundFilters
Allows you to set up background filters. You can configure filters for tags, collections, or other fields.

> [!NOTE]
> The common backgroundFilters plugin provides a generic manual way of setting background filters; however, when `shopify`, `bigcommerce` or `magento2` are defined in the `config.plugins`, additional plugins are attached to handle platform specific functionality, for example, setting `backgroundFilters`.

| Configuration Option | Description | Type | Required |
|----------------------|-------------|------|---------|
| `backgroundFilters` | Background filter configurations | Object | ➖ |
| `backgroundFilters.filters[]` | Background filter definitions | Array | ➖ |
| `backgroundFilters.filters[].type` | Defines if filter should be 'value' or 'range' type | 'value' \| 'range' | ✔️ |
| `backgroundFilters.filters[].field` | Defines filter field name | string | ✔️ |
| `backgroundFilters.filters[].value` | Defines filter value. If `type` is 'value', this must be a string, otherwise if `type` is 'range', this must be an object with `low` and `high` properties | string \| { low: number, high: number } | ✔️ |
| `backgroundFilters.filters[].controllerIds` | Defines which controllers the filter should apply to | (string \| regexp)[]  | ➖ |
| `backgroundFilters.filters[].controllerType` | Defines which controller types the filter should apply to | (string)[] | ➖ |

```jsx
const backgroundFiltersConfig = {
	filters: [{
		type: 'value',
		field: 'ss_tags',
		value: 'instock'
	},
	{
		type: 'value',
		field: 'collection',
		value: 'mens'
	},
	{
		type: 'value',
		field: 'custom',
		value: '1',
	},
	{
		type: 'range',
		field: 'price',
		value: { low: 10, high: 20 },
	}]
}
plugins: {
	common: {
		backgroundFilters: backgroundFiltersConfig
	}
}
```


## scrollToTop
Configures the behavior of scrolling to the top of the page after a search has occurred.

> [!NOTE]
> This plugin only applies to search and category pages (search controllers)

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `scrollToTop` | Scroll to top plugin configuration | Object | ➖ |
| `scrollToTop.enabled` | Enables plugin | boolean | true |
| `scrollToTop.selector` | Query selector to scroll to | string | 'body' |
| `scrollToTop.options` | [`window.scroll` options configuration](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll#options) | Object | `{ top: 0, left: 0, behavior: 'smooth' }` |

```jsx
plugins: {
	common: {
		scrollToTop: {
			enabled: true,
			selector: '#searchspring-layout',
			options: {
				top: 0,
				left: 0,
				behavior: "auto" | "instant" | "smooth"
			}
		}
	}
}
```