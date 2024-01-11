import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';
import { ErrorType } from '@searchspring/snap-store-mobx';

import { ErrorHandler, ErrorHandlerProps } from './ErrorHandler';
import { componentArgs, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/ErrorHandler',
	component: ErrorHandler,
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
		controller: {
			description: 'Controller reference',
			table: {
				type: {
					summary: 'Controller object',
				},
			},
			control: { type: 'none' },
		},
		error: {
			description: 'Error object containing message and type',
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
			control: { type: 'none' },
			action: 'onRetryClick',
		},
		...componentArgs,
	},
};

export const Warning = (args: ErrorHandlerProps) => <ErrorHandler {...args} />;
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

export const Error = (args: ErrorHandlerProps) => <ErrorHandler {...args} />;
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

export const Info = (args: ErrorHandlerProps) => <ErrorHandler {...args} />;
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

export const CustomError = (args: ErrorHandlerProps) => <ErrorHandler {...args} />;
CustomError.args = {
	error: {
		type: ErrorType.INFO,
		message: 'Custom error using info type',
	},
};
