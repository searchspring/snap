import { h, cloneElement } from 'preact';
import { observer } from 'mobx-react-lite';

export const cloneWithProps = (input: any, props?: any, observable?: boolean): any => {
	if (!input) {
		return;
	} else if (typeof input == 'string' || typeof input == 'number' || typeof input == 'boolean') {
		return input;
	} else if (Array.isArray(input)) {
		return input.map((entry) => {
			return cloneWithProps(entry, props);
		});
	}

	if (observable) {
		const ObservableClone = observer((properties) => {
			return cloneElement(input, properties);
		});

		return <ObservableClone {...props} />;
	}

	return cloneElement(input, props);
};
