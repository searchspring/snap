## Templates Theming
Theming in Snap Templates is the primary method of customizing a template. 

A theme configuration defines theme variables, component props, breakpoint changes, global styles, and layout behaviours. 

Each feature target in Snap templates can only have a single theme applied to it at a given time. When defining a theme in `config.themes`, the key is the theme name. In the following example we define two themes: `global` and `customTheme`

By default, a theme named `global` must always be defined and should be used if only a single theme is applicable to the implementation. The `global` theme is applied if a target does not explicitly define which theme to use via `target.theme`. In the following example we'll specify our autocomplete target to use `customTheme` and our search target to use the `global` theme.

```jsx
new SnapTemplates({
	...
	themes: {
		global: {
			extends: 'bocachica',
		},
		customTheme: {
			extends: 'bocachica',
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-templates',
				component: 'Search',
				theme: 'global', // can be omitted if value is 'global'
			},
		],
	},
	autocomplete: {
		inputSelector: 'input#search-input',
		targets: [
			{
				selector: 'input#search-input',
				component: 'Autocomplete',
				theme: 'customTheme',
			},
		],
	},
	...
});
```

### Creating a theme
Each theme contains the following properties:

| Configuration Option | Description | Type | Required |
|----------------------|-------------|------|---------|
| `themes` | Theme configurations | Object | ✔️ |
| `themes.global` | Global theme configuration | Object | ✔️ |
| `themes[customTheme]` | Custom theme configuration | Object | ✔️ |
| `themes.global.extends` | Base theme to extend | String | ✔️ |
| `themes.global.resultComponent` | Custom result component | String | ➖ |
| `themes.global.variables` | Theme variables (colors, breakpoints, etc.) | Object | ➖ |
| `themes.global.style` | Global styles | Function | ➖ |
| `themes.global.overrides` | Component and layout overrides | Object | ➖ |


> [!NOTE]
> These configurations are also applicable to themes that are not the `global` theme. Ie. `themes.customTheme`


#### Theme `extends`
The `extends` property is the base theme name to start from and will already contain variables, breakpoint overrides, and component props by default (unless choosing a blank theme)


#### Theme `resultComponent`
The `resultComponent` property allows you to specify a custom component for rendering results within a theme. If not defined, the default `Result` component will be used. You can set this property at the theme level to establish a default for all features using that theme. If using a custom component, it must be declared in the `components` section of your configuration.


#### Theme `variables`
Each theme will have a common set of shared variables (ie. colors and breakpoints) that are compatible when switching between themes. Certain themes may contain additional variables.

```jsx
new SnapTemplates({
	...
	themes: {
		global: {
			extends: 'bocachica',
			variables: {
				breakpoints: [768, 1024, 1280],
				colors: {
					primary: '#202223',
					secondary: '#6d7175',
					accent: '#000000',
				},
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
	themes: {
		global: {
			extends: 'bocachica',
			style: globalStyles,
		},
	},
	...
});
```

#### Theme `overrides`
Themes and components provide prop their own default component prop configurations, the `overrides` property in a theme configuration allows you to customize these. It consists of three main sections:

1. `components`: Allows you to override properties of individual components.
2. `layoutOptions`: Enables you to define custom layout options.
3. `responsive`: Lets you specify different overrides for various breakpoints.


##### Theme `overrides.components`
The `components` section of `overrides` allows you to customize specific component prop overrides in your theme.


```jsx
import { css } from '@emotion/react';

new SnapTemplates({
	...
	themes: {
		global: {
			extends: 'bocachica',
			overrides: {
				components: {
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
	themes: {
		global: {
			extends: 'bocachica',
			overrides: {
				components: {
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
	},
	...
});
```


##### Theme `overrides.layoutOptions`

The `layoutOptions` section in `overrides` allows you to define custom layout configurations for your theme. These options are used by the `LayoutSelector` component to provide selectable layouts, such as toggling between grid and list views on a product listing page. When a layout is selected, it applies a set of predefined component prop overrides, enabling different visual arrangements or styles for your components.

```jsx
new SnapTemplates({
	...
	themes: {
		global: {
			extends: 'bocachica',
			overrides: {
				layoutOptions: [
					{
						value: 'grid',
						label: 'Grid',
						default: true,
						overrides: {
							components: {
								results: {
									layout: 'grid',
								},
							},
						},
					},
					{
						value: 'list',
						label: 'List',
						overrides: {
							components: {
								results: {
									layout: 'list',
								},
							},
						},
					},
				],
			},
		},
	},
	...
});
```

##### Theme `overrides.responsive`
The `responsive` section in `overrides` allows you to define responsive configurations for your theme. These configurations are applied based on the current viewport size, enabling you to create responsive designs that adapt to different screen sizes. 

The breakpoint values are defined in the theme's `variables.breakpoints`. For example, if you have `variables.breakpoints: [768, 1024, 1280]`, you would need to provide an array of 3 objects in `overrides.responsive`, corresponding to each breakpoint.

Each object in the `responsive` array follows the same structure as the `overrides` interface. 

In this example, we'll hide the `layoutOptions` for the first two breakpoints (mobile and tablet) and set various results columns.

```jsx
new SnapTemplates({
	...
	themes: {
		global: {
			extends: 'bocachica',
			overrides: {
				layoutOptions: [
					{
						value: 'grid',
						label: 'Grid',
						default: true,
						overrides: {
							components: {
								results: {
									layout: 'grid',
								},
							},
						},
					},
					{
						value: 'list',
						label: 'List',
						overrides: {
							components: {
								results: {
									layout: 'list',
								},
							},
						},
					},
				],
				responsive: [
					{
						layoutOptions: [],
						components: {
							results: {
								columns: 1,
							},
						},
					},
					{
						layoutOptions: [],
						components: {
							results: {
								columns: 2,
							},
						},
					},
					{
						components: {
							results: {
								columns: 3,
							},
						},
					},
				]
			},
		},
	},
	...
});
```
