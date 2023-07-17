/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { ThemeProvider } from '../../../providers';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Flex, FlexProps } from '../../Atoms/Flex/Flex';
import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

import type { SearchController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';
import type { SlideoutProps } from '../../Molecules/Slideout/Slideout';
import type { PaginationProps } from '../../Molecules/Pagination/Pagination';
import type { FacetsProps } from '../../Organisms/Facets/Facets';
import type { RecommendationProps } from '../../Organisms/Recommendation/Recommendation';
import type { ResultsProps } from '../../Organisms/Results/Results';
import type { FilterSummaryProps } from '../../Organisms/FilterSummary/FilterSummary';
import type { SortByProps } from '../../Molecules/SortBy/SortBy';
import type { PerPageProps } from '../../Molecules/PerPage/PerPage';
import type { StringProps } from '../../Atoms/String/String';
import type { LoadingBarProps } from '../../Atoms/Loading/LoadingBar';
import type { BreadcrumbProps } from '../../Atoms/Breadcrumbs/Breadcrumbs';
import type { BannerProps } from '../../Atoms/Merchandising';

// dynamically imported lazy loaded components
const Banner = lazy(async () => {
	return (await import('../../Atoms/Merchandising/Banner')).Banner;
});

const Breadcrumbs = lazy(async () => {
	return (await import('../../Atoms/Breadcrumbs')).Breadcrumbs;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String')).String;
});

const LoadingBar = lazy(async () => {
	return (await import('../../Atoms/Loading')).LoadingBar;
});

const PerPage = lazy(async () => {
	return (await import('../../Molecules/PerPage')).PerPage;
});

const SortBy = lazy(async () => {
	return (await import('../../Molecules/SortBy')).SortBy;
});

const Pagination = lazy(async () => {
	return (await import('../../Molecules/Pagination')).Pagination;
});

const Slideout = lazy(async () => {
	return (await import('../../Molecules/Slideout')).Slideout;
});

const Facets = lazy(async () => {
	return (await import('../../Organisms/Facets')).Facets;
});

const FilterSummary = lazy(async () => {
	return (await import('../../Organisms/FilterSummary')).FilterSummary;
});

const Results = lazy(async () => {
	return (await import('../../Organisms/Results')).Results;
});

const Recommendation = lazy(async () => {
	return (await import('../../Organisms/Recommendation')).Recommendation;
});

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<SearchLayoutProps>) =>
		css({
			width,
			height,
		}),
};

export const SearchLayout = observer((properties: SearchLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: SearchLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.flex,
		// props
		...properties,
		...properties.theme?.components?.flex,
	};
	const { controller, breakpoints, width, height, disableStyles, className, style, theme } = props;
	let layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	// TODO: make useDisplaySettings generic?
	const displaySettings = useDisplaySettings(breakpoints!);
	if (displaySettings && Object.keys(displaySettings).length) {
		layout = displaySettings as LayoutFunc;
	}

	useEffect(() => {
		// TODO: Can we operate with out this?
	}, [controller.store.pagination]);

	if (layout) {
		let LayoutElements;
		if (typeof layout == 'function') {
			LayoutElements = containerize(controller, layout({ controller }) || []);
		} else {
			LayoutElements = containerize(controller, layout || []);
		}

		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__layout', className)}>
							{/* loop through layout component tree built above and render comonents with props within Flex and FlexItem components */}
							<LayoutElements />
						</div>
					</CacheProvider>
				</ThemeProvider>
			</ControllerProvider>
		);
	} else {
		return <></>;
	}
});

function generateLayoutClassName(name?: string) {
	const normalizedName = name
		?.trim()
		.split(/\.?(?=[A-Z])/)
		.join('-')
		.toLowerCase();
	return name ? `ss__layout__${normalizedName}` : '';
}

function containerize(controller: SearchController, layout: LayoutElement[]) {
	return () => {
		return (
			<Fragment>
				{layout.map((element) => {
					// if (element.if) {
					// 	// not rendering due to conditional `if` render prop
					// 	const rendering = checkCondition(controller, element.if);
					// 	if (!rendering) return;
					// }

					if (element.items) {
						const containerElement = element;

						let InnerContainer;
						if (element.component) {
							const itemElement = element;
							const Component = componentMap[itemElement.component as keyof typeof componentMap];

							InnerContainer = () => (
								<Suspense fallback={<Fragment />}>
									<Component controller={controller} {...(itemElement.props as any)} breakpoints={{}}>
										<SearchLayout controller={controller} layout={element.items} />
									</Component>
								</Suspense>
							);
						} else {
							InnerContainer = containerize(controller, containerElement.items || []);
						}
						return (
							<Flex className={generateLayoutClassName(element.name)} {...element.layout}>
								<InnerContainer />
							</Flex>
						);
					} else {
						const itemElement = element;
						const Component = componentMap[itemElement.component as keyof typeof componentMap];

						return (
							<Flex
								className={classnames(generateLayoutClassName(itemElement.name), generateLayoutClassName(itemElement.component))}
								item
								{...itemElement.layout}
							>
								<Suspense fallback={<Fragment />}>
									<Component controller={controller} {...(itemElement.props as any)} breakpoints={{}} />
								</Suspense>
							</Flex>
						);
					}
				})}
			</Fragment>
		);
	};
}

// export type RenderConditions = 'results' | '!results';

export type LayoutElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	layout?: FlexProps;
	items?: LayoutElement[];
	// if?: RenderConditions;
} & Partial<
	| StringElement
	| BannerElement
	| BreadcrumbsElement
	| LoadingBarElement
	| PerPageElement
	| SortByElement
	| PaginationElement
	| SlideoutElement
	| FacetsElement
	| FilterSummaryElement
	| ResultsElement
	| RecommendationElement
>;

const componentMap = {
	Banner,
	Breadcrumbs,
	LoadingBar,
	PerPage,
	SortBy,
	Pagination,
	Slideout,
	Facets,
	FilterSummary,
	Results,
	Recommendation,
	String,
};

type StringElement = {
	component: 'String';
	props: StringProps;
};

type BannerElement = {
	component: 'Banner';
	props: BannerProps;
};

type BreadcrumbsElement = {
	component: 'Breadcrumbs';
	props: BreadcrumbProps;
};

type LoadingBarElement = {
	component: 'LoadingBar';
	props: LoadingBarProps;
};

type PerPageElement = {
	component: 'PerPage';
	props: PerPageProps;
};

type SortByElement = {
	component: 'SortBy';
	props: SortByProps;
};

type PaginationElement = {
	component: 'Pagination';
	props: PaginationProps;
};

type SlideoutElement = {
	component: 'Slideout';
	props: SlideoutProps;
};

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

type RecommendationElement = {
	component: 'Recommendation';
	props: RecommendationProps;
};

export type LayoutFunc = (data: { controller: SearchController }) => LayoutElement[];

export interface SearchLayoutProps extends ComponentProps {
	controller: SearchController;
	layout?: LayoutFunc | LayoutElement[];
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: LayoutFunc | LayoutElement[];
	};
}
