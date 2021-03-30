import { h } from 'preact';
import { observer } from 'mobx-react';

import { Facets, FacetsProps } from './Facets';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Organisms/Facets`,
	component: Facets,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '300px', border: '1px solid lightgrey', padding: '8px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		facets: {
			description: 'Facets store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Facets store object',
				},
			},
			control: { type: 'none' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });

const ObservableFacets = observer(({ args, controller }) => {
	return <Facets {...args} facets={controller?.store?.facets} />;
});

const Template = (args: FacetsProps, { loaded: { controller } }) => {
	return <ObservableFacets args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
