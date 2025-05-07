import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { componentArgs, highlightedCode } from '../../../utilities';
import { Terms, TermsProps } from './Terms';
import Readme from './readme.md';
import { AutocompleteController } from '@searchspring/snap-controller';
import { Snapify } from '../../../utilities/snapify';
import { AutocompleteTermStore } from '@searchspring/snap-store-mobx';
import { UrlManager } from '@searchspring/snap-url-manager';

export default {
	title: 'Molecules/Terms',
	component: Terms,
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
				<Story />
			</div>
		),
	],
	argTypes: {
		controller: {
			description: 'autocomplete controller reference',
			type: { required: true },
			table: {
				type: {
					summary: 'autocomplete controller object',
				},
			},
			control: { type: 'none' },
		},
		terms: {
			description: 'autocomplete term store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'autocomplete term store object',
				},
			},
			control: { type: 'none' },
		},
		title: {
			description: 'terms title',
			type: { required: false },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		limit: {
			description: 'adjust the number of terms to show',
			type: { required: false },
			table: {
				type: {
					summary: 'number',
				},
			},
			control: { type: 'number' },
		},
		previewOnHover: {
			description: 'invoke term preview upon focus',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		emIfy: {
			description: 'highlight the query matched section of the term',
			table: {
				type: {
					summary: 'boolean',
				},
			},
			control: { type: 'boolean' },
		},
		onTermClick: {
			description: 'custom onClick event handler for Terms',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onTermClick',
		},
		vertical: {
			description: 'boolean to adjust if each term should render in a vertically',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.autocomplete({
	id: 'Autocomplete-Terms',
	selector: '#searchInput2',
	globals: {
		siteId: '8uyt2m',
	},
	settings: {
		trending: {
			limit: 5,
		},
	},
});

export const Default = (args: TermsProps, { loaded: { controller } }: { loaded: { controller: AutocompleteController } }) => {
	const mockTerms: AutocompleteTermStore = [
		{
			active: false,
			preview: () => console.log(''),
			value: 'dress',
			url: {
				href: 'www.dress.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: () => console.log(''),
			value: 'drss',
			url: {
				href: 'www.drss.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: () => console.log(''),
			value: 'dreees',
			url: {
				href: 'www.dreees.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: () => console.log(''),
			value: 'dres',
			url: {
				href: 'www.dres.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: () => console.log(''),
			value: 'dss',
			url: {
				href: 'www.dss.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: () => console.log(''),
			value: 'ress',
			url: {
				href: 'www.ress.com',
			} as UrlManager,
		},
	];

	setTimeout(() => {
		controller.bind();
	});

	return <Terms {...args} controller={controller} terms={mockTerms} />;
};

Default.loaders = [
	async () => ({
		controller: await snapInstance,
	}),
];
