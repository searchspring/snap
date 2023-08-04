/** @jsx jsx */
import { h, Fragment } from 'preact';
import { lazy } from 'preact/compat';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { FlexProps } from '../../Atoms/Flex/Flex';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { containerize } from './containerize';

import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
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

/* ATOMS */
const Badge = lazy(async () => {
	return (await import('../../Atoms/Badge')).Badge;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button')).Button;
});

const FormattedNumber = lazy(async () => {
	return (await import('../../Atoms/FormattedNumber')).FormattedNumber;
});

const Icon = lazy(async () => {
	return (await import('../../Atoms/Icon')).Icon;
});

const Image = lazy(async () => {
	return (await import('../../Atoms/Image')).Image;
});

const Price = lazy(async () => {
	return (await import('../../Atoms/Price')).Price;
});

const Rating = lazy(async () => {
	return (await import('../../Molecules/Rating/')).Rating;
});

const Skeleton = lazy(async () => {
	return (await import('../../Atoms/Skeleton')).Skeleton;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String')).String;
});

/* MOLECULES */
const Carousel = lazy(async () => {
	return (await import('../../Molecules/Carousel')).Carousel;
});

// CSS in JS
const CSS = {
	layout: () => css(),
};

export const ResultLayout = observer((properties: ResultLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: ResultLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.layout,
		// props
		...properties,
		...properties.theme?.components?.layout,
	};
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
			layouts = layouts.concat(layout(layoutData));
		} else {
			layouts = layouts.concat(layout);
		}
		const LayoutElements = containerize(layoutData, layouts, componentMap);

		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__layout', className)}>
					{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}
					<LayoutElements />
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
	component?: keyof typeof componentMap;
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

// componentMap must be type ResultLayoutComponentMap but isn't to allow for keyof typeof componentMap
const componentMap = {
	/* ATOMS */
	Badge: {
		component: Badge,
	},

	Button: {
		component: Button,
		layoutProps: ['content', 'children'],
	},

	FormattedNumber: {
		component: FormattedNumber,
	},
	Icon: {
		component: Icon,
	},
	Image: {
		component: Image,
	},
	Price: {
		component: Price,
	},
	Rating: {
		component: Rating,
	},
	Skeleton: {
		component: Skeleton,
	},
	String: {
		component: String,
	},
	/* MOLECULES */
	Carousel: {
		component: Carousel,
	},
};

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

export type ResultLayoutComponentMap = {
	[componentName: string]: {
		component: any;
		layoutProps?: string[];
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
