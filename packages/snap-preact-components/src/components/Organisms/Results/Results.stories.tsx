import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Results, ResultsProp } from './Results';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { Layout } from '../../../types';

import Readme from './readme.md';

export default {
	title: `Organisms/Results`,
	component: Results,
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
			<div
				style={{
					maxWidth: '900px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		results: {
			description: 'Results store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Results store object',
				},
			},
			control: { type: 'none' },
		},
		layout: {
			description: 'Results layout',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [Layout.GRID, Layout.LIST],
			},
		},
		responsive: {
			defaultValue: {},
			description: 'Responsive options object',
			table: {
				type: {
					summary: 'object',
				},
			},
			control: {
				type: 'object',
			},
		},
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Results', globals: { siteId: '8uyt2m' } });

const ObservableGridResults = observer(({ args, controller }) => {
	return <Results {...args} controller={controller} results={controller?.store?.results} />;
});

const GridTemplate = (args: ResultsProp, { loaded: { controller } }) => {
	return <ObservableGridResults args={args} controller={controller} />;
};

export const Grid = GridTemplate.bind({});
Grid.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

const ObservableListResults = observer(({ args, controller }) => {
	return <Results {...args} controller={controller} results={controller?.store?.results} layout={Layout.LIST} />;
});

const ListTemplate = (args: ResultsProp, { loaded: { controller } }) => {
	return <ObservableListResults args={args} controller={controller} />;
};

export const List = ListTemplate.bind({});
List.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

const responsive = {
	0: {
		numAcross: 2,
		numRows: 1,
	},
	540: {
		numAcross: 3,
		numRows: 1,
	},
	768: {
		numAcross: 4,
		numRows: 1,
	},
	991: {
		numAcross: 2,
		numRows: 2,
	},
};

const ObservableResponsiveResults = observer(({ args, controller }) => {
	return <Results {...args} controller={controller} results={controller?.store?.results} responsive={responsive} />;
});

const ResponsiveTemplate = (args: ResultsProp, { loaded: { controller } }) => {
	return <ObservableResponsiveResults args={args} controller={controller} />;
};

export const Responsive = ResponsiveTemplate.bind({});
Responsive.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
