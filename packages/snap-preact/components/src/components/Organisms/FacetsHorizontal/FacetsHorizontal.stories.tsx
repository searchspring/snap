import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { FacetsHorizontal, FacetsHorizontalProps } from './FacetsHorizontal';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { iconPaths } from '../../Atoms/Icon';
import Readme from '../FacetsHorizontal/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: 'Organisms/FacetsHorizontal',
	component: FacetsHorizontal,
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
			defaultValue: 6,
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 6 },
			},
			control: { type: 'number' },
		},
		alwaysShowFiltersButton: {
			defaultValue: false,
			description: 'Always render MobileSidebar regardless of facet overflow set my limit prop',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		overlay: {
			defaultValue: false,
			description: 'Render facet options as a dropdown overlay',
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
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
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'FacetsHorizontal', globals: { siteId: '8uyt2m' } });

export const Default = (args: FacetsHorizontalProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <FacetsHorizontal {...args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
