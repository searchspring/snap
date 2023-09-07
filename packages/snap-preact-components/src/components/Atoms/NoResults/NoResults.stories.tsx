import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { NoResults, NoResultsProps } from './NoResults';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: `Atoms/NoResults`,
	component: NoResults,
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
			<div style={{ maxWidth: '250px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		staticSlot: {
			description: 'Slot for overriding no results content entirely',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		hideSuggestions: {
			description: 'Hide suggestions',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
		},
		suggestionsTitleText: {
			description: 'Suggestions title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: `Suggestions` },
			},
			control: { type: 'text' },
		},
		suggestionsList: {
			description: 'list of suggestions to display',
			table: {
				type: {
					summary: 'array',
				},
			},
			control: { type: 'object' },
		},
		hideContact: {
			description: 'Hide contact section',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
		},
		contactsTitleText: {
			description: 'contact section title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: `Still can't find what you're looking for? <a href="/contact-us">Contact us</a>.` },
			},
			control: { type: 'text' },
		},
		contactsList: {
			description: 'list of contact lines to display',
			table: {
				type: {
					summary: 'array',
				},
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

export const Default = (args: NoResultsProps) => <NoResults {...args} />;
