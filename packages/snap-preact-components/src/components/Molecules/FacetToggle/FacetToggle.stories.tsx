import { h } from 'preact';
import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { FacetToggle, FacetToggleProps } from './FacetToggle';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: 'Molecules/FacetToggle',
	component: FacetToggle,
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
		values: {
			description: 'Facet.values store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'facet values store array',
				},
			},
			control: { type: 'none' },
		},
		facet: {
			description: 'Facet store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'facet store object',
				},
			},
			control: { type: 'none' },
		},
		label: {
			description: 'custom toggle label',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		onClick: {
			description: 'Toggle click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
		},

		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'FacetFacetToggle', globals: { siteId: '8uyt2m' } });

export const Default = (args: FacetToggleProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const sizeFacet = controller?.store?.facets.filter((facet) => facet.field == 'on_sale').pop();

	return <FacetToggle label={sizeFacet.label} {...args} values={[sizeFacet.values[0]]} />;
};
Default.args = {};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
