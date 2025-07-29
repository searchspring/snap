import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Facets, FacetsProps } from './Facets';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import Readme from '../Facets/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: 'Organisms/Facets',
	component: Facets,
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<div>
					<Markdown
						options={{
							overrides: {
								code: highlightedCode,
							},
						}}
					>
						{Readme}
					</Markdown>
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	decorators: [
		(Story: any) => (
			<div style={{ maxWidth: '300px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		facets: {
			description: 'Facets store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Facets store object',
				},
			},
			control: { type: 'none' },
		},
		limit: {
			description: 'Maximum number of facets to display',
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		controller: {
			description: 'Controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Controller object',
				},
			},
			control: { type: 'none' },
		},
		onFacetOptionClick: {
			description: 'Callback function for when a facet option is clicked',
			table: {
				type: { summary: 'function' },
			},
			control: { type: 'none' },
			action: 'onFacetOnClick',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Facets', globals: { siteId: '8uyt2m' } });

export const Default = (args: FacetsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <Facets {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
