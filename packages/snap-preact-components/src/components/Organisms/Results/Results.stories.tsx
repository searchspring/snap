import { h } from 'preact';

import { Results, ResultsProp } from './Results';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Organisms/Results`,
	component: Results,
	decorators: [
		(Story) => (
			<div
				style={{
					margin: '8px',
					maxWidth: '900px',
					border: '1px solid lightgrey',
				}}
			>
				<Story height="200px" />
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

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });
const Template = (args: ResultsProp, { loaded: { controller } }) => <Results {...args} results={controller?.store?.results} />;

export const Grid = Template.bind({});
Grid.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Grid.args = {
	layout: 'grid',
};

export const List = Template.bind({});
List.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
List.args = {
	layout: 'list',
};
