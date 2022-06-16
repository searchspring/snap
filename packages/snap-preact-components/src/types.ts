import { RenderableProps } from 'preact';

import { Theme } from './providers/theme';

export interface ComponentProps extends RenderableProps<any> {
	className?: string;
	disableStyles?: boolean;
	style?: string | Record<string, string>;
	theme?: Theme;
}

export type InlineBannerContent = {
	value: string;
	type?: string;
	uid?: string;
	config: {
		position: {
			index: number;
		};
	};
};

export enum Layout {
	GRID = 'grid',
	LIST = 'list',
}

export type LayoutType = Layout.GRID | Layout.LIST;

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

export type BreakpointsProps = {
	[key: number]: BreakpointsEntry;
};

export type BreakpointsEntry = {
	[property: string]: any;
};
