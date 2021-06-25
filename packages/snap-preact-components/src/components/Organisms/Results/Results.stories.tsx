import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Results, defaultResponsiveOptions } from './Results';
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
			defaultValue: defaultResponsiveOptions,
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
export const Grid = (props, { loaded: { controller } }) => <Results layout={Layout.GRID} results={controller?.store?.results} {...props} />;
Grid.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

export const List = (props, { loaded: { controller } }) => <Results layout={Layout.LIST} results={controller?.store?.results} {...props} />;
List.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
