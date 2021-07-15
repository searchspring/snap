import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Pagination, PaginationProps } from './Pagination';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Pagination/readme.md';

export default {
	title: `Molecules/Pagination`,
	component: Pagination,
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
	argTypes: {
		pagination: {
			description: 'Pagination store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'pagination store object',
				},
			},
			control: { type: 'none' },
		},
		pages: {
			description:
				'Number of pages shown - recommend using an odd number as it includes the current page with an even spread to the left and right (excluding first and last)',
			table: {
				type: {
					summary: 'number',
				},
				defaultValue: { summary: 5 },
			},
			control: { type: 'number' },
		},
		pagesLeft: {
			description: 'Number of pages shown to the left (excluding first) - must be used with pagesRight',
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		pagesRight: {
			description: 'Number of pages shown to the right (excluding last) - must be used with pagesLeft',
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		nextButton: {
			description: 'Pagination next button content',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		prevButton: {
			description: 'Pagination prev button content',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		firstButton: {
			description: 'Pagination first button content',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		lastButton: {
			description: 'Pagination last button content',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		hideFirst: {
			description: 'Hide first button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideLast: {
			description: 'Hide last button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideEllipsis: {
			description: 'Hide ellipsis',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideNext: {
			description: 'Hide next button',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hidePrev: {
			description: 'Hide previous button',
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

const snapInstance = Snapify.search({ id: 'Pagination', globals: { siteId: '8uyt2m' } });

const ObservablePagination = observer(({ args, controller }) => {
	return <Pagination {...args} pagination={controller?.store?.pagination} />;
});

const Template = (args: PaginationProps, { loaded: { controller } }) => {
	return <ObservablePagination args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
