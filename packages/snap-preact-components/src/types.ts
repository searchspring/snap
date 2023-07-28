import { SerializedStyles } from '@emotion/react';
import { Theme } from './providers/theme';
import type { AbstractController } from '@searchspring/snap-controller';

export interface ComponentProps {
	className?: string;
	disableStyles?: boolean;
	style?: string | Record<string, any>;
	styleScript?: <Props>(props: Props) => SerializedStyles;
	theme?: Theme;
	controller?: AbstractController;
}

export enum ResultsLayout {
	GRID = 'grid',
	LIST = 'list',
}

export type ResultsLayoutType = ResultsLayout.GRID | ResultsLayout.LIST;

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
	[key: number]: BreakpointsEntry | any;
};

export type BreakpointsEntry = {
	[property: string]: any;
};

export type StylingCSS = Array<SerializedStyles | string | Record<string, string> | undefined>;
