import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { AutocompleteSlideout, AutocompleteSlideoutProps } from './AutocompleteSlideout';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { AutocompleteController } from '@searchspring/snap-controller';
import { useEffect, useState } from 'preact/hooks';

export default {
	title: 'Templates/AutocompleteSlideout',
	component: AutocompleteSlideout,
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
		overlayColor: {
			defaultValue: 'rgba(0,0,0,0.0)',
			description: 'Slideout overlay color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'rgba(0,0,0,0.0)' },
			},
			control: { type: 'color' },
		},
		slideDirection: {
			defaultValue: 'left',
			description: 'Slideout slide direction',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'left' },
			},
			control: { type: 'text' },
		},
		buttonSelector: {
			description: 'Slideout button selector. (defaults to input)',
			table: {
				type: {
					summary: 'string, jsx',
				},
			},
			control: { type: 'text' },
		},
		renderInput: {
			defaultValue: true,
			description: 'render a second input inside autocomplete window that gets auto focused on open.',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
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
			table: {
				type: {
					summary:
						"['c1' | 'c2' | 'c3' | 'c4' | 'Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']",
				},
				defaultValue: { summary: "[['button.see-more'],['termsList'], ['content']]" },
			},
			control: 'array',
		},
		column1: {
			description: 'object containing width - the specified width of the column and layout - array of modules to render in the "c1" layout',
			table: {
				type: {
					summary:
						"{width: '150px', layout: ['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: ['Terms'],
					width: '150px'
				}`,
				},
			},
			control: 'array',
		},
		column2: {
			description: 'object containing width - the specified width of the column and layout - array of modules to render in the "c2" layout',
			table: {
				type: {
					summary:
						"{width: '150px', layout: ['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: ['Facets'],
					width: '150px'
				}`,
				},
			},
			control: 'array',
		},
		column3: {
			description: 'object containing width - the specified width of the column and layout - array of modules to render in the "c3" layout',
			table: {
				type: {
					summary:
						"{width: '150px', layout: ['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: [['Content'], ['_', 'SeeMore']],
					width: 'auto'
				}`,
				},
			},
			control: 'array',
		},
		column4: {
			description: 'object containing width - the specified width of the column and layout - array of modules to render in the "c4" layout',
			table: {
				type: {
					summary:
						"{width: '150px', layout: ['Terms' | 'HistoryTerms' | 'TrendingTerms'| 'SuggestedTerms'| 'Facets' | 'FacetsHorizontal' | 'SeeMore' | 'Content' | '_' | 'Banner.left' | 'Banner.banner' | 'Banner.footer' | 'Banner.header']}",
				},
			},
			control: 'array',
		},
		width: {
			defaultValue: '500px',
			description: 'Change width of the component',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '500px' },
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
		...componentArgs,
	},
};

const snapInstance = Snapify.autocomplete({
	id: 'AutocompleteSlideout',
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

export const Default = (args: AutocompleteSlideoutProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	const [inputFound, setInputFound] = useState(false);

	useEffect(() => {
		if (document.querySelector('#searchInput')) {
			setInputFound(true);
		}
	}, []);

	return inputFound ? <AutocompleteSlideout {...args} controller={controller} input={controller?.config.selector} /> : <></>;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
