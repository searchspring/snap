import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { AutocompleteTemplate, AutocompleteTemplateProps } from './AutocompleteTemplate';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { AutocompleteController } from '@searchspring/snap-controller';

export default {
	title: 'Templates/AutocompleteTemplate',
	component: AutocompleteTemplate,
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
		layout: {
			description: 'array of modules to render in specified layout',
			type: { required: true },
			table: {
				type: {
					summary:
						"['C1' | 'C2' | 'C3' | 'C4' | 'Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
				defaultValue: { summary: "[['C1','C2', 'C3']]" },
			},
			control: 'array',
		},
		column1Layout: {
			description: 'array of modules to render in the "C1" layout',
			type: { required: true },
			table: {
				type: {
					summary:
						"['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
				defaultValue: { summary: "['Terms']" },
			},
			control: 'array',
		},
		column2Layout: {
			description: 'array of modules to render in the "C2" layout',
			type: { required: true },
			table: {
				type: {
					summary:
						"['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
				defaultValue: { summary: "['Facets']" },
			},
			control: 'array',
		},
		column3Layout: {
			description: 'array of modules to render in the "C3" layout',
			type: { required: true },
			table: {
				type: {
					summary:
						"['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
				defaultValue: { summary: "[['Content'], ['_', 'SeeMore']]" },
			},
			control: 'array',
		},
		column4Layout: {
			description: 'array of modules to render in the "C4" layout',
			type: { required: true },
			table: {
				type: {
					summary:
						"['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
			},
			control: 'array',
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
		excludeBanners: {
			defaultValue: false,
			description: 'automatically add merchandising banners',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
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

export const Default = (args: AutocompleteTemplateProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	// bind after input exists
	setTimeout(() => {
		controller.bind();
	});
	return <AutocompleteTemplate {...args} controller={controller} input={controller?.config.selector} />;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];

export const Slim = (args: AutocompleteTemplateProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	// bind after input exists
	setTimeout(() => {
		controller.bind();
	});
	return <AutocompleteTemplate {...args} controller={controller} input={controller?.config.selector} />;
};

Slim.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];

Slim.args = {
	layout: [['TermsList'], ['Content'], ['_', 'Button.see-more', '_']],
	width: '400px',
	theme: {
		components: {
			results: {
				columns: 2,
				rows: 1,
			},
		},
	},
};
