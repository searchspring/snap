import type { SerializedStyles } from '@emotion/react';
import type { Theme } from './providers/theme';
import type { AbstractController } from '@searchspring/snap-controller';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Product } from '@searchspring/snap-store-mobx';
import { IconProps, IconType } from './components/Atoms/Icon';
import { MutableRef } from 'preact/hooks';
import type { Snap, SnapTemplates } from '../../src';
import type { DeepPartial } from '../../src/types';
import type { FunctionalComponent, RenderableProps } from 'preact';
import type { CSSInterpolation } from '@emotion/serialize/types';

export interface ComponentProps {
	name?: string;
	className?: string;
	disableStyles?: boolean;
	style?: CSSInterpolation;
	styleScript?: (props: any) => SerializedStyles;
	theme?: Theme;
	controller?: AbstractController;
	snap?: Snap | SnapTemplates;
	ref?: MutableRef<any> | React.RefObject<any> | ((e: any) => void);
}

export type ListOption = {
	value: string | number;
	label?: string;
	disabled?: boolean;
	default?: boolean;
	icon?: IconType | Partial<IconProps>;
	overrides?: DeepPartial<Theme>;
	url?: UrlManager;
	available?: boolean;
};

export type ResultComponent<Props extends Record<string, any> = object> = React.FunctionComponent<
	{
		controller: AbstractController;
		result: Product;
		theme?: Theme;
	} & Props
>;

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
	TOGGLE = 'toggle',
}

// export type BreakpointsProps = {
// 	[key: number]: BreakpointsEntry | any;
// };
export type BreakpointsProps = {
	[key: number]: BreakpointsEntry;
};

export type BreakpointsEntry = {
	[property: string]: any;
};

export type StylingCSS = Array<CSSInterpolation | SerializedStyles>;

export type SwatchOption = ListOption & {
	backgroundImageUrl?: string;
	background?: string;
};

export type ComponentMap = {
	[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>> | FunctionalComponent<RenderableProps<any>>;
};
