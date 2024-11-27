import type { Product } from '@searchspring/snap-store-mobx';

export type ShopifyAddToCartConfig = {
	redirect?: boolean | string;
	idFieldName?: string; // display.mappings.core.id
};

declare global {
	interface Window {
		Shopify: any;
	}
}

type FormData = {
	items: {
		id: number;
		quantity: number;
	}[];
};

export const addToCart = async (data: Product[], config?: ShopifyAddToCartConfig) => {
	if (!window.Shopify) {
		console.error('Error: window.Shopify not found');
		return;
	}

	if (!data) {
		console.error('Error: no products to add');
		return;
	}

	const formData: FormData = {
		items: [],
	};

	data.map((item) => {
		let id = Number(item?.display?.mappings.core?.uid);
		if (config?.idFieldName) {
			let level: any = item;
			config.idFieldName.split('.').map((field) => {
				if (level && level[field]) {
					level = level[field];
				} else {
					console.error('Error: couldnt find column in item data. please check your idFieldName is correct in the config.');
				}
			});
			if (level && level !== item) {
				id = level;
			}
		}

		// cast as number
		if (id?.toString().match(/^[0-9]+$/)) {
			id = +id;
		}

		if (id && item.quantity) {
			const obj = {
				id: id,
				quantity: item.quantity,
			};

			formData.items.push(obj);
		}
	});

	try {
		const response = await fetch(window?.Shopify?.routes?.root + 'cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.status === 200) {
			// do redirect (or not)
			if (config?.redirect !== false) {
				setTimeout(() => (window.location.href = typeof config?.redirect == 'string' ? config?.redirect : '/cart'));
			}
		} else {
			throw new Error(`Error: addToCart responded with ${response.status}, ${response}`);
		}
	} catch (err) {
		console.error(err);
	}
};
