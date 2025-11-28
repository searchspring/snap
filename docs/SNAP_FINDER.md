# Finder

To set up a product Finder using Snap, we'll need to define a finder controller in our Snap configuration. See [FinderController reference](https://searchspring.github.io/snap/reference-controller-finder) for all available configuration options. 

## Configuration
There are two types of Finder configurations, a Hierarchy and Non-Hierarchy. The difference is the type of field being used and how it is configured in the Searchspring Management Console.

Note: Ensure that the field that you will be using for Finder is marked for 'Filter' on the [Field Settings page](https://manage.searchspring.net/management/field-settings/display-fields).

Also within the Searchspring Management Console, ensure that under Site Customizations > Display Settings > Filtering, the field is set as a heiarchy display type and under advanced settings, the 'Hierarchy Delimiter' is set to the appropriate delimiter for your field.

### Hierarchy Configuration
To use a Hierarchy configuration, ensure that the config's `fields` array contain a single entry, and that the field is of type `hierarchy` in the Searchspring Management Console. Here is an example of a Hierarchy `FinderControllerConfig` object:

```js
// src/index.js

const snap = new Snap({
    client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
    controllers: {
        finder: [
            {
                config: {
					id: 'finder',
					url: '/search'
					fields: [{
						field: 'ss_tire',
						label: 'Wheel Finder',
						levels: ['Year', 'Make', 'Model', 'Wheel Size']
					}]
				},
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

### Non-Hierarchy Configuration
To use a Non-Hierarchy configuration, multiple `fields` are specified. All fields must have a `type` or `value` and NOT `hierarchy`. Facet types can be configured in the Searchspring Management Console. Here is an example of a Non-Hierarchy `FinderControllerConfig` object:

```js
// src/index.js

const snap = new Snap({
    client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
    controllers: {
        finder: [
            {
                config: {
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
				},
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

Note: When using fields that are not of hierarchy type, `levels` are not required. Specifying `levels` will display a dropdown for each hierarchy level. Finders that use hierarchy fields will enforce selecting dropdowns in order by disabling the following dropdowns. If `levels` are not defined, a single dropdown will be displayed on the initial load. Each selection will dynamically append additional dropdowns until there are no more available selections.


## Component Example

```js
// src/components/Finder/Finder.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { ControllerProvider } from '@searchspring/snap-preact-components';

export const Finder = observer((props) => {
    const { controller } = props;
	const { store } = controller;
	const { selections, loading } = store;
	const allAreSelected = selections.every((selection) => selection.selected);

    return selections?.length > 0 ? (
		<div className="ss__finder">
			<ul className="ss__finder__selections">
				{selections.map((selection, i) => (
					<li key={i}>
						<label>
							{selection.config.label}
						</label>
						<select
							onChange={(e) => {
								selection.select(e.target.value);
							}}
							disabled={loading || selection.disabled}
						>
							{selection.values?.map((value) => {
								return (
									<option key={value.value} value={value.value} selected={selection.selected === value.value}>
										{value.label}
									</option>
								);
							})}
						</select>
					</li>
				))}
			</ul>
			<div className="ss__finder__actions">
				<button
					disabled={!allAreSelected ? 'disabled' : null}
					onClick={async (e) => {
						e.preventDefault();
						e.stopPropagation();
						controller.find();
					}}
				>
					Find
				</button>
				<button
					onClick={() => {
						controller.reset();
					}}
				>
					Reset
				</button>
			</div>
		</div>
	) : null
});
```