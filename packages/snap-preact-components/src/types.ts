import { RenderableProps } from 'preact';

import { Theme } from './providers/theme';

export interface ComponentProps extends RenderableProps<any> {
	className?: string;
	disableStyles?: boolean;
	style?: string | Record<string, string>;
	theme?: Theme;
}

// TODO: figure out types for URL manager
export interface Result {
	id: string;
	mappings: Mappings;
	attributes: any;
	type?: string;
}
export enum BannerType {
	HEADER = 'header',
	FOOTER = 'footer',
	LEFT = 'left',
	BANNER = 'banner',
	INLINE = 'inline',
}

export type InlineBannerContent = {
	value: string;
	config: {
		position: {
			index: number;
		};
	};
};

export type BannerContent = Record<BannerType, any[]>;
export interface Mappings {
	core: {
		uid: string;
		name: string;
		url: string;
		price: number;
		msrp?: number;
		thumbnailImageUrl?: string;
		imageUrl?: string;
		sku?: string;
		brand?: string;
	};
}

export enum Layout {
	GRID = 'grid',
	LIST = 'list',
}

export type LayoutType = Layout.GRID | Layout.LIST;

export interface Pagination {
	page: number;
	pageSize: number;
	pageSizeOptions: PageSizeOption[];
	totalResults: number;
	begin: number;
	end: number;
	multiplePages: boolean;
	current: Page;
	first: Page;
	last: Page;
	next: Page;
	previous: Page;
	totalPages: number;
	getPages: (limit: number, secondLimit?: number) => Page[];
}

export type PageSizeOption = {
	label: string;
	value: number;
};

export type Page = {
	active: boolean;
	number: number;
	url: any;
};

// TODO look into imported types
export interface Option {
	value?: number; //value only exists for results per page dropdown (store.pagination.pageSizeOptions)
	direction?: string;
	field?: string;
	label: string;
	type?: string;
	// url?: UrlManager; //TODO: this is causing type errors in tests
	url?: any;
}

export interface Filter {
	facet: {
		label: string;
		field: string;
	};
	value: {
		label: string;
		value: string;
	};
	url: any;
	label: string;
}

export interface IconProps {
	className?: string;
	color?: string;
	icon?: string;
	path?: string;
	size?: string;
	width?: string;
	height?: string;
	style?: Record<string, string>;
	viewBox?: string;
}

export interface FacetIconSet {
	activeIcon: IconProps;
	nonActiveIcon: IconProps;
}

// not sure why gridVal is active while Palette val is filtered and why palette doesnt have a url prop
//should use the same fields and try to use 1 type
export interface GridValue {
	active: boolean;
	type: string;
	value: string;
	count: number;
	label: string;
	filtered?: boolean;
	url?: {
		link: any;
	};
}

export interface BaseFacet {
	type: FacetType | any; //TODO: update mock data, 'any' to pass pagination tests
	field: string;
	display: FacetDisplay | any; //TODO: update mock data, 'any' to pass pagination tests
	filtered: boolean;
	label: string;
	collapsed: boolean;
	toggleCollapse?: () => any; //TODO: update mock data, optional to pass pagination tests
	controller?: any;
}

export interface ValueFacet extends BaseFacet {
	values: ValueFacetValue[];
	refinedValues?: ValueFacetValue[];
	overflow?: {
		enabled: boolean;
		remaining: number;
		toggle: () => any;
		limit: number;
		setLimit: (limit: number) => any;
	};
}

export interface HierarchyFacet extends BaseFacet {
	values: HierarchyFacetValue[];
	refinedValues?: HierarchyFacetValue[];
	overflow?: {
		enabled: boolean;
		remaining: number;
		toggle: () => any;
		limit: number;
		setLimit: (limit: number) => any;
	};
}

export interface RangeBucketFacet extends BaseFacet {
	values: RangeBucketFacetValue[];
	refinedValues: RangeBucketFacetValue[];
	overflow: {
		enabled: boolean;
		remaining: number;
		toggle: () => any;
		limit: number;
		setLimit: (limit: number) => any;
	};
}
export interface RangeFacetValue {
	active: {
		low: number;
		high: number;
	};
	range: {
		low: number;
		high: number;
	};
	step: number;
	formatSeparator?: string;
	formatValue?: string;
}

export interface RangeFacet extends RangeFacetValue, BaseFacet {}

export interface BaseFacetValue {
	filtered: boolean;
	label: string;
	count?: number;
	url?: any;
	value?: any;
	custom?: any;
}

export interface ValueFacetValue extends BaseFacetValue {
	value: string;
	preview?: () => void;
}

export interface HierarchyFacetValue extends BaseFacetValue {
	history: boolean;
	level: number;
}

export interface RangeBucketFacetValue extends BaseFacetValue {
	low: number;
	high: number;
}

export interface SliderFacetValue {
	active: {
		low: number;
		high: number;
	};
	range: {
		low: number;
		high: number;
	};
	step: number;
}

export enum FacetMultiple {
	SINGLE = 'single',
	OR = 'or',
	AND = 'and',
}

export enum FacetType {
	VALUE = 'value',
	RANGE = 'range',
	RANGE_BUCKETS = 'range-buckets',
}

// TODO: should be added to the Facet type
export enum FacetDisplay {
	GRID = 'grid',
	PALETTE = 'palette',
	LIST = 'list',
	SLIDER = 'slider',
	HIERARCHY = 'hierarchy',
}
