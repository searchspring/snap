import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Recommendation } from './Recommendation';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { Layout } from '../../../types';

// import Readme from './readme.md';

export default {
	title: `Organisms/Recommendation`,
	component: Recommendation,
	parameters: {
		docs: {
			page: () => (
				<div>
					{/* <Readme /> */}
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

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });
export const Default = (props, { loaded: { controller } }) => {
	console.log('controller', controller);
	console.log('controller', controller.store);
	console.log('controller', controller.store.results);
	return <Recommendation {...props} results={controller?.store?.results} />;
};
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
