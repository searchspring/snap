import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';
import { LayoutSelector, LayoutSelectorProps } from './LayoutSelector';
import { ListOption } from '../../../types';

export default {
	title: 'Molecules/LayoutSelector',
	component: LayoutSelector,
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
		options: {
			description: 'layoutOptions to render',
			type: { required: true },
			table: {
				type: {
					summary: 'layoutOptions to render',
				},
			},
			control: { type: 'object' },
		},
		onSelect: {
			description: 'onSelect event handler',
			type: { required: true },
			table: {
				type: {
					summary: 'onSelect event handler',
				},
			},
			control: { type: 'none' },
		},
		type: {
			description: 'type of Select to render.',
			table: {
				type: {
					summary: '"dropdown" | "list" | "radio"',
				},
				defaultValue: { summary: 'dropdown' },
			},
			options: ['dropdown', 'list', 'radio'],
			control: {
				type: 'select',
			},
		},
		label: {
			description: 'Header label',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		selected: {
			description: 'currently selected option',
			table: {
				type: {
					summary: 'Option object',
				},
			},
			control: { type: 'none' },
		},
		showSingleOption: {
			defaultValue: false,
			description: 'specifies if the component should render if the provided options prop contains a single option',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		...componentArgs,
	},
};

const layoutOptions: ListOption[] = [
	{
		label: '1 wide',
		value: '1 wide',
		icon: 'square',
	},
	{
		label: '2 wide',
		value: '2 wide',
		icon: {
			icon: 'layout-large',
		},
	},
	{
		label: '3 wide',
		value: '3 wide',
		icon: {
			icon: 'layout-grid',
		},
	},
	{
		label: '4 wide',
		value: '4 wide',
	},
	{
		label: 'custom',
		value: 'custom',
	},
];
export const Default = (args: LayoutSelectorProps) => {
	return (
		<LayoutSelector
			{...args}
			onSelect={() => {
				console.log('');
			}}
		/>
	);
};

Default.args = {
	label: 'Layout',
	options: layoutOptions,
};

export const List = (args: LayoutSelectorProps) => {
	return (
		<LayoutSelector
			{...args}
			onSelect={() => {
				console.log('');
			}}
		/>
	);
};

List.args = {
	options: layoutOptions,
	label: 'List Layout Selector',
	type: 'list',
};

export const Radio = (args: LayoutSelectorProps) => {
	return (
		<LayoutSelector
			{...args}
			onSelect={() => {
				console.log('');
			}}
		/>
	);
};

Radio.args = {
	options: layoutOptions,
	label: 'Radio Layout Selector',
	type: 'radio',
};
