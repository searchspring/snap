import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Autocomplete, AutocompleteProps } from './Autocomplete';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from '../Autocomplete/readme.md';
import type { AutocompleteController } from '@searchspring/snap-controller';

export default {
	title: 'Templates/Autocomplete',
	component: Autocomplete,
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
					maxWidth: '960px',
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
			description: 'Autocomplete controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Autocomplete controller object',
				},
			},
			control: { type: 'none' },
		},
		input: {
			description: 'input element reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Element or String as CSS Selector',
				},
			},
			control: { type: 'none' },
		},
		width: {
			defaultValue: '100%',
			description: 'Change width of the component',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '100%' },
			},
			control: { type: 'text' },
		},
		hideTerms: {
			defaultValue: false,
			description: 'prevent all terms from rendering (also applicable to trending and history terms)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideHistory: {
			defaultValue: false,
			description: 'prevent historical terms and results from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideTrending: {
			defaultValue: false,
			description: 'prevent trending terms and results from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		retainHistory: {
			defaultValue: false,
			description: 'allow history terms to render even when there is a query in the input',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		retainTrending: {
			defaultValue: false,
			description: 'allow trending terms to render even when there is a query in the input',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideFacets: {
			defaultValue: false,
			description: 'prevent facets from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideContent: {
			defaultValue: false,
			description: 'prevent content area from rendering',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideBanners: {
			defaultValue: false,
			description: 'prevent merchandising banners from rendering (inline banners not affected)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideLink: {
			defaultValue: false,
			description: 'prevent the "see n results for keyword" link from rendering (hideContent will also hide this)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		horizontalTerms: {
			defaultValue: false,
			description: 'display terms horizontally, (not required if vertical prop is true)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		vertical: {
			defaultValue: false,
			description: 'use a vertical (single column) layout',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		termsTitle: {
			defaultValue: '',
			description: 'Change terms header title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		trendingTitle: {
			defaultValue: 'Popular Searches',
			description: 'Change trending terms header title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Popular Searches' },
			},
			control: { type: 'text' },
		},
		historyTitle: {
			defaultValue: 'Previously Searched',
			description: 'Change historical terms header title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'Previously Searched' },
			},
			control: { type: 'text' },
		},
		facetsTitle: {
			defaultValue: '',
			description: 'Change facets header title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		contentTitle: {
			defaultValue: '',
			description: 'Change content header title',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		viewportMaxHeight: {
			defaultValue: false,
			description: 'Autocomplete fully visible in viewport',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		termsSlot: {
			description: 'Slot for custom terms component',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		facetsSlot: {
			description: 'Slot for custom facets component',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		contentSlot: {
			description: 'Slot for custom content component',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		linkSlot: {
			description: 'Slot for custom "see n results for keyword" link component',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		resultsSlot: {
			description: 'Slot for custom results component & title.',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		noResultsSlot: {
			description: 'Slot for custom no-results component.',
			table: {
				type: {
					summary: 'component',
				},
			},
			control: { type: 'none' },
		},
		breakpoints: {
			description: 'Breakpoints options object',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Breakpoint object' },
			},
			control: { type: 'none' },
		},
		onFacetOptionClick: {
			description: 'Custom onClick event handler for facet options.',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onFacetOptionClick',
		},
		onTermClick: {
			description: 'Custom onClick event handler for Suggested & Trending Terms',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onTermClick',
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

export const Default = (args: AutocompleteProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	// bind after input exists
	setTimeout(() => {
		controller.bind();
	});
	return <Autocomplete {...args} controller={controller} input={controller?.config.selector} />;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
