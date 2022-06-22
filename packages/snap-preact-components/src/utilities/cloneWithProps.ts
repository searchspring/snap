import { h, cloneElement } from 'preact';

export const cloneWithProps = (input: any, props: any): any => {
	if (!input) {
		return;
	} else if (typeof input == 'string' || typeof input == 'number' || typeof input == 'boolean') {
		return input;
	} else if (Array.isArray(input)) {
		return input.map((entry) => {
			return cloneWithProps(entry, props);
		});
	}

	return cloneElement(input, props);
};

// import { h, cloneElement, VNode } from 'preact';

// export const cloneWithProps = (input: VNode<any>, props?: any): VNode<any> | VNode<any>[] | undefined | Array<any> => {
// 	if (!input) {
// 		return;
// 	} else if (typeof input == 'string' || typeof input == 'number' || typeof input == 'boolean') {
// 		return input;
// 	} else if (Array.isArray(input)) {
// 		return input.map((entry) => {
// 			return cloneWithProps(entry, props);
// 		});
// 	}

// 	return cloneElement(input, props);
// };
