import { h } from 'preact';
import { observer } from 'mobx-react';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
import type { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';

import { VariantSelection, VariantSelectionProps } from './VariantSelection';
import { componentArgs } from '../../../utilities';
import Readme from '../VariantSelection/readme.md';
import { Snapify } from '../../../utilities/snapify';
import { Product } from '@searchspring/snap-store-mobx';
import { Next } from '@searchspring/snap-event-manager';
import { SearchResponseModel } from '@searchspring/snapi-types';

export default {
	title: `Molecules/VariantSelection`,
	component: VariantSelection,
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
			<div style={{ maxWidth: '350px' }}>
				<Story />
			</div>
		),
	],
	argTypes: {
		selection: {
			description: 'Variant Selection reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Variant Selection reference',
				},
			},
			control: { type: 'object' },
		},
		type: {
			description: 'selection type',
			table: {
				type: {
					summary: 'selection type',
				},
				defaultValue: { summary: 'dropdown' },
			},
			// control: {
			// 	type: 'select',
			// 	options: ['dropdown', 'list', 'swatches'],
			// },
		},
		onSelect: {
			description: 'onSelect callback',
			table: {
				type: {
					summary: 'function(e: React.MouseEvent<HTMLElement, MouseEvent>, option: ListOption)',
				},
			},
			action: 'onSelect',
		},
		hideSelectedOptionParentheses: {
			defaultValue: false,
			description: 'Hide selected option parenthesis',
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

const ObservableSelection = observer(({ args }: { args: VariantSelectionProps }) => {
	return <VariantSelection {...args} />;
});

export const List = (args: VariantSelectionProps) => {
	return <ObservableSelection args={args} />;
};

export const Swatches = (args: VariantSelectionProps) => {
	return <ObservableSelection args={args} />;
};

const values = [
	{
		value: 'Rainbow',
		label: 'Rainbow',
		available: true,
		background: `linear-gradient(
			90deg,
			rgba(255, 0, 0, 1) 0%,
			rgba(255, 154, 0, 1) 10%,
			rgba(208, 222, 33, 1) 20%,
			rgba(79, 220, 74, 1) 30%,
			rgba(63, 218, 216, 1) 40%,
			rgba(47, 201, 226, 1) 50%,
			rgba(28, 127, 238, 1) 60%,
			rgba(95, 21, 242, 1) 70%,
			rgba(186, 12, 248, 1) 80%,
			rgba(251, 7, 217, 1) 90%,
			rgba(255, 0, 0, 1) 100%
		)`,
	},
	{ value: 'Red', label: 'Red', available: true },
	{ value: 'Blue', label: 'Blue', available: true },
	{ value: 'Green', label: 'Green', available: false },
	{ value: 'Orange', label: 'Orange', available: true },
	{ value: 'Tan', label: 'Tan', available: true },
	{
		value: 'Chambray',
		label: 'Chambray',
		available: true,
		background:
			"url('data:image/jpeg;base64,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')",
	},
];

const config: SearchControllerConfig = {
	id: 'searchVariants',
	globals: {
		siteId: '8uyt2m',
	},
	settings: {
		variants: {
			field: 'ss_variants',
		},
	},
};

const snapInstance = Snapify.search(config);

export const Dropdown = (props: VariantSelectionProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	const selection = (controller.store.results[0] as Product).variants?.selections[0];
	return <VariantSelection {...props} selection={selection!} />;
};

Dropdown.loaders = [
	async () => {
		snapInstance.on('afterSearch', async ({ response }: { response: SearchResponseModel }, next: Next) => {
			if (response.results?.length) {
				// @ts-ignore stupid typing
				response.results[0].attributes.ss_variants =
					'[{"mappings":{"core":{"uid":44204136300802,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-32-30","url":"/products/fort-chino-pants?variant=44204136300802","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 30 / 32","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"30"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136333570,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-34-30","url":"/products/fort-chino-pants?variant=44204136333570","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 30 / 34","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"30"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136366338,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-32-32","url":"/products/fort-chino-pants?variant=44204136366338","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 32 / 32","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"32"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136399106,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-34-32","url":"/products/fort-chino-pants?variant=44204136399106","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 32 / 34","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"32"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136431874,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-32-34","url":"/products/fort-chino-pants?variant=44204136431874","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 34 / 32","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"34"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136464642,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-34-34","url":"/products/fort-chino-pants?variant=44204136464642","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610055_outerknown_fortchinopants_sct_F_pdp_1400x1400_f953fa33-a0ae-4186-8214-c8802b5455c7.jpg?v=1706131359"}},"attributes":{"quantity":20,"title":"Scout / 34 / 34","available":true},"options":{"color":{"value":"Scout"},"size":{"value":"34"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136497410,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-32-36","url":"/products/fort-chino-pants?variant=44204136497410"}},"attributes":{"quantity":0,"title":"Scout / 36 / 32","available":false},"options":{"color":{"value":"Scout"},"size":{"value":"36"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136530178,"msrp":"59.99","price":"54.99","sku":"1610060-SCT-34-36","url":"/products/fort-chino-pants?variant=44204136530178"}},"attributes":{"quantity":0,"title":"Scout / 36 / 34","available":false},"options":{"color":{"value":"Scout"},"size":{"value":"36"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136562946,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-32-30","url":"/products/fort-chino-pants?variant=44204136562946"}},"attributes":{"quantity":0,"title":"Desert / 30 / 32","available":false},"options":{"color":{"value":"Desert"},"size":{"value":"30"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136595714,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-34-30","url":"/products/fort-chino-pants?variant=44204136595714","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367"}},"attributes":{"quantity":20,"title":"Desert / 30 / 34","available":true},"options":{"color":{"value":"Desert"},"size":{"value":"30"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136628482,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-32-32","url":"/products/fort-chino-pants?variant=44204136628482"}},"attributes":{"quantity":0,"title":"Desert / 32 / 32","available":false},"options":{"color":{"value":"Desert"},"size":{"value":"32"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136661250,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-34-32","url":"/products/fort-chino-pants?variant=44204136661250","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367"}},"attributes":{"quantity":20,"title":"Desert / 32 / 34","available":true},"options":{"color":{"value":"Desert"},"size":{"value":"32"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136694018,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-32-34","url":"/products/fort-chino-pants?variant=44204136694018"}},"attributes":{"quantity":0,"title":"Desert / 34 / 32","available":false},"options":{"color":{"value":"Desert"},"size":{"value":"34"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136726786,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-34-34","url":"/products/fort-chino-pants?variant=44204136726786","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367"}},"attributes":{"quantity":20,"title":"Desert / 34 / 34","available":true},"options":{"color":{"value":"Desert"},"size":{"value":"34"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136759554,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-32-36","url":"/products/fort-chino-pants?variant=44204136759554"}},"attributes":{"quantity":0,"title":"Desert / 36 / 32","available":false},"options":{"color":{"value":"Desert"},"size":{"value":"36"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136792322,"msrp":"59.99","price":"59.99","sku":"1610060-DSR-34-36","url":"/products/fort-chino-pants?variant=44204136792322","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_DSR_1_a23dc4be-a162-4b04-a70e-93cd99569115.jpg?v=1706131367"}},"attributes":{"quantity":20,"title":"Desert / 36 / 34","available":true},"options":{"color":{"value":"Desert"},"size":{"value":"36"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136825090,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-32-30","url":"/products/fort-chino-pants?variant=44204136825090"}},"attributes":{"quantity":0,"title":"Mirage / 30 / 32","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"30"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136857858,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-34-30","url":"/products/fort-chino-pants?variant=44204136857858"}},"attributes":{"quantity":0,"title":"Mirage / 30 / 34","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"30"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136890626,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-32-32","url":"/products/fort-chino-pants?variant=44204136890626"}},"attributes":{"quantity":0,"title":"Mirage / 32 / 32","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"32"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136923394,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-34-32","url":"/products/fort-chino-pants?variant=44204136923394"}},"attributes":{"quantity":0,"title":"Mirage / 32 / 34","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"32"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204136956162,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-32-34","url":"/products/fort-chino-pants?variant=44204136956162"}},"attributes":{"quantity":0,"title":"Mirage / 34 / 32","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"34"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204136988930,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-34-34","url":"/products/fort-chino-pants?variant=44204136988930"}},"attributes":{"quantity":0,"title":"Mirage / 34 / 34","available":false},"options":{"color":{"value":"Mirage"},"size":{"value":"34"},"inseam":{"value":"34"}}},{"mappings":{"core":{"uid":44204137021698,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-32-36","url":"/products/fort-chino-pants?variant=44204137021698","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_MRG_1_2c30c0cd-a068-4aaa-bd53-f0996db3a241.jpg?v=1706131376","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_MRG_1_2c30c0cd-a068-4aaa-bd53-f0996db3a241.jpg?v=1706131376"}},"attributes":{"quantity":20,"title":"Mirage / 36 / 32","available":true},"options":{"color":{"value":"Mirage"},"size":{"value":"36"},"inseam":{"value":"32"}}},{"mappings":{"core":{"uid":44204137054466,"msrp":"59.99","price":"49.99","sku":"1610060-MRG-34-36","url":"/products/fort-chino-pants?variant=44204137054466","imageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_MRG_1_2c30c0cd-a068-4aaa-bd53-f0996db3a241.jpg?v=1706131376","thumbnailImageUrl":"https://cdn.shopify.com/s/files/1/0677/2424/7298/files/1610060_Fort_Chino_Pants_MRG_1_2c30c0cd-a068-4aaa-bd53-f0996db3a241.jpg?v=1706131376"}},"attributes":{"quantity":20,"title":"Mirage / 36 / 34","available":true},"options":{"color":{"value":"Mirage"},"size":{"value":"36"},"inseam":{"value":"34"}}}]';
			}
			await next();
		});
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

Dropdown.args = {
	type: 'dropdown',
};

List.args = {
	selection: {
		select: (e: any) => {
			console.log('selected', e);
		},
		previouslySelected: '',
		field: 'color',
		label: 'color',
		selected: { value: 'Chambray', label: 'Chambray', available: true },
		values: values,
	},
	type: 'list',
};

Swatches.args = {
	selection: {
		select: (e: any) => {
			console.log('selected', e);
		},
		previouslySelected: '',
		field: 'color',
		label: 'color',
		selected: { value: 'Chambray', label: 'Chambray', available: true },
		values: values,
	},
	type: 'swatches',
};
