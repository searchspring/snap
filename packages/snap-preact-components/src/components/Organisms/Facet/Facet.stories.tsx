import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Facet, FacetProps } from './Facet';
import { iconPaths } from '../../Atoms/Icon';
import { FacetDisplay } from '../../../types';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Facet/readme.md';

export default {
	title: `Organisms/Facet`,
	component: Facet,
	parameters: {
		docs: {
			page: () => (
				<div>
					<Readme />
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '300px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		facet: {
			description: 'Facet store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'facet store object',
				},
			},
			control: { type: 'none' },
		},
		limit: {
			defaultValue: 12,
			description: 'Number of facet options to display',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 12 },
			},
			control: { type: 'number' },
		},
		disableOverflow: {
			defaultValue: false,
			description: 'Enable the use of an overflow (show more/less)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		color: {
			description: 'Select color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		iconColor: {
			description: 'Select icon color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		disableCollapse: {
			description: 'Disable collapse - used with internal state only',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		iconExpand: {
			defaultValue: 'angle-down',
			description: 'Icon for when facet is collapsed',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'angle-down' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		iconCollapse: {
			defaultValue: 'angle-up',
			description: 'Icon for when facet is expanded',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'angle-up' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		showMoreText: {
			defaultValue: 'Show More',
			description: "Change 'Show More' button text",
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Show More' },
			},
			control: { type: 'text' },
		},
		showLessText: {
			defaultValue: 'Show Less',
			description: "Change 'Show Less' button text",
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Show Less' },
			},
			control: { type: 'text' },
		},
		iconOverflowMore: {
			defaultValue: 'plus',
			description: 'Icon for when facet can show more',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'plus' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		iconOverflowLess: {
			defaultValue: 'minus',
			description: 'Icon for when facet can show less',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'minus' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		overflowSlot: {
			description: 'Slot for custom overflow (show more/less) button',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		optionsSlot: {
			description: 'Slot for custom facet option components',
			table: {
				type: {
					summary: 'component',
				},
			},
		},
		fields: {
			defaultValue: {},
			description: 'Change props per facet',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: {
				type: 'object',
			},
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Facet', globals: { siteId: '8uyt2m' } });

// List Facet

const ObservableListFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.LIST).shift()} />;
});

const ListTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableListFacet args={args} controller={controller} />;

export const List = ListTemplate.bind({});
List.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

// Slider Facet

const ObservableSliderFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.SLIDER).shift()} />;
});

const SliderTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableSliderFacet args={args} controller={controller} />;

export const Slider = SliderTemplate.bind({});
Slider.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

// Palette Facet

const ObservablePaletteFacet = observer(({ args, facet }) => {
	return <Facet {...args} facet={facet} />;
});

const PaletteTemplate = (args: FacetProps, { loaded: { controller } }) => {
	const facet = controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.PALETTE).shift();
	return <ObservablePaletteFacet args={args} facet={facet} />;
};
export const Palette = PaletteTemplate.bind({});
Palette.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

// Grid Facet

const ObservableGridFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.field === 'size_dress').pop()} />;
});

const GridTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableGridFacet args={args} controller={controller} />;
export const Grid = GridTemplate.bind({});
Grid.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

// HIERARCHY Facet

const ObservableHierarchyFacet = observer(({ args, controller }) => {
	const facet = controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.HIERARCHY).shift();
	return <Facet {...args} facet={facet} />;
});

const HierarchyTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableHierarchyFacet args={args} controller={controller} />;
export const Hierarchy = HierarchyTemplate.bind({});
Hierarchy.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
