import type { Product } from '@searchspring/snap-store-mobx';

type BigCommerceAddToCartConfig = {
	redirect?: boolean | string;
	idFieldName?: string; // display.mappings.core.id
};

type LineItem = {
	product_id: string;
	quantity: number;
};

type FormData = {
	line_items: LineItem[];
};

export const addToCart = async (items: Product[], config?: BigCommerceAddToCartConfig) => {
	if (!items) {
		console.error('Error: no products to add');
		return;
	}

	const formData: FormData = {
		line_items: [],
	};

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
			const obj = {
				product_id: id,
				quantity: item.quantity,
			};

			formData.line_items.push(obj);
		}
	});

	// first check how many products we are adding
	if (formData.line_items.length) {
		for (let i = 0; i < formData.line_items.length; i++) {
			await addSingleProductv1(formData.line_items[i]);
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

	const endpoint = {
		route: `/remote/v1/cart/add`,
		method: 'POST',
		accept: 'application/json',
		content: 'application/json',
		success: 200,
	};

	try {
		const payload = JSON.stringify({
			...item,
			action: 'add',
		});

		const init: RequestInit = {
			method: endpoint.method,
			credentials: 'same-origin',
			headers: {
				// note: no authorization
				Accept: endpoint.accept,
				'Content-Type': endpoint.content,
			},
			body: payload,
		};

		const response = await fetch(endpoint.route, init);

		if (response.status !== endpoint.success) {
			throw new Error(`Error: addToCart responded with ${response.status}, ${response}`);
		}
	} catch (err) {
		console.error(err);
	}
};
