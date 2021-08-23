import { h, cloneElement } from 'preact';

export const cloneWithProps = (input, props) => {
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
