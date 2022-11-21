import type { ImmutableObject } from 'seamless-immutable';

export type ImmutableUrlState = ImmutableObject<UrlState>;

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
	[fieldName: string]: UrlStateFilterType | Array<UrlStateFilterType>;
};

export type UrlStateSort = {
	field: string;
	direction: string;
};

export type UrlState = {
	page?: number;
	pageSize?: number;
	query?: string;
	rq?: string;
	oq?: string;
	fallbackQuery?: string;
	filter?: UrlStateFilter;
	sort?: UrlStateSort | Array<UrlStateSort>;
	tag?: string;
	[any: string]: unknown;
};

export interface Translator {
	getCurrentUrl(): string;
	getConfig(): Record<string, unknown>;

	serialize(state: UrlState | ImmutableObject<UrlState>): string;
	deserialize(url: string): UrlState;

	bindExternalEvents?(update: () => void): void;

	go(url: string, config?: { [any: string]: unknown }): void;
}

export interface TranslatorConfig {
	urlRoot?: string;
	settings?: {
		serializeUrlRoot?: boolean;
		[any: string]: unknown;
	};
	[any: string]: unknown;
}

export enum ParamLocationType {
	hash = 'hash',
	query = 'query',
}
