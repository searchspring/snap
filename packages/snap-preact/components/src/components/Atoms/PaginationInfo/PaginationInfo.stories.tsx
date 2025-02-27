import { h } from 'preact';
import { observer } from 'mobx-react-lite';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { PaginationInfo, PaginationInfoProps } from './PaginationInfo';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../PaginationInfo/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

export default {
	title: 'Atoms/PaginationInfo',
	component: PaginationInfo,
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
		controller: {
			description: 'Search Controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'Search controller object',
				},
			},
			control: { type: 'none' },
		},
		pagination: {
			description: 'Pagination store reference',
			type: { required: false },
			table: {
				type: {
					summary: 'pagination store object',
				},
			},
			control: { type: 'none' },
		},
		infoText: {
			description: 'Pagination info text to display',
			table: {
				type: {
					summary: 'string, ()=>string',
				},
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.search({ id: 'Pagination', globals: { siteId: '8uyt2m' } });

const ObservablePaginationInfo = observer(({ args, controller }: { args: PaginationInfoProps; controller: SearchController }) => {
	return <PaginationInfo {...args} pagination={controller?.store?.pagination} />;
});

export const Default = (args: PaginationInfoProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservablePaginationInfo args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
