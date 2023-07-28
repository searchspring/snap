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
import type { HTMLProps } from '../../Atoms/HTML/HTML';
import type { ButtonProps } from '../../Atoms/Button';
import type { CarouselLayoutProps } from '../CarouselLayout';
import type { IconProps } from '../../Atoms/Icon';
import type { ImageProps } from '../../Atoms/Image';
import type { CheckboxProps } from '../../Molecules/Checkbox';
import type { SkeletonProps } from '../../Atoms/Skeleton';
import type { PriceProps } from '../../Atoms/Price';
import type { FormattedNumberProps } from '../../Atoms/FormattedNumber';
import type { SelectProps } from '../../Molecules/Select';
import type { FacetsProps } from '../../Organisms/Facets';
import type { FilterSummaryProps } from '../../Organisms/FilterSummary';
import type { PaginationProps } from '../../Molecules/Pagination';
import type { ResultsProps } from '../../Organisms/Results';
import type { PerPageProps } from '../../Molecules/PerPage';
import type { SortByProps } from '../../Molecules/SortBy';
import type { Product } from '@searchspring/snap-store-mobx';
import type { BannerProps } from '../../Atoms/Merchandising';
import type { BreadcrumbProps } from '../../Atoms/Breadcrumbs';
import type { GroupedTermsProps } from '../../Atoms/GroupedTerms';
import type { LoadingBarProps } from '../../Atoms/Loading';
import type { TermsProps } from '../../Atoms/Terms';
import type { SeeMoreProps } from '../../Molecules/SeeMore';
import type { SlideoutProps } from '../../Molecules/Slideout';
import type { BadgeProps } from '../../Atoms/Badge';
import type { RatingProps } from '../../Molecules/Rating/Rating';
import { OverlayProps } from '../../Atoms/Overlay';

// dynamically imported lazy loaded components

/* ATOMS */

const Badge = lazy(async () => {
	return (await import('../../Atoms/Badge')).Badge;
});

const Banner = lazy(async () => {
	return (await import('../../Atoms/Merchandising/Banner')).Banner;
});

const Breadcrumbs = lazy(async () => {
	return (await import('../../Atoms/Breadcrumbs')).Breadcrumbs;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button')).Button;
});

const Dropdown = lazy(async () => {
	return (await import('../../Atoms/Dropdown')).Dropdown;
});

const FormattedNumber = lazy(async () => {
	return (await import('../../Atoms/FormattedNumber')).FormattedNumber;
});

const GroupedTerms = lazy(async () => {
	return (await import('../../Atoms/GroupedTerms')).GroupedTerms;
});

const HTML = lazy(async () => {
	return (await import('../../Atoms/HTML')).HTML;
});

const Icon = lazy(async () => {
	return (await import('../../Atoms/Icon')).Icon;
});

const Image = lazy(async () => {
	return (await import('../../Atoms/Image')).Image;
});

const LoadingBar = lazy(async () => {
	return (await import('../../Atoms/Loading')).LoadingBar;
});

const Overlay = lazy(async () => {
	return (await import('../../Atoms/Overlay')).Overlay;
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

const Terms = lazy(async () => {
	return (await import('../../Atoms/Terms')).Terms;
});

/* MOLECULES */
const Checkbox = lazy(async () => {
	return (await import('../../Molecules/Checkbox')).Checkbox;
});

const Pagination = lazy(async () => {
	return (await import('../../Molecules/Pagination')).Pagination;
});

const PerPage = lazy(async () => {
	return (await import('../../Molecules/PerPage')).PerPage;
});

const SeeMore = lazy(async () => {
	return (await import('../../Molecules/SeeMore')).SeeMore;
});

const Select = lazy(async () => {
	return (await import('../../Molecules/Select')).Select;
});

const Slideout = lazy(async () => {
	return (await import('../../Molecules/Slideout')).Slideout;
});

const SortBy = lazy(async () => {
	return (await import('../../Molecules/SortBy')).SortBy;
});

/* ORGANISMS */

const Facets = lazy(async () => {
	return (await import('../../Organisms/Facets')).Facets;
});

const FilterSummary = lazy(async () => {
	return (await import('../../Organisms/FilterSummary')).FilterSummary;
});

const Results = lazy(async () => {
	return (await import('../../Organisms/Results')).Results;
});

/* LAYOUTS */

const CarouselLayout = lazy(async () => {
	return (await import('../CarouselLayout')).CarouselLayout;
});

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<LayoutProps>) =>
		css({
			width,
			height,
		}),
};

export const Layout = observer((properties: LayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: LayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.layout,
		// props
		...properties,
		...properties.theme?.components?.layout,
	};
	const { controller, data, width, height, disableStyles, className, style } = props;
	const layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	// typed as any due to not knowing which controller type is used
	const layoutData = { controller: controller as any, ...data };

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
	| BannerElement
	| BadgeElement
	| ButtonElement
	| BreadcrumbsElement
	| DropdownElement
	| FormattedNumberElement
	| GroupedTermsElement
	| HTMLElement
	| IconElement
	| ImageElement
	| LoadingBarElement
	| OverlayElement
	| PriceElement
	| RatingElement
	| SkeletonElement
	| TermsElement
	/* MOLECULES */
	| CheckboxElement
	| PaginationElement
	| PerPageElement
	| SeeMoreElement
	| SelectElement
	| SlideoutElement
	| SortByElement
	/* ORGANISMS */
	| FacetsElement
	| FilterSummaryElement
	| ResultsElement
	/* LAYOUTS */
	| CarouselLayoutElement
>;

// componentMap must be type LayoutComponentMap but isn't to allow for keyof typeof componentMap
const componentMap = {
	/* ATOMS */
	Badge: {
		component: Badge,
	},
	Banner: {
		component: Banner,
		layoutProps: ['children'],
	},
	Breadcrumbs: {
		component: Breadcrumbs,
		layoutProps: ['separator'],
	},
	Button: {
		component: Button,
		layoutProps: ['content', 'children'],
	},
	Dropdown: {
		component: Dropdown,
		layoutProps: ['button', 'content', 'children'],
	},
	FormattedNumber: {
		component: FormattedNumber,
	},
	GroupedTerms: {
		component: GroupedTerms,
	},
	HTML: {
		component: HTML,
	},
	Icon: {
		component: Icon,
	},
	Image: {
		component: Image,
	},
	LoadingBar: {
		component: LoadingBar,
	},
	Overlay: {
		component: Overlay,
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
	Terms: {
		component: Terms,
	},
	/* MOLECULES */
	Checkbox: {
		component: Checkbox,
	},
	Pagination: {
		component: Pagination,
		layoutProps: ['nextButton', 'prevButton', 'firstButton', 'lastButton'],
	},
	PerPage: {
		component: PerPage,
	},
	SeeMore: {
		component: SeeMore,
	},
	Select: {
		component: Select,
		layoutProps: ['label'],
	},
	Slideout: {
		component: Slideout,
		layoutProps: ['buttonContent', 'children'],
	},
	SortBy: {
		component: SortBy,
	},
	/* ORGANISMS */
	Facets: {
		component: Facets,
	},
	FilterSummary: {
		component: FilterSummary,
	},
	Results: {
		component: Results,
	},
	/* LAYOUTS */
	Carousel: {
		component: CarouselLayout,
	},
};

/* Layout Element Type Overrides */

/* ATOMS */
type BadgeElement = {
	component: 'Badge';
	props: Omit<BadgeProps, 'content' | 'children'> & {
		content?: string | LayoutTypes;
		children?: string | LayoutTypes;
	};
};

type BannerElement = {
	component: 'Banner';
	props: Omit<BannerProps, 'children'> & {
		children?: string | LayoutTypes;
	};
};

type BreadcrumbsElement = {
	component: 'Breadcrumbs';
	props: Omit<BreadcrumbProps, 'separator'> & {
		separator?: string | LayoutTypes;
	};
};

type ButtonElement = {
	component: 'Button';
	props: Omit<ButtonProps, 'content' | 'children'> & {
		content?: string | LayoutTypes;
		children?: string | LayoutTypes;
	};
};

type DropdownElement = {
	component: 'Dropdown';
	props: Omit<ButtonProps, 'button' | 'content' | 'children'> & {
		button?: string | LayoutTypes;
		content?: string | LayoutTypes;
		children?: string | LayoutTypes;
	};
};

type FormattedNumberElement = {
	component: 'FormattedNumber';
	props: FormattedNumberProps;
};

type GroupedTermsElement = {
	component: 'GroupedTerms';
	props: GroupedTermsProps;
};

type HTMLElement = {
	component: 'HTML';
	props: HTMLProps;
};

type IconElement = {
	component: 'Icon';
	props: IconProps;
};

type ImageElement = {
	component: 'Image';
	props: ImageProps;
};

type LoadingBarElement = {
	component: 'LoadingBar';
	props: LoadingBarProps;
};

type OverlayElement = {
	component: 'Overlay';
	props: OverlayProps;
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

type TermsElement = {
	component: 'Terms';
	props: TermsProps;
};

/* MOLECULES */

type CheckboxElement = {
	component: 'Checkbox';
	props: CheckboxProps;
};

type PaginationElement = {
	component: 'Pagination';
	props: PaginationProps;
};

type PerPageElement = {
	component: 'PerPage';
	props: PerPageProps;
};

type SeeMoreElement = {
	component: 'SeeMore';
	props: SeeMoreProps;
};

type SelectElement = {
	component: 'Select';
	props: Omit<SelectProps, 'label'> & {
		label?: string | LayoutTypes;
	};
};

type SlideoutElement = {
	component: 'Slideout';
	props: Omit<SlideoutProps, 'buttonContent' | 'children'> & {
		buttonContent?: string | LayoutTypes;
		children?: string | LayoutTypes;
	};
};

type SortByElement = {
	component: 'SortBy';
	props: SortByProps;
};

/* ORGANISMS */

type FacetsElement = {
	component: 'Facets';
	props: FacetsProps;
};

type FilterSummaryElement = {
	component: 'FilterSummary';
	props: FilterSummaryProps;
};

type ResultsElement = {
	component: 'Results';
	props: ResultsProps;
};

/* LAYOUTS */

type CarouselLayoutElement = {
	component: 'Carousel';
	props: CarouselLayoutProps;
};

export type LayoutComponentMap = {
	[componentName: string]: {
		component: any;
		layoutProps?: string[];
	};
};

export type LayoutFuncData<Controller> = {
	controller: Controller;
} & LayoutFuncAdditionalData;

type LayoutFuncAdditionalData = {
	input?: Element; // used for AutocompleteLayout
	result?: Product; // used for results
};

export type LayoutFunc<Controller = SearchController | AutocompleteController | RecommendationController> = (
	data: LayoutFuncData<Controller>,
	customData?: any
) => LayoutElement[];

export type LayoutTypes<Controller = SearchController | AutocompleteController | RecommendationController> =
	| LayoutFunc<Controller>
	| LayoutElement
	| LayoutElement[];

export type LayoutFuncWrapper = () => LayoutTypes;

export interface LayoutProps extends ComponentProps {
	controller?: SearchController | AutocompleteController | RecommendationController;
	data?: LayoutFuncAdditionalData;
	layout?: LayoutTypes;
	width?: string;
	height?: string;
}
