import { h, cloneElement } from 'preact';

export const cloneWithProps = (input: any, props?: any): any => {
	if (!input) {
		return;
	} else if (typeof input == 'function') {
		return input(props);
	} else if (typeof input == 'string' || typeof input == 'number' || typeof input == 'boolean') {
		return input;
	} else if (Array.isArray(input)) {
		return input.map((entry) => {
			return cloneWithProps(entry, props);
		});
	} else if (typeof input?.type == 'string') {
		// don't want to clone native elements
		return input;
	}

	// clone element and it's children if it has them
	return cloneElement(input, props, input.props?.children && cloneWithProps(input.props.children, props));
};
