# Finder

To set up a product Finder using Snap, we'll need to define a finder controller in our Snap configuration. See FinderController section for all available configuration options. 

## Configuration
There are two types of Finder configurations, a Hierarchy and Non-Hierarchy. The difference is the type of field being used and how it is configured in the Searchspring Management Console.

### Hierarchy Configuration
To use a Hierarchy configuration, ensure that the config's `fields` array contain a single entry, and that the field is of type `hierarchy` in the Searchspring Management Console. Here is an example of a Hierarchy `FinderControllerConfig` object:

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search'
	fields: [{
		field: 'ss_tire',
		label: 'Wheel Finder',
		levels: ['Year', 'Make', 'Model', 'Wheel Size']
	}]
}
```

### Non-Hierarchy Configuration
To use a Non-Hierarchy configuration, multiple `fields` are specified. All fields must have a `type` or `value` and NOT `hierarchy`. Facet types can be configured in the Searchspring Management Console. Here is an example of a Non-Hierarchy `FinderControllerConfig` object:

```typescript
const finderConfig = {
	id: 'finder',
	url: '/search',
	fields: [
		{ 
			field: 'custom_wheel_size',
			label: 'Size'
		}, 
		{ 
			field: 'custom_wheel_width',
			label: 'Width'
		}, 
		{ 
			field: 'custom_wheel_bolt_pattern',
			label: 'Bolt Pattern'
		}, 
		{ 
			field: 'custom_color',
			label: 'Color'
		}
	]
};
```

Note: When using fields that are not of hierarchy type, `levels` are not required. Specifying `levels` will display a dropdown for each hierarchy level. Finders that use hierarchy fields will enforce selecting dropdowns in order by disabling the following dropdowns. If `levels` are not defined, a single dropdown will be displayed on the initial load. Each selection will dynamically append additional dropdowns until there are no more available selections.

```ts
// src/index.ts

const snap = new Snap({
    client: {
		globals: {
			siteId: 'abc123',
		},
	},
    controllers: {
        finder: [
            {
                config: finderConfig
                targeters: [
                    {
                        selector: '#searchspring-finder',
                        component: async () => {
                            return (await import('./components/Finder/Finder')).Finder;
                        },
                    },
                ],
            },
        ],
    },
});
```

