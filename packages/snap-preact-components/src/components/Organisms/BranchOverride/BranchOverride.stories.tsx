import { h, Fragment } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { BranchOverride } from './BranchOverride';
import { componentArgs } from '../../../utilities';
import Readme from '../BranchOverride/readme.md';

export default {
	title: `Organisms/BranchOverride`,
	component: BranchOverride,
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
		(Story) => (
			<div
				style={{
					maxWidth: '900px',
					position: 'relative',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		name: {
			description: 'bundle branch name',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		details: {
			description: 'Object containing details for branch override',
			type: { required: false },
			table: {
				type: {
					summary: '{ url: string; lastModified: string }',
				},
			},
			control: { type: 'object' },
		},
		error: {
			description: 'Object containing error message and description',
			type: { required: false },
			table: {
				type: {
					summary: '{ message: string; description: string }',
				},
			},
			control: { type: 'object' },
		},
		onRemoveClick: {
			description: 'optional function to run on remove button click',
			table: {
				type: {
					summary: '(e: Event, name: string) => void',
				},
			},
			action: 'onRemoveClick',
		},
		darkMode: {
			description: 'force dark darkMode',
			type: { required: false },
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		...componentArgs,
	},
};

const Template = (args) => <BranchOverride {...args} />;

export const Auto = Template.bind({});
Auto.args = {
	name: 'next',
	details: {
		url: 'https://snapui.searchspring.io/y56s6x/next/bundle.js',
		lastModified: '1 Feb 2022 1:02:03 GMT',
	},
};

export const Dark = Template.bind({});
Dark.args = {
	name: 'next',
	details: {
		url: 'https://snapui.searchspring.io/y56s6x/next/bundle.js',
		lastModified: '1 Feb 2022 1:02:03 GMT',
	},
	darkMode: true,
};

export const Error = Template.bind({});
Error.args = {
	name: 'testing',
	error: {
		message: 'Branch not found!',
		description: 'Incorrect branch name or branch no longer exists.',
	},
};

export const Light = Template.bind({});
Light.args = {
	name: 'next',
	details: {
		url: 'https://snapui.searchspring.io/y56s6x/next/bundle.js',
		lastModified: '1 Feb 2022 1:02:03 GMT',
	},
	darkMode: false,
};