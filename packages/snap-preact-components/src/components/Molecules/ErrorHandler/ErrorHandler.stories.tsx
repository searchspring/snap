import { Fragment, h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import { ErrorType } from '@searchspring/snap-store-mobx';

import { ErrorHandler } from './ErrorHandler';
import { componentArgs } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: `Molecules/ErrorHandler`,
	component: ErrorHandler,
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
					height: '300px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'Controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Controller object',
				},
			},
			control: { type: 'none' },
		},
		error: {
			description: 'Error object containing message and type',
			type: { required: false },
			table: {
				type: {
					summary: 'Error object',
				},
			},
			control: { type: 'object' },
		},
		onRetryClick: {
			description: 'Retry button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onRetryClick',
		},
		...componentArgs,
	},
};

const Template = (args) => <ErrorHandler {...args} />;

export const Warning = Template.bind({});
Warning.args = {
	controller: {
		store: {
			error: {
				code: 429,
				type: ErrorType.WARNING,
				message: 'Too many requests try again later',
			},
		},
	},
};

export const Error = Template.bind({});
Error.args = {
	controller: {
		store: {
			error: {
				code: 500,
				type: ErrorType.ERROR,
				message: 'Invalid Search Request or Service Unavailable',
			},
		},
	},
};

export const Info = Template.bind({});
Info.args = {
	controller: {
		store: {
			error: {
				code: 200,
				type: ErrorType.INFO,
				message: 'Something important happened',
			},
		},
	},
};

export const CustomError = Template.bind({});
CustomError.args = {
	error: {
		type: ErrorType.INFO,
		message: 'Custom error using info type',
	},
};
