import { AbstractController, SearchController } from '@searchspring/snap-controller';
import { useState } from 'preact/hooks';

export const useControllerStorage = (controller: AbstractController, key: string, defaultVal?: any) => {
	//todo - refactor abstract controller to have storage and use it
	const storage = (controller as SearchController).storage;

	const storedState = storage.get(key);
	const initialState = storedState || defaultVal || undefined;

	const [state, setState] = useState(initialState);

	const setter = (newState: any) => {
		// update storage and setState
		storage.set(key, newState);
		setState(newState);
	};

	return [state, setter];
};
