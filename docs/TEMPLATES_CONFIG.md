## Templates

Snap Templates is an alternative method of creating a Searchspring integration. The documentation in this 'Templates' section is only applicable if you are utilizing the `SnapTemplates` export. While there is overlap across other pages in the documentation, this section aims to outline the differences.

```jsx
import { SnapTemplates } from '@searchspring/snap-preact';
```

Snap and Snap Templates offer different approaches to creating a Searchspring integration. While Snap offers more flexibility, Snap Templates provides a streamlined solution for those seeking a faster integration process with pre-designed, customizable templates.

Standard Snap:
  - Provides full control over the configuration and component tree
  - Allows for custom component creation and arrangement
  - Requires more development effort and expertise

Snap Templates:
  - Utilizes pre-built, Searchspring-managed templates and themes
  - Enables rapid integration and customization
  - Leverages Snap's existing [library of components](https://github.com/searchspring/snap/tree/main/packages/snap-preact-components)
  - Requires less development effort, ideal for quick implementations
  - Offers a more guided, configuration-based approach
  - Allows for some customization through theming and overrides



## Templates Config

Snap templates is entirely configuration based. The configuration defines which features are enabled and which template and theme they utilize.

Here is a minimal example starting configuration to enable search and autocomplete using the `bocachica` theme.

```jsx
import { SnapTemplates } from '@searchspring/snap-preact';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
	},
	themes: {
		global: {
			extends: 'bocachica',
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-templates',
				component: 'Search',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input#search-input',
		targets: [
			{
				selector: 'input#search-input',
				component: 'Autocomplete',
			},
		],
	},
});
```


### Config

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `config` | Global configuration options | Object | - |
| `config.siteId` | Searchspring Site ID | String | - |
| `config.language` | Language code for localization | String | 'en' |
| `config.currency` | Currency code for pricing | String | 'usd' |

The `config` object defines the Searchspring siteId and current localization to be used. 

If a `siteId` is not provided, the siteId found on the `bundle.js` url path will be used. For example `8uyt2m` will be used if the page contains the following script and siteId is omitted from `config.siteId`:

```
<script src="https://snapui.searchspring.io/8uyt2m/bundle.js" id="searchspring-context"></script>
```

It is possible to switch language and currency at run-time using methods on the TemplateStore that are exposed to the window: 
- `window.searchspring.templates.setCurrency('eud')`
- `window.searchspring.templates.setLanguage('fr')`


### Platform Middleware

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `platform` | Platform-specific middleware configurations | Object | - |
| `platform[platform]` | Platform-specific configurations | Object | - |
| `platform[platform].backgroundFilters` | Background filter configurations | Object | - |
| `platform[platform].scrollToTop` | Configuration for scrolling to top after search | Object | - |
| `platform[platform].storeLogger` | Configuration for store logging | Object | - |

The `platform` object allows you to configure platform-specific middleware. Currently, `shopify`, `bigcommerce`, `magento2` and `common` are supported and share the following common options:

#### backgroundFilters
Allows you to set up background filters. You can configure filters for tags, collections, or other fields.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `platform[platform].backgroundFilters` | Background filter configurations | Object | - |
| `platform[platform].backgroundFilters.filters[]` | Background filter definitions | Array | - |
| `platform[platform].backgroundFilters.filters[].type` | Defines if filter should be 'value' or 'range' type | 'value' | 'range' | true |
| `platform[platform].backgroundFilters.filters[].field` | Defines filter field name | string | - |
| `platform[platform].backgroundFilters.filters[].value` | Defines filter value. If `type` is 'value', this must be a string, otherwise if `type` is 'range', this must be an object with `low` and `high` properties | string | { low: number, high: number } | - |

```jsx
platform: {
	common: {
		backgroundFilters: {
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
			}],
		}
	}
}
```

#### scrollToTop
Configures the behavior of scrolling to the top of the page upon the 'afterStore' event

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `platform[platform].scrollToTop` | Scroll to top middleware configuration | Object | - |
| `platform[platform].scrollToTop.enabled` | Enables middleware | boolean | false |
| `platform[platform].scrollToTop.selector` | Query selector to scroll to | string | - |
| `platform[platform].scrollToTop.options` | [`window.scroll` options configuration](https://developer.mozilla.org/en-US/docs/Web/API/Window/scroll#options) | Object | `{ top: 0, left: 0, behavior: 'smooth' }` |

```jsx
platform: {
	common: {
		scrollToTop: {
			enabled: true,
			options: {
				top: 0,
				left: 0,
				behavior: "auto" | "instant" | "smooth"
			}
		}
	}
}
```

#### storeLogger
Enables logging of the store upon the 'afterStore' event

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `platform[platform].storeLogger` | Store logger middleware configuration | Object | - |
| `platform[platform].storeLogger.enabled` | Enables middleware | boolean | false |

```jsx
platform: {
	common: {
		storeLogger: {
			enabled: true
		}
	}
}
```

### Shopify Platform Middleware
In addition when platform is `shopify`, the following middleware is available:

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `platform.shopify.mutateResults` | Shopify Updating results configuration | Object | - |
| `platform.shopify.mutateResults.url` | Results URL Mutation configuration | Object | - |
| `platform.shopify.mutateResults.url.enabled` | Enables middleware | Object | - |


#### mutateResults
Enables updating the URL with search results. Product urls will be prefixed with their category route.

```jsx
platform: {
	shopify: {
		mutateResults: {
			url: {
				enabled: true
			}
		}
	}
}
```


### Language Translations

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `translations` | Translation overrides | Object | - |
| `translations[languageCode]` | Translation overrides for specific language code | Object | - |
| `translations[languageCode][componentName]` | Translations for a specific component | Component Lang Object | - |

When defining a supported `config.language`, text translations are applied accross components in each template. It is possible to override these default text translations by using `config.translations`

Translations overrides can be provided in two ways:

1. Simple translations: Use a string value for straightforward text replacements.
2. Complex translations: Utilize functions to access component props and apply logic for dynamic text generation.

The example below demonstrates both approaches for French language translations:
- The `FilterSummary` component uses a simple string translation.
- The `SearchHeader` component employs a function to generate dynamic text based on search parameters and also applies translations to the "aria-label" attribute.



```jsx
new SnapTemplates({
	...
	translations: {
		fr: {
			filterSummary: {
				title: {
					value: 'Filtres actuels'
				}
			},
			searchHeader: {
				noResultsText: {
					value: ({ pagination, search }) => {
						return `<span>${search?.query ? 'Aucun résultat trouvé pour' + search.query.string : 'Aucun résultat trouvé' }</span>`
					},
					attributes: {
						'aria-label': `Aucun résultat trouvé pour ${search?.query?.string}`,
					},
				}
			},
		}
	},
	...
```


### Registering additional components
Snap Templates was built to intentionally not support custom Preact components composing the search experience and layouts. Snap Templates supports customization of the Result component and support for custom badge components. Custom result and badge components must first be registered via `config.components` before they can be applied to a feature target. Component registration can be defined as synchronously or asynchronously function imports.



| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `components` | Custom component definitions | Object | - |
| `components.badge[name]` | Custom badge component definition | Function (component) | - |
| `components.result[name]` | Custom result component definition | Function (component) | - |

```jsx
import { SychronousCustomResult } from './components/Result';

new SnapTemplates({
	...
	components: {
		result: {
			SychronousCustomResult: () => SychronousCustomResult,
			DynamicCustomResult: async () => (await import('./components/Result')).DynamicCustomResult,
		},
		badge: {
			CustomPill: async () => (await import('./components/Badges')).CustomPill,
		},
	},
	...
```

### URL Translator Configuration

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `url` | UrlTranslator configuration | UrlTranslatorConfig Object | - |

See [UrlTranslator configuration](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) for more documentation


### Feature toggles

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `features` | Feature toggles | Object | - |
| `features.integratedSpellCorrection.enabled` | Enable integrated spell correction | Boolean | true |


### Templates Theming
Theming in Snap Templates is the primary method of customizing a template. 

See [Theming](https://github.com/searchspring/snap/blob/main/docs/TEMPLATES_THEMING.md) for more extensive documentation.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `themes` | Theme configurations | Object | Required |
| `themes.global` | Global theme configuration | Object | Required |
| `themes[customTheme]` | Custom theme configuration | Object | - |


### Feature Targets

Feature targets are used to enable and configure various Searchspring features in a Snap Templates integration. Each feature target specifies where and how a component should be rendered on the page, along with any custom configurations or themes.

Each of these feature targets has its own configuration options, allowing you to tailor the behavior and appearance of the components to your specific needs.

Each target across all features contains the following common properties:

`component` - The template component name to render in the target selector

`resultComponent` - The result component name that will be rendered within the target template component if that template utilizes a result component. Components from the library as well as any components registered via the config can be utilized here.

`theme` - The theme name that this template will use.


#### Search

In addition to the common target properties, the following properties apply to the search target(s):

`selector` - DOM selector where this target will inject into

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `search` | Search configuration | Object | - |
| `search.targets` | Search target configurations | Array | Required |
| `search.targets[].selector` | CSS selector for search target | String | Required |
| `search.targets[].component` | Component to use for search | String | Required |
| `search.targets[].resultComponent` | Custom result component | String | 'Result' |
| `search.targets[].theme` | Theme to use for search | String | 'global' |

#### Autocomplete

In addition to the common target properties, the following properties apply to the autocomplete target(s):

`selector` - DOM selector where this target will inject into

`inputSelector` - The DOM selector of the `<input>` element(s) autocomplete should bind to. Typically this will match the target `selector` value however defining an alternative value in `selector` allows the `component` to inject into a separate DOM node.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `autocomplete` | Autocomplete configuration | Object | - |
| `autocomplete.inputSelector` | CSS selector for autocomplete input | String | Required |
| `autocomplete.targets` | Autocomplete target configurations | Array | Required |
| `autocomplete.targets[].selector` | CSS selector for autocomplete target | String | Required |
| `autocomplete.targets[].component` | Component to use for autocomplete | String | 'Autocomplete' |
| `autocomplete.targets[].resultComponent` | Custom result component for autocomplete | String | 'Result' |
| `autocomplete.targets[].theme` | Theme to use for autocomplete | String | 'global' |

#### Recommendation
In addition to the defining recommendation targets, the recommendation configuration also contains the following following properties:

`settings` - Recommendation Instantiator config settings. 

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation` | Recommendation configuration | Object | - |
| `recommendation.settings` | Recommendation Instantiator Config Settings | RecommendationInstantiatorConfigSettings | - |


There are three types of recommendations:

1. default
2. bundle
3. email


#### Default Recommendations

Standard product recommendation typically rendered in a carousel

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.default` | Default recommendation configurations | Object | - |
| `recommendation.default[profileComponentName]` | Configuration for a specific default recommendation profile | Object | - |
| `recommendation.default[profileComponentName].component` | Component to use for default recommendation | String | 'Recommendation' |
| `recommendation.default[profileComponentName].resultComponent` | Custom result component for default recommendation | String | 'Result' |
| `recommendation.default[profileComponentName].theme` | Theme to use for default recommendation | String | 'global' |


#### Bundle Recommendations

Product recommendations that require and include a seed product sku.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.bundle` | Bundle recommendation configurations | Object | - |
| `recommendation.bundle[profileComponentName]` | Configuration for a specific bundle recommendation profile | Object | - |
| `recommendation.bundle[profileComponentName].component` | Component to use for bundle recommendation | String | 'RecommendationBundle' |
| `recommendation.bundle[profileComponentName].resultComponent` | Custom result component for bundle recommendation | String | 'Result' |
| `recommendation.bundle[profileComponentName].theme` | Theme to use for bundle recommendation | String | 'global' |


#### Email Recommendations

Product recommendations for external email campaigns. Email recommendations are not directly rendered via Snap on a storefront or within emails. Instead, email campaigns provide product recommendations by displaying images. Searchspring's email image generation service utilizes the `resultComponent` from the Snap integration to create email recommendations.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.email` | Email recommendation configurations | Object | - |
| `recommendation.email[profileComponentName]` | Configuration for a specific email recommendation profile | Object | - |
| `recommendation.email[profileComponentName].component` | Component to use for email recommendation | String | 'RecommendationEmail' |
| `recommendation.email[profileComponentName].resultComponent` | Custom result component for email recommendation | String | 'Result' |
| `recommendation.email[profileComponentName].theme` | Theme to use for email recommendation | String | 'global' |
