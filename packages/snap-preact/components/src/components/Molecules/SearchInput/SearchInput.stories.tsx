import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { SearchInput, SearchInputProps } from './SearchInput';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';
import { iconPaths } from '../../Atoms/Icon';

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
			action: 'onChange',
		},
		onKeyDown: {
			description: 'OnKeyDown Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		onClick: {
			description: 'OnClick Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		searchIcon: {
			defaultValue: 'search',
			description: 'Search Icon name',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'search' },
			},
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		onSearchIconClick: {
			description: 'search Icon OnClick Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		clearSearchIcon: {
			description: 'clear Search Icon name',
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
		onClearSearchClick: {
			description: 'clear search Icon OnClick Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		closeSearchIcon: {
			description: 'clear Search Icon name',
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
		onCloseSearchClick: {
			description: 'close search Icon OnClick Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
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
