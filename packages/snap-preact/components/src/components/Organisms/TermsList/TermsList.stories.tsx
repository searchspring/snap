import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { TermsList, TermsListProps } from './TermsList';
import Readme from './readme.md';
import { AutocompleteController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';

export default {
	title: 'Organisms/TermsList',
	component: TermsList,
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
					position: 'relative',
				}}
			>
				<input
					type="text"
					id="searchInput"
					placeholder="try me!"
					autoComplete="off"
					style={{
						width: '100%',
						padding: '10px',
						boxSizing: 'border-box',
						border: '1px solid #3a23ad',
					}}
				/>
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'autocomplete controller reference',
			type: { required: false },
			table: {
				type: {
					summary: 'autocomplete controller object',
				},
			},
			control: { type: 'none' },
		},
		modules: {},
		historyTitle: {
			description: 'history terms title',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		suggestionTitle: {
			description: 'suggested terms title',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		trendingTitle: {
			description: 'trending terms title',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		vertical: {
			description: 'boolean to adjust if each terms wrapper should render in a vertical layout',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		retainHistory: {
			description: 'boolean to specify if the history terms should always be rendered',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		retainTrending: {
			description: 'boolean to specify if the trending terms should always be rendered',
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

const snapInstance = Snapify.autocomplete({
	id: 'Autocomplete',
	selector: '#searchInput',
	globals: {
		siteId: '8uyt2m',
	},
	settings: {
		trending: {
			limit: 5,
		},
	},
});

export const Default = (args: TermsListProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	setTimeout(() => {
		controller.bind();
	});
	return <TermsList {...args} controller={controller} />;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
