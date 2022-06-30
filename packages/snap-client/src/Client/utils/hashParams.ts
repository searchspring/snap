import { ParameterObject } from '@searchspring/snap-toolbox';

export function hashParams(params: ParameterObject): string {
	if (typeof params != 'object') {
		throw new Error('function requires an object');
	}

	return JSON.stringify(params);
}
