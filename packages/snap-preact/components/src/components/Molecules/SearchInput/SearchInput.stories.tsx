import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { SearchInput, SearchInputProps } from './SearchInput';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/SearchInput',
	component: SearchInput,
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
			<div
				style={{
					maxWidth: '900px',
					height: '300px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		value: {
			defaultValue: '',
			type: { required: true },
			description: 'sets the value for the input',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		onChange: {
			description: 'OnChange Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		onKeyUp: {
			description: 'OnKeyUp Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onKeyUp',
		},
		onKeyDown: {
			description: 'OnKeyDown Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onKeyDown',
		},
		onClick: {
			description: 'OnClick Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
		},
		submitSearchButton: {
			description: 'Button component props for submit search button',
			table: {
				type: {
					summary: `{ icon: 'search' }`,
				},
			},
			control: { type: 'object' },
		},
		clearSearchButton: {
			description: 'Button component props for clear search button',
			table: {
				type: {
					summary: `{ icon: 'close-thin' }`,
				},
			},
			control: { type: 'object' },
		},
		closeSearchButton: {
			description: 'Button component props for close search button',
			table: {
				type: {
					summary: `{}`,
				},
			},
			control: { type: 'object' },
		},
		placeholderText: {
			defaultValue: 'Search',
			description: 'Display placeholder text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Search' },
			},
			control: { type: 'text' },
		},
		inputName: {
			description: 'sets the name attribute for the input',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		disabled: {
			description: 'boolean to set disabled attribute',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'false' },
			},
			control: { type: 'boolean' },
		},
		...componentArgs,
	},
};
export const Default = (args: SearchInputProps) => <SearchInput {...args} />;

Default.args = {
	submitSearchButton: { icon: 'search' },
	clearSearchButton: { icon: 'close-thin' },
};
