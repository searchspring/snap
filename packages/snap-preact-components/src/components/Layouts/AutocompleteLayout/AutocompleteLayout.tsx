/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { ThemeProvider } from '../../../providers';
import deepmerge from 'deepmerge';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { defined } from '../../../utilities';
import { Flex, FlexProps } from '../../Atoms/Flex/Flex';
import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { createHoverProps } from '../../../toolbox';
import type { AutocompleteController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';
import type { FacetsProps } from '../../Organisms/Facets/Facets';
import type { RecommendationProps } from '../../Organisms/Recommendation/Recommendation';
import type { ResultsProps } from '../../Organisms/Results/Results';
import type { StringProps } from '../../Atoms/String/String';
import type { LoadingBarProps } from '../../Atoms/Loading/LoadingBar';
import type { ButtonProps } from '../../Atoms/Button/Button';
import type { BannerProps } from '../../Atoms/Merchandising';
import type { GroupedTermsProps } from '../../Atoms/GroupedTerms';
import type { TermsProps } from '../../Atoms/Terms';
import { SeeMoreProps } from '../../Molecules/SeeMore';
import { FacetDisplay } from '../../../types';

// dynamically imported lazy loaded components
const Banner = lazy(async () => {
	return (await import('../../Atoms/Merchandising/Banner')).Banner;
});

const SeeMore = lazy(async () => {
	return (await import('../../Molecules/SeeMore')).SeeMore;
});

const GroupedTerms = lazy(async () => {
	return (await import('../../Atoms/GroupedTerms')).GroupedTerms;
});

const Terms = lazy(async () => {
	return (await import('../../Atoms/Terms')).Terms;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button')).Button;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String')).String;
});

const LoadingBar = lazy(async () => {
	return (await import('../../Atoms/Loading')).LoadingBar;
});

const Facets = lazy(async () => {
	return (await import('../../Organisms/Facets')).Facets;
});

const Results = lazy(async () => {
	return (await import('../../Organisms/Results')).Results;
});

const Recommendation = lazy(async () => {
	return (await import('../../Organisms/Recommendation')).Recommendation;
});

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<AutocompleteLayoutProps>) =>
		css({
			width,
			height,
		}),
};

export const AutocompleteLayout = observer((properties: AutocompleteLayoutProps) => {
	const globalTheme: Theme = useTheme();

	let props: AutocompleteLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.flex,
		// props
		...properties,
		...properties.theme?.components?.flex,
	};

	const valueProps = createHoverProps();

	const themeDefaults: Theme = {
		components: {
			facet: {
				limit: 6,
				disableOverflow: true,
				disableCollapse: true,
				previewOnFocus: true,
				valueProps,
			},
			facetGridOptions: {
				columns: 3,
			},
			facetHierarchyOptions: {
				hideCount: true,
			},
			facetListOptions: {
				hideCheckbox: true,
				hideCount: true,
			},
			facetPaletteOptions: {
				hideLabel: true,
				columns: 3,
			},
			result: {
				hideBadge: true,
			},
		},
	};

	// merge deeply the themeDefaults with the theme props and the displaySettings theme props (do not merge arrays, but replace them)
	const theme = deepmerge(themeDefaults, props?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		theme,
	};

	const { controller, input, breakpoints, width, height, disableStyles, className, style } = props;
	let layout = props.layout;

	const subProps = {
		facets: {
			// default props
			limit: 3,
			facets: controller.store?.facets.length ? controller.store.facets.filter((facet) => facet.display !== FacetDisplay.SLIDER) : [],

			// global theme
			...globalTheme?.components?.facets,
			// inherited props
			...defined({
				disableStyles,
			}),
			theme: props.theme,
		},
	};

	const visible = Boolean(input === controller.store.state.focusedInput);

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	// TODO: make useDisplaySettings generic?
	const displaySettings = useDisplaySettings(breakpoints!);
	if (displaySettings && Object.keys(displaySettings).length) {
		layout = displaySettings as AutocompleteLayoutFunc;
	}

	useEffect(() => {
		// TODO: Can we operate with out this?
	}, [controller.store.pagination]);

	if (layout && visible) {
		let LayoutElements;
		if (typeof layout == 'function') {
			LayoutElements = containerize(controller, layout({ controller }) || [], subProps, input);
		} else {
			LayoutElements = containerize(controller, layout || [], subProps, input);
		}

		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__AClayout', className)}>
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
	return name ? `ss__AClayout__${normalizedName}` : '';
}

function containerize(controller: AutocompleteController, layout: AutocompleteLayoutElement[], subProps: any, input: Element) {
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
									<Component
										controller={controller}
										{...subProps[itemElement.component?.toLowerCase() as keyof typeof subProps]}
										{...(itemElement.props as any)}
										breakpoints={{}}
									>
										<AutocompleteLayout controller={controller} layout={element.items} input={input} />
									</Component>
								</Suspense>
							);
						} else {
							InnerContainer = containerize(controller, containerElement.items || [], subProps, input);
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
									<Component
										controller={controller}
										{...subProps[itemElement.component?.toLowerCase() as keyof typeof subProps]}
										{...(itemElement.props as any)}
										breakpoints={{}}
									/>
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

export type AutocompleteLayoutElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	layout?: FlexProps;
	items?: AutocompleteLayoutElement[];
	// if?: RenderConditions;
} & Partial<
	| BannerElement
	| SeeMoreElement
	| GroupedTermsElement
	| TermsElement
	| ButtonElement
	| StringElement
	| LoadingBarElement
	| FacetsElement
	| ResultsElement
	| RecommendationElement
>;

const componentMap = {
	Banner,
	SeeMore,
	GroupedTerms,
	Terms,
	Button,
	String,
	LoadingBar,
	Facets,
	Results,
	Recommendation,
};

type SeeMoreElement = {
	component: 'SeeMore';
	props: SeeMoreProps;
};

type StringElement = {
	component: 'String';
	props: StringProps;
};

type BannerElement = {
	component: 'Banner';
	props: BannerProps;
};

type GroupedTermsElement = {
	component: 'GroupedTerms';
	props: GroupedTermsProps;
};

type TermsElement = {
	component: 'Terms';
	props: TermsProps;
};

type ButtonElement = {
	component: 'Button';
	props: ButtonProps;
};

type LoadingBarElement = {
	component: 'LoadingBar';
	props: LoadingBarProps;
};

type FacetsElement = {
	component: 'Facets';
	props: FacetsProps;
};

type ResultsElement = {
	component: 'Results';
	props: ResultsProps;
};

type RecommendationElement = {
	component: 'Recommendation';
	props: RecommendationProps;
};

export type AutocompleteLayoutFunc = (data: { controller: AutocompleteController }) => AutocompleteLayoutElement[];

export interface AutocompleteLayoutProps extends ComponentProps {
	controller: AutocompleteController;
	layout?: AutocompleteLayoutFunc | AutocompleteLayoutElement[];
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: AutocompleteLayoutFunc | AutocompleteLayoutElement[];
	};
	input: Element;
}
