export type UrlStateRangeValue = {
	low: number;
	high: number;
};

export type UrlStateFilters = {
	[fieldName: string]: Array<string>;
};

export type UrlStateSort = {
	field: string;
	direction: string;
};

export type UrlStateSorts = UrlStateSort | Array<UrlStateSort>;

export type UrlState = {
	page?: number;
	query?: string;
	filter?: UrlStateFilters;
	sort?: UrlStateSorts;
	[any: string]: unknown;
};

export interface UrlTranslator {
	getCurrentUrl(): string;
	getConfig(): Record<string, unknown>;

	serialize(state: UrlState): string;
	deserialize(url: string): UrlState;

	bindExternalEvents?(update: () => void): void;

	go(url: string): void;
}
