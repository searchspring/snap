import { ImmutableObject } from 'seamless-immutable';

export enum RangeValueProperties {
	LOW = 'low',
	HIGH = 'high',
}

export type UrlStateRangeValue = {
	[RangeValueProperties.LOW]: number | null;
	[RangeValueProperties.HIGH]: number | null;
};

export type UrlStateFilterType = string | number | boolean | UrlStateRangeValue;

export type UrlStateFilter = {
	[fieldName: string]: Array<UrlStateFilterType>;
};

export type UrlStateSort = {
	field: string;
	direction: string;
};

export type UrlState = {
	page?: number;
	query?: string;
	filter?: UrlStateFilter;
	sort?: UrlStateSort | Array<UrlStateSort>;
	[any: string]: unknown;
};

export interface UrlTranslator {
	getCurrentUrl(): string;
	getConfig(): Record<string, unknown>;

	serialize(state: UrlState | ImmutableObject<UrlState>): string;
	deserialize(url: string): UrlState;

	bindExternalEvents?(update: () => void): void;

	go(url: string): void;
}
