/** @jsx h */
import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { componentArgs } from '../../../utilities';
import { Terms, TermsProps } from './Terms';
import Readme from './readme.md';
import { AutocompleteController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: `Atoms/Terms`,
	component: Terms,
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
		(Story: any) => (
			<div
				style={{
					maxWidth: '900px',
					position: 'relative',
				}}
			>
				<input
					type="text"
					id="searchInput"
					placeholder="try me!"
					autoComplete="off"
					style={{
						width: '100%',
						padding: '10px',
						boxSizing: 'border-box',
						border: '1px solid #3a23ad',
					}}
				/>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Autocomplete controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Autocomplete controller object',
				},
			},
			control: { type: 'none' },
		},
		terms: {
			description: 'Autocomplete Term store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Autocomplete Term store object',
				},
			},
			control: { type: 'none' },
		},
		title: {
			description: 'terms title',
			defaultValue: '',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		limit: {
			description: 'adjust the number of terms to show',
			defaultValue: '',
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		previewOnHover: {
			defaultValue: false,
			description: 'Invoke term preview upon focus',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		emIfy: {
			defaultValue: false,
			description: 'highlight the query matched section of the term',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onTermClick: {
			description: 'Custom onClick event handler for Terms',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onTermClick',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.autocomplete({
	id: 'Autocomplete',
	selector: '#searchInput',
	globals: {
		siteId: '8uyt2m',
	},
	settings: {
		trending: {
			limit: 5,
		},
	},
});

export const Default = (args: TermsProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	setTimeout(() => {
		controller.bind();
	});
	return <Terms {...args} controller={controller} />;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
