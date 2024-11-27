import type { Product } from '@searchspring/snap-store-mobx';

export type BigCommerceAddToCartConfig = {
	redirect?: boolean | string;
	idFieldName?: string; // display.mappings.core.id
};

type LineItem = {
	product_id: string;
	quantity: number;
	optionSelections?: { optionId?: string; optionValue?: string }[];
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
				if (level && level[field]) {
					level = level[field];
				} else {
					console.error(`Error: couldnt find column in item data. please verify 'idFieldName' in the config.`);
					level = undefined;
					id = undefined;
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
			};

			const options = item.variants?.active?.options;
			if (options) {
				productDetails.optionSelections = [];
				Object.keys(options).forEach((option) => {
					const optionId = options[option].optionId;
					const optionValue = options[option].optionValue;

					if (optionId && optionValue) {
						productDetails.optionSelections?.push({ optionId, optionValue });
					}
				});
			}

			lineItems.push(productDetails);
		}
	});

	if (lineItems.length) {
		const addToCartResponse = await addLineItemsToCart(lineItems);

		// do redirect (or not)
		if (config?.redirect !== false) {
			setTimeout(() => (window.location.href = typeof config?.redirect == 'string' ? config?.redirect : '/cart.php'));
		}

		return addToCartResponse;
	}
};

async function addLineItemsToCart(lineItems: LineItem[]): Promise<any> {
	try {
		const cartId = await getExistingCartId();

		// if existing cartId use it, otherwise create new cart with items
		let addToCartUrl = '/api/storefront/carts';
		if (cartId) {
			addToCartUrl = `/api/storefront/carts/${cartId}/items`;
		}

		const body = JSON.stringify({ lineItems });

		const response = await fetch(addToCartUrl, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body,
		});

		if (response.status !== 200) {
			throw new Error(`API rejected addToCart: ${response.status}`);
		}

		const responseData = await response.json();

		if (responseData?.id) {
			// cart Id should exist now.
			return responseData;
		}
	} catch (err) {
		console.error(`Error: could not add to cart.`, err);
	}
}

async function getExistingCartId(): Promise<string | undefined> {
	try {
		const response = await fetch('/api/storefront/carts', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		const responseData = await response.json();

		if (Array.isArray(responseData) && responseData.length) {
			return responseData[0].id;
		}
	} catch (err) {
		// error...
	}
}
