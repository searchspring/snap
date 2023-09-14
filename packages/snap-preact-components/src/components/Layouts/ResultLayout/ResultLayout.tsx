/** @jsx jsx */
import { h, Fragment } from 'preact';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { Componentize, ComponentMap } from '../utils/Componentize';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { ContainerProps } from '../utils/Container/Container';
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
import type { ElementProps } from '../../Atoms/Element';

// CSS in JS
const CSS = {
	layout: ({}: Partial<ResultLayoutProps>) => css(),
};

export const ResultLayout = observer((properties: ResultLayoutProps) => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ResultLayoutProps> = {};

	const props = mergeProps('resultLayout', globalTheme, defaultProps, properties);

	const { controller, result, disableStyles, className, style, styleScript, theme } = props;
	const layout = props.layout;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.layout(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	if (layout) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__result-layout', className)}>
					<Componentize controller={controller} result={result} layout={layout} theme={theme} />
				</div>
			</CacheProvider>
		);
	} else {
		return <Fragment></Fragment>;
	}
});

export type LayoutElement = {
	name?: string;
	layout?: ContainerProps;
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
	| ElementElement
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

type ElementElement = {
	component: 'Element';
	props: ElementProps;
};

/* MOLECULES */

type CarouselElement = {
	component: 'Carousel';
	props: Omit<CarouselProps, 'prevButton' | 'nextButton' | 'children'> & {
		prevButton?: string | ResultLayoutTypes;
		nextButton?: string | ResultLayoutTypes;
		children?: string | ResultLayoutTypes;
	};
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
