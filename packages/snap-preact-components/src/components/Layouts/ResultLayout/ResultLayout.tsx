/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useMemo } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { Componentize, ComponentMap } from './Componentize';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { FlexProps } from '../../Atoms/Flex/Flex';
import type { ComponentProps, StylingCSS } from '../../../types';
import type { ButtonProps } from '../../Atoms/Button';
import type { IconProps } from '../../Atoms/Icon';
import type { ImageProps } from '../../Atoms/Image';
import type { SkeletonProps } from '../../Atoms/Skeleton';
import type { PriceProps } from '../../Atoms/Price';
import type { FormattedNumberProps } from '../../Atoms/FormattedNumber';
import type { Product } from '@searchspring/snap-store-mobx';
import type { BadgeProps } from '../../Atoms/Badge';
import type { RatingProps } from '../../Molecules/Rating/Rating';
import type { CarouselProps } from '../../Molecules/Carousel';
import type { StringProps } from '../../Atoms/String';

// dynamically imported lazy loaded components

// CSS in JS
const CSS = {
	layout: () => css(),
};

export const ResultLayout = observer((properties: ResultLayoutProps) => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ResultLayoutProps> = {};

	const props = mergeProps('resultLayout', globalTheme, defaultProps, properties);

	const { controller, result, disableStyles, className, style } = props;
	const layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout(), style];
	} else if (style) {
		styling.css = [style];
	}

	// typed as any due to not knowing which controller type is used
	const layoutData = { controller, result };

	if (layout) {
		let layouts: LayoutElement[] = [];
		if (typeof layout == 'function') {
			layouts = layouts.concat(useMemo(() => layout(layoutData), [layoutData.result.id]));
		} else {
			layouts = layouts.concat(layout);
		}

		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__result-layout', className)}>
					{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}

					<Componentize data={layoutData} layout={layouts} />
				</div>
			</CacheProvider>
		);
	} else {
		return <Fragment></Fragment>;
	}
});

export type LayoutElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	layout?: FlexProps;
	items?: LayoutElement[];
	component?: keyof ComponentMap;
} & Partial<
	/* ATOMS */
	| BadgeElement
	| ButtonElement
	| FormattedNumberElement
	| IconElement
	| ImageElement
	| PriceElement
	| RatingElement
	| SkeletonElement
	| StringElement
	/* MOLECULES */
	| CarouselElement
>;

/* Layout Element Type Overrides */

/* ATOMS */
type BadgeElement = {
	component: 'Badge';
	props: Omit<BadgeProps, 'content' | 'children'> & {
		content?: string | ResultLayoutTypes;
		children?: string | ResultLayoutTypes;
	};
};

type ButtonElement = {
	component: 'Button';
	props: Omit<ButtonProps, 'content' | 'children'> & {
		content?: string | ResultLayoutTypes;
		children?: string | ResultLayoutTypes;
	};
};

type FormattedNumberElement = {
	component: 'FormattedNumber';
	props: FormattedNumberProps;
};

type IconElement = {
	component: 'Icon';
	props: IconProps;
};

type ImageElement = {
	component: 'Image';
	props: ImageProps;
};

type PriceElement = {
	component: 'Price';
	props: PriceProps;
};

type RatingElement = {
	component: 'Rating';
	props: RatingProps;
};

type SkeletonElement = {
	component: 'Skeleton';
	props: SkeletonProps;
};

type StringElement = {
	component: 'String';
	props: StringProps;
};

/* MOLECULES */

type CarouselElement = {
	component: 'Carousel';
	props: CarouselProps;
};

export type ResultLayoutFuncData<Controller> = {
	controller: Controller;
	result: Product;
};

export type ResultLayoutFunc<Controller = SearchController | AutocompleteController | RecommendationController> = (
	data: ResultLayoutFuncData<Controller>,
	customData?: any
) => LayoutElement[];

export type ResultLayoutTypes<Controller = SearchController | AutocompleteController | RecommendationController> =
	| ResultLayoutFunc<Controller>
	| LayoutElement
	| LayoutElement[];

export type ResultLayoutFuncWrapper = () => ResultLayoutTypes;

export interface ResultLayoutProps extends ComponentProps {
	controller: SearchController | AutocompleteController | RecommendationController;
	result: Product;
	layout: ResultLayoutTypes;
}
