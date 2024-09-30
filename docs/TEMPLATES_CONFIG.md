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
  - Leverages Snap's existing library of components
  - Requires less development effort, ideal for quick implementations
  - Offers a more guided, configuration-based approach
  - Allows for some customization through theming and overrides


To get started, we recommend using Snapfu to initialize a project. See Getting Started section.



## Templates Config

Snap templates is entirely configuration based. The configuration defines which features are enabled and which template and theme they utilize.

Here is an example starting configuration to enable search and autocomplete using the default `bocachica` theme.

```jsx
import { SnapTemplates } from '@searchspring/snap-preact';
import { globalStyles } from './styles';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
	},
	// components: {
	// 	result: {
	// 		CustomResult: async () => (await import('./components/Result')).CustomResult,
	// 	},
	// 	badge: {
	// 		CustomPill: async () => (await import('./components/Result')).Result,
	// 	},
	// },
	themes: {
		global: {
			extends: 'bocachica',
			style: globalStyles,
			// resultComponent: 'Result',
			// variables: {
			// 	breakpoints: [0, 768, 1024, 1280],
			// },
			// overrides: {
			// 	components: {},
			// 	layoutOptions: [],
			// 	responsive: [
			// 		{
			// 			components: {},
			// 			layoutOptions: [],
			// 		},
			// 		{
			// 			components: {},
			// 			layoutOptions: [],
			// 		},
			// 		{
			// 			components: {},
			// 			layoutOptions: [],
			// 		},
			// 		{
			// 			components: {},
			// 			layoutOptions: [],
			// 		},
			// 	],
			// },
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-templates',
				component: 'Search',
				// resultComponent: 'Result',
				// theme: 'global',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input#search-input',
		targets: [
			{
				selector: 'input#search-input',
				component: 'Autocomplete',
				// resultComponent: 'Result',
				// theme: 'global',
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

The `config.config` object defines the Searchspring siteId and current localization to be used. 

If a `siteId` is not provided, the siteId found on the `bundle.js` url path will be used. For example `8uyt2m` will be used if the page contains the following script and siteId is omitted from `config.config.siteId`:

```
<script src="https://snapui.searchspring.io/8uyt2m/bundle.js" id="searchspring-context"></script>
```

It is possible to switch language and currency at run-time using methods on the TemplateStore that are exposed to the window: 
- `window.searchspring.templates.setCurrency('eud')`
- `window.searchspring.templates.setLanguage('fr')`


### Language Translations

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `translations` | Translation overrides | Object | - |
| `translations[languageCode]` | Translation overrides for specific language code | Object | - |
| `translations[languageCode][componentName]` | Translations for a specific component | Component Lang Object | - |

When defining a supported `config.language`, text translations are applied accross components in each template. It is possible to override these default text translations by using `config.translations`

In this example, we'll change the `Select` component's button label text to `'Ouvrir'` when the `'fr'` language locale is used.

```jsx
new SnapTemplates({
	...
	translations: {
		fr: {
			select: {
				buttonLabel: {
					label: 'Ouvrir'
				}
			}
		}
	},
	...
```


### Registering additional components
Snap Templates was built to intentionally not support custom preact components composing the search experience and layouts. Although in practice this is not always feasiable. At a minimum Snap Templates supports customization of the Result component and support for custom badge components. These custom result and badge components must first be register them via `config.components` before they can be applied to a target. This can be imported either synchronously or asynchronously.


| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `components` | Custom component definitions | Object | - |
| `components.badge[name]` | Custom badge component definition | Function (component) | - |
| `components.result[name]` | Custom result component definition | Function (component) | - |

```jsx
import { CustomResult } from './components/Result';

new SnapTemplates({
	...
	components: {
		result: {
			CustomResult: () => CustomResult,
			CustomResultSecondary: async () => (await import('./components/Result')).CustomResultSecondary,
		},
		badge: {
			CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	...
```

### URL Translator Configuration

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `url` | UrlTranslator configuration | UrlTranslatorConfig Object | - |

See [url translator configuration]() for more documentation


### Feature toggles

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `features` | Feature toggles | Object | - |
| `features.integratedSpellCorrection.enabled` | Enable integrated spell correction | Boolean | false |


### Templates Theming
Theming in Snap Templates is the primary method of customizing a template. 

See [Theming](https://github.com/searchspring/snap/blob/main/docs/TEMPLATES_THEMING.md) for more extensive documentation.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `themes` | Theme configurations | Object | Required |
| `themes.global` | Global theme configuration | Object | Required |
| `themes.global.extends` | Base theme to extend | String | Required |
| `themes.global.variables` | Theme variables (colors, breakpoints, etc.) | Object | - |
| `themes.global.style` | Global styles | Function | - |
| `themes.global.overrides` | Component and layout overrides | Object | - |


### Feature Targets

Feature targets are used to enable and configure various Searchspring features in a Snap Templates integration. Each feature target specifies where and how a component should be rendered on the page, along with any custom configurations or themes.

The main feature targets are:

1. Search
2. Autocomplete
3. Recommendation

Each of these feature targets has its own configuration options, allowing you to tailor the behavior and appearance of the components to your specific needs.

Each target across all features contains the following common properties:

`selector` - DOM selector where this target will inject into

`component` - The template component name to render in the target selector

`resultComponent` - The result component name that will be rendered within the target template component if that template utilizes a result component.

`theme` - The theme name that this template will use.


#### Search

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

There are three types of recommendations:

1. default
2. bundle
3. email

In addition to the defining recommendation targets, the recommendation configuration also contains the following following properties:

`settings` - Recommendation Instantiator config settings. 

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation` | Recommendation configuration | Object | - |
| `recommendation.settings` | Recommendation Instantiator Config Settings | RecommendationInstantiatorConfigSettings | - |


#### Default Recommendations

Standard product recommendation typically rendered in a carousel

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.default` | Default recommendation configurations | Object | - |
| `recommendation.default[profileComponentName]` | Configuration for a specific default recommendation profile | Object | - |
| `recommendation.default[profileComponentName].component` | Component to use for default recommendation | String | Required |
| `recommendation.default[profileComponentName].resultComponent` | Custom result component for default recommendation | String | 'Result' |
| `recommendation.default[profileComponentName].theme` | Theme to use for default recommendation | String | 'global' |


#### Bundle Recommendations

Product recommendations that require and include a seed product sku.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.bundle` | Bundle recommendation configurations | Object | - |
| `recommendation.bundle[profileComponentName]` | Configuration for a specific bundle recommendation profile | Object | - |
| `recommendation.bundle[profileComponentName].component` | Component to use for bundle recommendation | String | Required |
| `recommendation.bundle[profileComponentName].resultComponent` | Custom result component for bundle recommendation | String | 'Result' |
| `recommendation.bundle[profileComponentName].theme` | Theme to use for bundle recommendation | String | 'global' |


#### Email Recommendations

Product recommendations for external email campaigns. Email recommendations are not directly rendered via Snap on a storefront or within emails. Instead, email campains provide product recommendations by displaying images. Searchspring's email image generation service utilizes the Result component from the Snap integration to create email recommendations.

| Configuration Option | Description | Type | Default |
|----------------------|-------------|------|---------|
| `recommendation.email` | Email recommendation configurations | Object | - |
| `recommendation.email[profileComponentName]` | Configuration for a specific email recommendation profile | Object | - |
| `recommendation.email[profileComponentName].component` | Component to use for email recommendation | String | Required |
| `recommendation.email[profileComponentName].resultComponent` | Custom result component for email recommendation | String | 'Result' |
| `recommendation.email[profileComponentName].theme` | Theme to use for email recommendation | String | 'global' |
