import type { Product } from '@searchspring/snap-store-mobx';

export interface config {
	callback?: () => void;
	idFieldName?: string; //display.mappings.core.id
}

declare global {
	interface Window {
		Shopify: any;
	}
}

type formData = {
	items: {
		id: number;
		quantity: number;
	}[];
};

export const addToCart = async (data: Product[], config?: config) => {
	const formData: formData = {
		items: [],
	};

	if (!window.Shopify) {
		console.error('Error: Shopify Object not detected');
		return false;
	}

	if (!data) {
		console.error('Error: no products to add');
		return false;
	}

	data.map((item) => {
		let sku;
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
				sku = level;
			} else {
				// @ts-ignore - need to add uid to snapi-types
				sku = item.display.mappings.core?.uid;
			}
		} else {
			// @ts-ignore - need to add uid to snapi-types
			sku = item.display.mappings.core?.uid;
		}

		if (sku?.toString().match(/^[0-9]+$/)) {
			sku = +sku;
		}

		if (sku && item.quantity) {
			const obj = {
				id: sku,
				quantity: item.quantity,
			};

			formData.items.push(obj);
		}
	});

	try {
		const response = await fetch(window?.Shopify?.routes.root + 'cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.status === 200) {
			const jsonResponse = response.json();

			if (config?.callback) {
				config.callback();
			} else {
				setTimeout(() => (window.location.href = '/cart'));
			}

			return jsonResponse;
		} else {
			return new Error(`Error: Snap-plugin-shopify addToCart responded with ${response.status}, ${response}`);
		}
	} catch (err) {
		console.error(err);
	}
};
