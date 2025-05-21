## Templates Theming
Theming in Snap Templates is the primary method of customizing a template. A theme configuration defines a theme from the library to extend, theme variables, component props and responsive changes via overrides as well as global styles and product cart component specification.

```jsx
new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		styles: globalStyles,
		resultComponent: 'Result',
		variables: { ... },
		overrides: { ... },
		responsive: { ... },
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
	...
});
```

### Customizing The Theme
The project theme contains the following properties:

| Configuration Option | Description | Type | Required |
|----------------------|-------------|------|---------|
| `theme` | Theme configurations | Object | ✔️ |
| `theme.extends` | Base theme to extend | String | ✔️ |
| `theme.resultComponent` | Custom result component | String | ✔️ |
| `theme.variables` | Theme variables (colors, breakpoints, etc.) | Object | ➖ |
| `theme.style` | Global styles | Function | ➖ |
| `theme.overrides` | Component overrides | Object | ➖ |


#### Theme `extends`
The `extends` property is the base theme name to start from and will already contain variables, breakpoint overrides, and component props by default (unless choosing a blank theme)


#### Theme `resultComponent`
The `resultComponent` property allows you to specify a which product card component to use for rendering results within the theme. If using a custom component (not from the library), it must be declared in the `components` section of your configuration.


#### Theme `variables`
Each theme will have a common set of shared variables (ie. colors and breakpoints) that are compatible when switching between themes. Certain themes may contain additional variables.

```jsx
new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		variables: {
			breakpoints: { mobile: 768, tablet: 1024, desktop: 1280 },
			colors: {
				primary: '#202223',
				secondary: '#6d7175',
				accent: '#000000',
			},
		},
	},
	...
});
```

#### Theme `style`
Specifies a function that returns [emotion object styles](https://emotion.sh/docs/object-styles). This function receives theme variables as props and allows you to create styles that respond to specific breakpoints. The resulting styles are injected into the document's `<head>` element. It's important to note that these styles are scoped to the current theme by being prefixed with a class name derived from the theme's name. As a result, the styles will only affect elements that are using this particular theme.

```jsx
const globalStyles = (theme) => {
	const { variables } = theme;
	return {
		'.ss__result': {
			background: variables.color.primary,
		},
		[`@media (max-width: ${variables.breakpoints[1]}px)`]: {
			'.ss__result': {
				background: variables.color.secondary,
			},
		},
	};
};

new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		style: globalStyles,
	},
	...
});
```

#### Theme `overrides`
Themes and components provide prop their own default component prop configurations, the `overrides` property in a theme configuration allows you to customize these. It consists of three main sections:

1. `components`: Allows you to override properties of individual components.
2. `responsive`: Lets you specify different overrides for various breakpoints.


##### Theme `overrides.components`
The `components` section of `overrides` allows you to customize specific component prop overrides in your theme.


```jsx
import { css } from '@emotion/react';

new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		overrides: {
			default: {
				image: {
					lazy: false,
					style: {
						boxShadow: '2px 2px rgba(0,0,0,0.2)',
					},
				},
				button: {
					native: true,
				},
			},
		},
	},
	...
});
```


##### Theme `overrides` with Cascading Component Props
While the previous example demonstrated overriding all instances of image and button components, you may often need to target specific sub-components within a larger component or template. This is where cascading component props come into play.

Cascading component props within `overrides.components` are available as TypeScript types. It's strongly recommended to use your IDE's IntelliSense (code completion) feature to explore available cascading component prop selectors and values.

Some components contain multiple subcomponents of the same type. For instance, the `<Pagination>` component includes icons for both `<Icon name='next'>` and `<Icon name='prev'>`. To target a specific icon, you can add a "class-like" suffix to the component selector, which will target that particular icon by its `name` attribute. When named, components will contain a `ss-name` attribute in the DOM with the available name to target.

Here's an example that demonstrates targeting specific subcomponents:

```jsx
new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		overrides: {
			default: {
				'carousel icon.next': {
					icon: 'angle-right',
				},
				'carousel icon.prev': {
					icon: 'angle-left',
				},
				'autocomplete image': {
					lazy: false,
					style: {
						boxShadow: '2px 2px rgba(0,0,0,0.2)',
					},
				},
				'autocomplete button': {
					native: true,
				},
			},
		},
	},
	...
});
```

##### Responsive Theme Overrides
Responsive overrides in the `overrides` property allow you to define theme configurations for different screen sizes, such as mobile, tablet, and desktop. These settings adapt your theme to various viewport sizes, enabling responsive designs.

The breakpoints for these overrides are defined in `theme.variables.breakpoints`. For instance, if `theme.variables.breakpoints` is set to `{ mobile: 768, tablet: 1024, desktop: 1280 }`, the `mobile` overrides will apply for viewports between `0-768px`, `tablet` overrides for `769-1024px`, and `desktop` overrides for `1025-1280px`. Overrides specified in `default` apply across all screen sizes, while the active responsive overrides (based on the current viewport) take precedence.

Each responsive override object can define additional prop configurations that build on top of the `default` overrides for the applicable breakpoints.

In the following example, the number of columns for the `search results` component is adjusted for each breakpoint. The default configuration sets the number of columns to 4, but this is overridden for mobile (1 column), tablet (2 columns), and desktop (3 columns) based on the viewport size.

```jsx
new SnapTemplates({
	...
	theme: {
		extends: 'bocachica',
		overrides: {
			default: {
				'search results': {
					columns: 4,
				},
			},
			mobile: {
				'search results': {
					columns: 1,
				},
			},
			tablet: {
				'search results': {
					columns: 2,
				},
			},
			desktop: {
				'search results': {
					columns: 3,
				},
			},
		},
	},
	...
});
```
