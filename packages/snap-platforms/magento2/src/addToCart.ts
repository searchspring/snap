import type { Product } from '@searchspring/snap-store-mobx';
import { getFormKey } from './getFormKey';
import { getUenc } from './getUenc';

export type Magento2AddToCartConfig = {
	formKey?: string;
	uenc?: string;
	redirect?: boolean | string;
	idFieldName?: string; // display.mappings.core.id
};

type LineItems = {
	product_id: string;
	quantity: number;
	attributes: { name: string; val: string }[];
}[];

export const addToCart = async (data: Product[], config?: Magento2AddToCartConfig) => {
	if (!data) {
		console.error('Error: no products to add');
		return;
	}

	const form_key = config?.formKey || getFormKey();
	const uenc = config?.uenc || getUenc();

	const lineItems: LineItems = [];

	data.map(async (item) => {
		let sku = item?.display?.mappings.core?.uid;
		if (config?.idFieldName) {
			let level: any = item;
			config.idFieldName.split('.').map((field) => {
				if (level[field]) {
					level = level[field];
				} else {
					console.error('Error: couldnt find column in item data. please check your idFieldName is correct in the config.');
					return;
				}
			});
			if (level && level !== item) {
				sku = level;
			}
		}

		if (sku && item.quantity) {
			const attributes: any = [];
			const options = item.variants?.active?.options;
			if (options) {
				Object.keys(options).forEach((option) => {
					const attrId = options[option].attributeId;
					const optionId = options[option].optionId;
					const attributeObj = {
						name: attrId,
						val: optionId,
					};
					attributes.push(attributeObj);
				});
			}
			lineItems.push({
				product_id: sku,
				quantity: item.quantity as number,
				attributes: attributes,
			});
		}
	});

	if (lineItems.length) {
		for (let i = 0; i < lineItems.length; i++) {
			const itemData = lineItems[i];
			const quantity = itemData.quantity || 1;
			const form = new FormData();
			form.append('product', itemData.product_id);
			form.append('form_key', form_key || '');
			form.append('uenc', uenc || '');
			form.append('qty', quantity.toString());

			itemData.attributes.forEach((att) => {
				form.append(`super_attribute[${att.name}]`, att.val);
			});

			try {
				const response = await fetch(
					window.location.origin + '/checkout/cart/add/uenc/' + uenc + '/product/' + itemData.product_id + '/addon_product/1/',
					{
						method: 'POST',
						body: form,
					}
				);

				if (response.status !== 200) {
					throw new Error(`Error: addToCart responded with ${response.status}, ${response}`);
				}
			} catch (err) {
				console.error('Error:', err);
			}
		}

		// do redirect (or not)
		if (config?.redirect !== false) {
			setTimeout(() => (window.location.href = typeof config?.redirect == 'string' ? config?.redirect : '/checkout/cart/'));
		}
	}
};
