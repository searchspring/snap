import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Overlay, OverlayProps } from './Overlay';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../Overlay/readme.md';

export default {
	title: 'Atoms/Overlay',
	component: Overlay,
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
		active: {
			description: 'Overlay is displayed',
			type: { required: true },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: {
				type: 'boolean',
			},
		},
		color: {
			defaultValue: 'rgba(0,0,0,0.8)',
			description: 'Overlay color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'rgba(0,0,0,0.8)' },
			},
			control: { type: 'color' },
		},
		transitionSpeed: {
			defaultValue: '0.25s',
			description: 'Overlay opening/closing transition speed',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '0.25s' },
			},
			control: { type: 'text' },
		},
		onClick: {
			description: 'Overlay click event handler',
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

export const Default = (args: OverlayProps) => <Overlay {...args} />;
Default.args = {
	active: true,
};
