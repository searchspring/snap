import { FunctionalComponent, RenderableProps } from 'preact';
import { SerializedStyles } from '@emotion/react';
import { Theme } from './providers/theme';
import { IconProps } from './components/Atoms/Icon';
import type { UrlManager } from '@searchspring/snap-url-manager';

export interface ComponentProps extends RenderableProps<any> {
	className?: string;
	disableStyles?: boolean;
	style?: string | Record<string, any>;
	theme?: Theme;
}

export type ListOption = {
	value: string | number;
	label?: string;
	disabled?: boolean;
	available?: boolean;
	default?: boolean;
	icon?: string | Partial<IconProps>;
	url?: UrlManager;
};

export type SwatchOption = ListOption & {
	backgroundImageUrl?: string;
	background?: string;
};

export type ComponentMap = {
	[key: string]: (args?: any) => FunctionalComponent<RenderableProps<any>> | Promise<(args?: any) => React.ReactElement>;
};

export enum Layout {
	GRID = 'grid',
	LIST = 'list',
}

export type LayoutType = Layout.GRID | Layout.LIST;

// TODO: move to store or use store or snapi types
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

export type StylingCSS = Array<SerializedStyles | string | Record<string, string> | undefined>;
