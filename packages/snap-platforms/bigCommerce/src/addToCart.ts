import type { Product } from '@searchspring/snap-store-mobx';

interface config {
	callback?: () => void;
	idFieldName?: string; //display.mappings.core.id
}

type formData = {
	line_items: {
		product_id: number;
		quantity: number;
	}[];
};

export const addToCart = async (data: Product[], config?: config) => {
	const formData: formData = {
		line_items: [],
	};

	if (!data) {
		console.error('Error: no products to add');
		return false;
	}

	data.map((item) => {
		let id: any;
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
				id = level;
			} else {
				id = item.display.mappings.core?.uid;
			}
		} else {
			id = item.display.mappings.core?.uid;
		}
		if (id && item.quantity) {
			const obj = {
				product_id: id,
				quantity: item.quantity,
			};

			formData.line_items.push(obj);
		}
	});

	//first check how many products we are adding
	if (formData.line_items.length) {
		for (let i = 0; i < formData.line_items.length; i++) {
			await addSingleProductv1(formData.line_items[i]);
		}
	}

	if (config?.callback) {
		config.callback();
	} else {
		console.log('redirecting');
		setTimeout(() => (window.location.href = '/cart.php'));
	}
};

const addSingleProductv1 = async (item: { product_id: number; quantity: number }) => {
	const endpoint = {
		route: `/remote/v1/cart/add`,
		method: 'POST',
		accept: 'application/json',
		content: 'application/json',
		success: 200,
	};

	const resource = `${window.location.origin}${endpoint.route}`;

	const init: any = {
		method: endpoint.method,
		credentials: 'same-origin',
		headers: {
			// note: no authorization
			Accept: endpoint.accept,
		},
	};

	if (item) {
		init.headers['Content-Type'] = endpoint.content;
		//clone item..
		init.body = { ...item };
		init.body['action'] = 'add';
		init.body = JSON.stringify(init.body);
	}

	try {
		const response = await fetch(resource, init);

		if (response.status === endpoint.success) {
			const jsonResponse = response.json();
			return jsonResponse;
		} else {
			return new Error(`Error: Snap-platform-bigcommerce addToCart responded with ${response.status}, ${response}`);
		}
	} catch (err) {
		console.error(err);
	}
};
