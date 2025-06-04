import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { AutocompleteTemplate, AutocompleteTemplateProps } from './AutocompleteTemplate';
import { componentArgs, highlightedCode } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import Readme from './readme.md';
import type { AutocompleteController } from '@searchspring/snap-controller';

export default {
	title: 'Organisms/AutocompleteTemplate',
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
			table: {
				type: {
					summary:
						"['c1' | 'c2' | 'c3' | 'c4' | 'termsList' | 'terms.history' | 'terms.trending'| 'terms.suggestions'| 'facets' | 'facetsHorizontal' | 'button.see-more' | 'content' | '_' | 'banner.left' | 'banner.banner' | 'banner.footer' | 'banner.header']",
				},
				defaultValue: { summary: "[['c1','c2', 'c3']]" },
			},
			control: 'array',
		},
		column1: {
			description: 'object containing width - the specified width of the column and layout - array of modules to render in the "c1" layout',
			table: {
				type: {
					summary:
						"{width: '150px', layout: ['termsList' | 'terms.history' | 'terms.trending'| 'terms.suggestions'| 'facets' | 'facetsHorizontal' | 'button.see-more' | 'content' | '_' | 'banner.left' | 'banner.banner' | 'banner.footer' | 'banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: ['termsList'],
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
						"{width: '150px', layout: ['termsList' | 'terms.history' | 'terms.trending'| 'terms.suggestions'| 'facets' | 'facetsHorizontal' | 'button.see-more' | 'content' | '_' | 'banner.left' | 'banner.banner' | 'banner.footer' | 'banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: ['facets'],
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
						"{width: '150px', layout: ['termsList' | 'terms.history' | 'terms.trending'| 'terms.suggestions'| 'facets' | 'facetsHorizontal' | 'button.see-more' | 'content' | '_' | 'banner.left' | 'banner.banner' | 'banner.footer' | 'banner.header']}",
				},
				defaultValue: {
					summary: `{
					layout: [['content'], ['_', 'button.see-more']],
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
						"{width: '150px', layout: ['termsList' | 'terms.history' | 'terms.trending'| 'terms.suggestions'| 'facets' | 'facetsHorizontal' | 'button.see-more' | 'content' | '_' | 'banner.left' | 'banner.banner' | 'banner.footer' | 'banner.header']}",
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
	layout: [['termsList'], ['content'], ['_', 'button.see-more', '_']],
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
