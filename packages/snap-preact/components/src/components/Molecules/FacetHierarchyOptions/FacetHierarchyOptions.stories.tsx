import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { FacetHierarchyOptions, FacetHierarchyOptionsProps } from './FacetHierarchyOptions';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { FacetDisplay } from '../../../types';
import Readme from '../FacetHierarchyOptions/readme.md';
import type { SearchController } from '@searchspring/snap-controller';
import { iconPaths } from '../../Atoms/Icon';

export default {
	title: 'Molecules/FacetHierarchyOptions',
	component: FacetHierarchyOptions,
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
		values: {
			description: 'Facet.values store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'object',
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
		returnIcon: {
			description: 'return Icon name',
			table: {
				type: {
					summary: 'string',
				},
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		hideCount: {
			defaultValue: false,
			description: 'Hide facet option count',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		horizontal: {
			defaultValue: false,
			description: 'Render facet options horizontally',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		previewOnFocus: {
			description: 'Invoke facet value preview upon focus',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		valueProps: {
			description: 'Object of facet value props',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: '{}' },
			},
			control: { type: 'none' },
		},
		onClick: {
			description: 'Facet option click event handler',
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

const snapInstance = Snapify.search({ id: 'FacetHierarchyOptions', globals: { siteId: '8uyt2m' } });

const ObservableFacetHierarchyOptions = observer(({ args, controller }: { args: FacetHierarchyOptionsProps; controller: SearchController }) => {
	const hierarchyValues = controller?.store?.facets
		.filter((facet) => facet.display === FacetDisplay.HIERARCHY)
		.shift()
		.values.slice(0, 12);

	return <FacetHierarchyOptions {...args} values={hierarchyValues} />;
});

export const Default = (args: FacetHierarchyOptionsProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableFacetHierarchyOptions args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
