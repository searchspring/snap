import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { NoResults, NoResultsProps } from './NoResults';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Atoms/NoResults',
	component: NoResults,
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
		contentSlot: {
			description: 'Slot for adding custom content',
			table: {
				type: {
					summary: 'string, JSX',
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
			control: { type: 'boolean' },
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
					summary: 'string[]',
				},
			},
			control: { type: 'object', defaultValue: [] },
		},
		hideContact: {
			description: 'Hide contact section',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
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
					summary: '{ title, content }[]',
				},
			},
			control: { type: 'object' },
		},
		...componentArgs,
	},
};

export const Default = (args: NoResultsProps) => <NoResults {...args} />;
