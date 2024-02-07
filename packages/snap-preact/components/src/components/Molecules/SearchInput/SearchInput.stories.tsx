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
		onChange: {
			description: 'Onchange Callback',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onChange',
		},
		hideIcon: {
			description: 'Hides icon',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		placeholder: {
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
		...componentArgs,
	},
};
export const Default = (args: SearchInputProps) => <SearchInput {...args} />;
