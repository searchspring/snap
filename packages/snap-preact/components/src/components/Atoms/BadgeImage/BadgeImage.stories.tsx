import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { BadgeImageProps, BadgeImage } from './BadgeImage';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from '../BadgeImage/readme.md';

export default {
	title: 'Atoms/BadgeImage',
	component: BadgeImage,
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
					width: '200px',
					height: '200px',
					border: '2px dotted lightgrey',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		tag: {
			description: 'Badge location tag',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		url: {
			description: 'Badge image url',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		label: {
			description: 'Badge image alt text',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

export const Default = (args: BadgeImageProps) => <BadgeImage {...args} />;
Default.args = {
	url: '//cdn.searchspring.net/ajax_search/img/star-badge-new-blue.png',
	label: 'placeholder badge image',
};
