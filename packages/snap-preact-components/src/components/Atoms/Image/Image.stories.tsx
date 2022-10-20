import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Image, FALLBACK_IMAGE_URL, ImageProps } from './Image';
import { componentArgs } from '../../../utilities';

// unfortunatley we have to hardcode the searchresponse data here rather than use the Snap-Shared
// mockdata due to issues with storybook being unable to bundle MockData due to it using fs
const searchResponse = {
	pagination: {
		totalResults: 2,
		page: 1,
		pageSize: 30,
	},
	results: [
		{
			id: '175856',
			mappings: {
				core: {
					uid: '175856',
					price: 42,
					msrp: 50,
					url: '/product/C-LIN-W1-10049',
					thumbnailImageUrl:
						'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_thumb_med/12_14_reddress11531_thumb_med.jpg',
					imageUrl: 'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/12_14_reddress11531_large.jpg',
					name: 'Elevated Classic White Shirt Dress',
					sku: 'C-LIN-W1-10049',
					brand: 'Love In',
				},
			},
			attributes: {
				intellisuggestData: 'eJwrTs4tNM9jYEgpSi0uZnDW9fH00w031DU0MDCxZDAEQmMDBkNjA1OG9KLMFAASmQri',
				intellisuggestSignature: 'b157bdc3b1f0e7256ad18d9e2fc8a451cf4712c04c1b428d69eeecc00e075fca',
				ss_insights_quadrant: 'Poor Performer',
				gross_margin: '75',
				ss_product_type: 'Shirt',
				keywords: [
					'white Shirt Dress',
					'white Dress',
					'White',
					'Shirt Dress',
					'Dress',
					'Collared Dress',
					'Classic',
					'Business Casual',
					'Button Down',
				],
				color: ['White'],
				multi_colors: 'no',
				description:
					'Classic styles often get relegated to historic figures and classy functions. But, much like art, classic fashion comes in varying degrees of beauty. So steer clear of the avante garde, and deck yourself in the elevated classic style embodied by this lovely skirt dress. On you, it’s simultaneously cutting edge, and elegant, transcending the lower art forms to become something akin to a true masterpiece. But the dress can only take some of the credit; after all, it’s what’s inside that counts. Model is wearing a small. • 95% Cotton 5% Spandex • Hand Wash Cold • Unlined • Imported',
				title: 'Elevated Classic White Shirt Dress',
				ss_clicks: '3718',
				color_family: ['White'],
				sales_rank: '4374',
				ss_sale_price: '42',
				ss_category_hierarchy: [
					'All Sale',
					'Gifts for Her',
					'All Sale&gt;Dresses on sale',
					'All Sale&gt;50% off',
					'Gifts for Her&gt;Gifts Under $50',
				],
				on_sale: 'Yes',
				sale_price: '21',
				condition: 'New',
				product_type: ['All Sale &gt; 50% off', 'All Sale &gt; Dresses on sale', 'All Sale', 'Gifts for Her', 'Gifts for Her &gt; Gifts Under $50'],
				size: ['Small', 'Medium', 'Large'],
				material: 'Cotton',
				days_since_published: '11',
				size_dress: ['Small', 'Medium', 'Large'],
				quantity_available: '21',
				popularity: '4374',
				product_type_unigram: 'dress',
				id: 'd68bd8da07b9e98b3509412d3aa03feb',
			},
			type: '',
			custom: '',
		},
		{
			id: '174328',
			mappings: {
				core: {
					uid: '174328',
					price: 48,
					msrp: 48,
					url: '/product/C-DB-W1-13183',
					thumbnailImageUrl:
						'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_thumb_med/110_lcp_9262_copyright_loganpotterf_2016_thumb_med.jpg',
					imageUrl:
						'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/110_lcp_9262_copyright_loganpotterf_2016_large.jpg',
					name: 'Cambridge Classic White Shirt Dress',
					sku: 'C-DB-W1-13183',
					brand: 'Do+Be',
				},
			},
			attributes: {
				intellisuggestData: 'eJwrTs4tNM9jYEgpSi0uZnDWdXHSDTfUNTQ2tDBmMGQwYjA2YDA0NjBlSC_KTAEAA4MKiA',
				intellisuggestSignature: '7a96e4ecd3aad3dc4b6d31f0396eac1d082bfd7f3ed1a4d10e00b921af661f7e',
				ss_insights_quadrant: 'Over Exposed',
				gross_margin: '42',
				ss_product_type: 'Shirt',
				keywords: [
					'white',
					'white shirt',
					'button down',
					'white shirt dress',
					'shirt dress',
					'button down dress',
					'preppy',
					'blogger',
					'trendy',
					'collared dress',
				],
				color: ['White'],
				dress_length_name: 'Mini',
				multi_colors: 'no',
				description:
					'Feeling particularly “Ivy League,” but need the right tools to dress the part? Here to help you out with the right combination of sharp and smart-looking, and a touch of persnickety, is the Cambridge Classic Shirt Dress. Knock ‘em dead. Model is wearing a small. • 100% Cotton • Hand Wash Cold • Unlined • Imported',
				title: 'Cambridge Classic White Shirt Dress',
				ss_clicks: '3684',
				saturation: 'low',
				color_family: ['White'],
				sales_rank: '2844',
				ss_sale_price: '48',
				ss_category_hierarchy: [
					'All Sale',
					'All Sale&gt;40% off',
					'Gifts for Her',
					'All Sale&gt;Dresses on sale',
					'Gifts for Her&gt;Gifts Under $50',
				],
				on_sale: 'Yes',
				sale_price: '28.8',
				condition: 'New',
				product_type: ['All Sale &gt; 40% off', 'All Sale &gt; Dresses on sale', 'All Sale', 'Gifts for Her', 'Gifts for Her &gt; Gifts Under $50'],
				brightness: 'high',
				size: ['Small', 'Medium', 'Large'],
				material: 'Cotton',
				days_since_published: '35',
				dress_length: '34',
				size_dress: ['Small', 'Medium', 'Large'],
				quantity_available: '1',
				popularity: '2844',
				product_type_unigram: 'dress',
				id: '7dff0695f8916e90d43fce250731372b',
			},
		},
	],
	facets: [],
	merchandising: {},
};

import Readme from '../Image/readme.md';

export default {
	title: `Atoms/Image`,
	component: Image,
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
		(Story: any) => (
			<div
				style={{
					maxWidth: '300px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		src: {
			description: 'Image url',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		alt: {
			description: 'Image alt text',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		fallback: {
			description: 'Fallback image url',
			defaultValue: FALLBACK_IMAGE_URL,
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'string' },
			},
			control: { type: 'text' },
		},
		lazy: {
			defaultValue: true,
			description: 'Image lazy loading',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		hoverSrc: {
			description: 'Image onHover url',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		onError: {
			description: 'Image error event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onError',
		},
		onLoad: {
			description: 'Image loaded event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onLoad',
		},
		onClick: {
			description: 'Image click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onMouseOver: {
			description: 'Image mouse enter event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onMouseOver',
		},
		onMouseOut: {
			description: 'Image mouse exit event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onMouseOut',
		},
		...componentArgs,
	},
};

export const Default = (args: ImageProps) => <Image {...args} style={{ width: '100%' }} />;
Default.args = {
	src: searchResponse.results![0].mappings?.core?.imageUrl,
	alt: searchResponse.results![0].mappings?.core?.name,
};

export const BrokenImg = (args: ImageProps) => <Image {...args} style={{ width: '100%' }} />;
BrokenImg.args = {
	src: 'intentionally_broken_image.jpg',
	alt: searchResponse.results![0].mappings?.core?.name,
};

export const ManualFallBack = (args: ImageProps) => <Image {...args} style={{ width: '100%' }} />;
ManualFallBack.args = {
	src: 'intentionally_broken_image.jpg',
	alt: searchResponse.results![0].mappings?.core?.name,
	fallback: searchResponse.results![0].mappings?.core?.imageUrl,
};

export const onhover = (args: ImageProps) => <Image {...args} style={{ width: '100%' }} />;
onhover.args = {
	src: searchResponse.results![0].mappings?.core?.imageUrl,
	alt: searchResponse.results![0].mappings?.core?.name,
	hoverSrc: searchResponse.results![1].mappings?.core?.imageUrl,
};
