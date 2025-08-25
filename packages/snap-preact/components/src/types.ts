import type { SerializedStyles } from '@emotion/react';
import type { ThemeMinimal, Theme } from './providers/theme';
import type { AbstractController } from '@searchspring/snap-controller';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Product } from '@searchspring/snap-store-mobx';
import { IconProps, IconType } from './components/Atoms/Icon';
import { MutableRef } from 'preact/hooks';
import type { Snap, SnapTemplates } from '../../src';
import type { FunctionalComponent, RenderableProps } from 'preact';
import type { CSSObject } from '@emotion/serialize';
import { RecommendationProps } from './components/Templates/Recommendation';
import { RecommendationGridProps } from './components/Templates/RecommendationGrid';
import { RecommendationBundleProps } from './components/Templates/RecommendationBundle';
import { RecommendationBundleEasyAddProps } from './components/Templates/RecommendationBundleEasyAdd';
import { RecommendationBundleListProps } from './components/Templates/RecommendationBundleList';
import { RecommendationBundleVerticalProps } from './components/Templates/RecommendationBundleVertical';

export type StyleScript<Props> = (props: Props) => SerializedStyles;
export interface ComponentProps<Props = any> {
	className?: string;
	internalClassName?: string;
	disableStyles?: boolean;
	style?: CSSObject;
	styleScript?: StyleScript<Props>;
	themeStyleScript?: StyleScript<Props>;
	theme?: Theme;
	controller?: AbstractController;
	snap?: Snap | SnapTemplates;
	ref?: MutableRef<any> | React.RefObject<any> | ((e: any) => void);
	name?: string;
	treePath?: string;
}

export type ListOption = {
	value: string | number;
	label?: string;
	disabled?: boolean;
	default?: boolean;
	icon?: IconType | Partial<IconProps>;
	overrides?: ThemeMinimal;
	url?: UrlManager;
	available?: boolean;
};

export type ResultComponent<Props extends Record<string, any> = object> = React.FunctionComponent<
	{
		controller: AbstractController;
		result: Product;
		theme?: Theme;
		treePath?: string;
	} & Props
>;

export type RecommendationBundleComponentNames =
	| 'RecommendationBundle'
	| 'RecommendationBundleEasyAdd'
	| 'RecommendationBundleList'
	| 'RecommendationBundleVertical'
	| 'RecommendationBundle';

export type RecommendationBundleComponentProps =
	| RecommendationBundleProps
	| RecommendationBundleEasyAddProps
	| RecommendationBundleListProps
	| RecommendationBundleVerticalProps
	| RecommendationBundleProps;

export type RecommendationComponentNames = 'Recommendation' | 'RecommendationGrid';

export type RecommendationComponentProps = RecommendationProps | RecommendationGridProps;

export enum ResultsLayout {
	grid = 'grid',
	list = 'list',
}

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

// TODO: remove undefined once refactored
export type StylingCSS = Array<CSSObject | SerializedStyles | undefined>;

// TODO: remove optionals once refactored
export type RootNodeProperties = {
	css?: StylingCSS;
	'ss-name'?: string;
	'ss-path'?: string;
};

export type SwatchOption = ListOption & {
	backgroundImageUrl?: string;
	background?: string;
};

export type ComponentMap = {
	[componentName: string]: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>> | FunctionalComponent<RenderableProps<any>>;
};
