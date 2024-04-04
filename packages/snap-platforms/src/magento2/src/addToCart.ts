import type { Product } from '@searchspring/snap-store-mobx';
import { getFormKey } from './getFormKey';
import { getUenc } from './getUenc';

export interface config {
	formKey?: string;
	uenc?: string;
	callback?: () => void;
	idFieldName?: string; //display.mappings.core.id
}

type line_items = {
	product_id: string;
	quantity: number;
	attributes: { name: string; val: string }[];
}[];

export const addToCart = async (data: Product[], config?: config) => {
	let form_key = config?.formKey;
	let uenc = config?.uenc;

	const line_items: line_items = [];

	if (!form_key) {
		form_key = getFormKey();
	}

	if (!uenc) {
		uenc = getUenc();
	}

	if (!data) {
		console.error('Error: no products to add');
		return false;
	}

	data.map(async (item: any) => {
		let sku: string;
		if (config?.idFieldName) {
			let level: any = item;
			config.idFieldName.split('.').map((field) => {
				if (level[field]) {
					level = level[field];
				} else {
					console.error('Error: couldnt find column in item data. please check your idFieldName is correct in the config.');
					return false;
				}
			});
			if (level && level !== item) {
				sku = level;
			} else {
				sku = item.display.mappings.core?.uid;
			}
		} else {
			sku = item.display.mappings.core?.uid;
		}

		// console.log(sku, item.quantity)
		if (sku && item.quantity) {
			const attributes: any = [];

			const json_config = item.display.attributes.json_config;
			if (json_config) {
				try {
					const parsed = JSON.parse(json_config);
					if (parsed && parsed.attributes) {
						Object.keys(parsed.attributes).map(async (att) => {
							//todo this will need to be matched up with what the selected options are on the result
							const firstOption = parsed.attributes[att].options[0].id;

							const attributeObj = {
								name: att,
								val: firstOption,
							};
							attributes.push(attributeObj);
						});
					}
				} catch (err) {}
			}

			line_items.push({
				product_id: sku,
				quantity: item.quantity as number,
				attributes: attributes,
			});
		}
	});

	if (line_items.length) {
		for (let i = 0; i < line_items.length; i++) {
			const itemData = line_items[i];
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
					console.error(`Error: Snap-plugin-magento2 addToCart responded with ${response.status}, ${response}`);
				}
			} catch (err) {
				console.error('Error:', err);
			}
		}
		if (config?.callback) {
			// console.log('here', config.callback)
			config.callback();
		} else {
			console.log('redirecting');
			setTimeout(() => (window.location.href = '/checkout/cart/'));
		}
	}
};
