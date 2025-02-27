# Common Platform
The common platform library gives you helper functions and plugins to use for all integrations regardless of the platform. 

## Plugins Usage

### Snap Config
To use the platform library in Snap, simply import what you wish to use from `@searchspring/snap-platforms/common` and connect it to the controller `config.plugins`.

```jsx
import { pluginScrollToTop } from '@searchspring/snap-platforms/common';

const scrollToTopConfig = {
	enabled: true,
	selector: '#searchspring-layout',
};

...
	{
		config: {
			id: 'search',
			plugins: [[pluginScrollToTop, scrollToTopConfig]],
			...
		},
		targeters: [...],
	}
...
```

### Snap Templates
To use a common plugin in [SnapTemplates](https://github.com/searchspring/snap/blob/main/docs/TEMPLATES_ABOUT.md), it can be defined and configured in the `config.plugins.common` section (no import necessary).

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
...
```

### Snap Controller 
To use the platform library with a controller, simply import what you wish to use from `@searchspring/snap-platforms/common`.

```jsx
import { pluginScrollToTop } from '@searchspring/snap-platforms/common';
const scrollToTopConfig = {
	enabled: true,
	selector: '#searchspring-layout',
}
controller.plugin(pluginScrollToTop, scrollToTopConfig);
```

## Plugins

### pluginAddToCart
Plugin to attach a custom function to the addToCart controller event.

> [!NOTE]
> The common addToCart plugin provides a way to handle addToCart events for custom situations. If you are using a supported platform (Shopify, Magento2 or BigCommerce), you should use the plugin specific to your platform.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | Configuration to allow for disabling the plugin | boolean | true | ➖ |
| function | Function to invoke with product and/or controller when and addToCart event occurs | (products, controller) => void \| Promise\<void\> | ➖ | ✔️ |

```jsx
const addToCartConfig = {
	function: (products, controller) => {
		controller.log.debug('adding products to the cart', products);
		// do some custom thing...
	}
}
```

### pluginBackgroundFilters
Plugin to set up background filters. You can configure background filters for tags, collections, or any other available field. Background filters can be provided via the plugin config, or through script context. Field names and values must align with data setup in the Searchspring Management Console.

> [!NOTE]
> The common backgroundFilters plugin provides a generic way for setting background filters. If you are using a supported platform (Shopify, Magento2 or BigCommerce), you should use the plugin specific to your platform.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | Configuration to allow for disabling the plugin | boolean | true | ➖ |
| filters[] | Background filter definitions | array | ➖ | ➖ |
| filters[].type | Defines if filter should be 'value' or 'range' type | 'value' \| 'range' | ➖ | ✔️ |
| filters[].field | Defines filter field name | string | ➖ | ✔️ |
| filters[].value | Defines filter value. If `type` is 'value', this must be a string, otherwise if `type` is 'range', this must be an object with `low` and `high` properties | string \| { low: number, high: number } | ➖ | ✔️ |
| filters[].controllerIds | Defines which controllers the filter should apply to | (string \| regexp)[]  | ➖ | ➖ |
| filters[].controllerTypes | Defines which controller types the filter should apply to | (string)[] | ➖ | ➖ |

```jsx
const backgroundFiltersConfig = {
	filters: [
		{
			type: 'value',
			field: 'collection',
			value: 'mens'
		},
		{
			type: 'value',
			field: 'shopper_login',
			value: '1',
		},
		{
			type: 'range',
			field: 'price',
			value: { low: 10, high: 20 },
		}
	],
}
```

The above example shows a config that can be applied to the plugin directly. This plugin also supports setting background filters via the integration script context, which allows for more dynamic background filters set within the store platform templates. The example below shows a background filter for `collection=mens` being set via the integration script context variable `backgroundFilters`.

```html
<script id="searchspring-context" src="bundle.js">
	backgroundFilters = [
		{
			type: 'value',
			field: 'collection',
			value: 'mens'
		},
	];
</script>
```

Additionaly, if not all controllers should have a specific background filter applied, there is support to apply each filter to specific controllers via `controllerIds` and `controllerTypes` configurations. When using `controllerIds` specific controller ids can be supplied or regex can be used to match on multiple controllers. The `controllerTypes` uses the `controller.type` property to filter out controllers; valid types are `search`, `autocomplete`, `recommendation`, and `finder`. The example bellow will apply the background filter to any controllers that are of type `search`.

```html
<script id="searchspring-context" src="bundle.js">
	backgroundFilters = [
		{
			type: 'value',
			field: 'collection',
			value: 'womens',
			controllerTypes: ['search'],
		},
	];
</script>
```

### pluginLogger
Adds some controller logging. Currently logs the store after every search.

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | Configuration to allow for disabling the plugin | boolean | true | ➖ |

```jsx
const loggerConfig = {
	enabled: false,
}
```

### scrollToTop
Configures the behavior of scrolling to the top of the page after a search has occurred.

> [!IMPORTANT]
> This plugin only applies to search and category pages (controllers of type `search`).

| Configuration Option | Description | Type | Default | Required |
|----------------------|-------------|------|---------|----------|
| enabled | Configuration to allow for disabling the plugin | boolean | true | ➖ |
| selector | Query selector to scroll to | string | 'body' | ➖ |
| options | [`window.scroll` options configuration](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll#options) | Object | { top: 0, left: 0, behavior: 'smooth' } | ➖ |

```jsx
const scrollToTopConfig = {
	enabled: true,
	selector: '#searchspring-layout',
	options: {
		top: 0,
		left: 0,
		behavior: "auto" | "instant" | "smooth"
	}
}
```