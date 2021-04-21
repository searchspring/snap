import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Results } from './Results';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { LayoutType } from "../../../types";

// @ts-ignore
import Readme from '../Results/readme.md';

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
					margin: '8px',
					maxWidth: '900px',
					border: '1px solid lightgrey',
				}}
			>
				<Story/>
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
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: ['grid', 'list'],
			},
		},
		...componentArgs,
	},
};

const responsive = [
	{
		viewport: 350,
		numAcross: 1,
		numRows: 5,	
			
	},
	{
		viewport: 450,
		numAcross: 2,
		numRows: 3,	
		layout: "list" as LayoutType,	
	},
	{
		viewport: 500,
		numAcross: 3,
		numRows: 2,	
	},
	{
		viewport: 600,
		numAcross: 5,
		numRows: 4,	
	},
	{
		viewport: 700,
		numAcross: 5,
	}
]

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });
export const Grid = (props, { loaded: { controller } }) => <Results layout='grid' results={controller?.store?.results} responsive={responsive} {...props}/>;
Grid.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];

export const List = (props, { loaded: { controller } }) => <Results layout='list' results={controller?.store?.results} responsive={responsive} {...props}/>;
List.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];