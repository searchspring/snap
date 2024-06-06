import type { Product } from '@searchspring/snap-store-mobx';

type BigCommerceAddToCartConfig = {
	redirect?: boolean | string;
	idFieldName?: string; // display.mappings.core.id
};

type LineItem = {
	product_id: string;
	quantity: number;
	attributes: { attributeId?: string; optionId?: string }[];
};

export const addToCart = async (items: Product[], config?: BigCommerceAddToCartConfig) => {
	if (!items) {
		console.error('Error: no products to add');
		return;
	}

	const lineItems: LineItem[] = [];

	items.map((item) => {
		let id = item?.display?.mappings?.core?.uid;

		// try to find custom field in data
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
				id = level;
			}
		}

		if (id && item.quantity) {
			const productDetails: LineItem = {
				product_id: id,
				quantity: item.quantity,
				attributes: [],
			};

			const options = item.variants?.active?.options;
			if (options) {
				Object.keys(options).forEach((option) => {
					const attributeId = options[option].attributeId;
					const optionId = options[option].optionId;

					if (attributeId && optionId) {
						productDetails.attributes.push({ attributeId, optionId });
					}
				});
			}

			lineItems.push(productDetails);
		}
	});

	// first check how many products we are adding
	if (lineItems.length) {
		for (let i = 0; i < lineItems.length; i++) {
			await addSingleProductv1(lineItems[i]);
		}
	}

	// do redirect (or not)
	if (config?.redirect !== false) {
		setTimeout(() => (window.location.href = typeof config?.redirect == 'string' ? config?.redirect : '/cart.php'));
	}
};

const addSingleProductv1 = async (item: LineItem) => {
	if (!item) {
		console.error('Error: no product to add');
		return;
	}

	try {
		const formData = new FormData();
		formData.append('action', 'add');
		formData.append('product_id', `${item.product_id}`);
		formData.append('qty[]', `${item.quantity}`);
		item.attributes.forEach((attribute) => {
			formData.append(`attribute[${attribute.attributeId}]`, `${attribute.optionId}`);
		});

		const response = await fetch('/remote/v1/cart/add', {
			method: 'POST',
			body: formData,
		});

		const data = await response.json();

		if (response.status !== 200 || data?.data?.error) {
			throw new Error(`Error: addToCart responded with: ${response.status}, ${data?.data?.error || response}`);
		} else {
			return data;
		}
	} catch (err) {
		console.error(err);
	}
};
