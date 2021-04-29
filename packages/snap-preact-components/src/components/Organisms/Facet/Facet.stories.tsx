import { h } from 'preact';
import { observer } from 'mobx-react';

import { Facet, FacetProps } from './Facet';
import { iconPaths } from '../../Atoms/Icon';
import { FacetDisplay } from '../../../types';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Organisms/Facet`,
	component: Facet,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '300px', border: '1px solid lightgrey', padding: '8px' }}>
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
		optionsLimitCount: {
			defaultValue: 12,
			description: "Number of facet options to display before a 'show more' button appears",
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		hideIcon: {
			description: 'Hide facet header icons',
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
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });

// List Facet

const ObservableListFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.LIST).shift()} />;
});

const ListTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableListFacet args={args} controller={controller} />;

export const List = ListTemplate.bind({});
List.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

// Slider Facet

const ObservableSliderFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.SLIDER).shift()} />;
});

const SliderTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableSliderFacet args={args} controller={controller} />;

export const Slider = SliderTemplate.bind({});
Slider.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
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
	async () => ({
		controller: await snapInstance.search(),
	}),
];

// Grid Facet

const ObservableGridFacet = observer(({ args, controller }) => {
	return <Facet {...args} facet={controller?.store?.facets.filter((facet) => facet.field === 'size_dress').pop()} />;
});

const GridTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableGridFacet args={args} controller={controller} />;
export const Grid = GridTemplate.bind({});
Grid.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

// HIERARCHY Facet

const ObservableHierarchyFacet = observer(({ args, controller }) => {
	const facet = controller?.store?.facets.filter((facet) => facet.display === FacetDisplay.HIERARCHY).shift();
		return <Facet {...args} facet={facet} />;
});

const HierarchyTemplate = (args: FacetProps, { loaded: { controller } }) => <ObservableHierarchyFacet args={args} controller={controller} />;
export const Hierarchy = HierarchyTemplate.bind({});
Hierarchy.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
