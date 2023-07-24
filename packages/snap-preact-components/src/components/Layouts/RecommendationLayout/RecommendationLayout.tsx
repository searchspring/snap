/** @jsx jsx */
import { h, Fragment } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { ThemeProvider } from '../../../providers';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Flex, FlexProps } from '../../Atoms/Flex/Flex';
import { Theme, useTheme, CacheProvider, ControllerProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

import type { RecommendationController } from '@searchspring/snap-controller';
import type { ComponentProps, StylingCSS } from '../../../types';

import type { ImageProps } from '../../Atoms/Image';
import type { IconProps } from '../../Atoms/Icon/Icon';
import type { StringProps } from '../../Atoms/String/String';
import type { ButtonProps } from '../../Atoms/Button/Button';
import type { CarouselLayoutProps } from '../CarouselLayout/CarouselLayout';
import type { ResultsProps } from '../../Organisms/Results';

// dynamically imported lazy loaded components
const Image = lazy(async () => {
	return (await import('../../Atoms/Image')).Image;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String')).String;
});

const Icon = lazy(async () => {
	return (await import('../../Atoms/Icon')).Icon;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button')).Button;
});

const CarouselLayout = lazy(async () => {
	return (await import('../CarouselLayout')).CarouselLayout;
});

const Results = lazy(async () => {
	return (await import('../../Organisms/Results')).Results;
});

// CSS in JS
const CSS = {
	layout: ({}: Partial<RecommendationLayoutProps>) =>
		css({
			position: 'relative',
		}),
};

export const RecommendationLayout = observer((properties: RecommendationLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.recommendationLayout,
		// props
		...properties,
		...properties.theme?.components?.recommendationLayout,
	};
	const { controller, breakpoints, disableStyles, className, style, theme } = props;
	let layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({}), style];
	} else if (style) {
		styling.css = [style];
	}

	if (breakpoints) {
		const displaySettings = useDisplaySettings(breakpoints);
		if (displaySettings) {
			if (typeof displaySettings == 'function') {
				layout = displaySettings as RecommendationLayoutFunc;
			} else if (Array.isArray(displaySettings)) {
				layout = displaySettings;
			}
		}
	}

	if (layout) {
		let LayoutElements;
		if (typeof layout == 'function') {
			LayoutElements = containerize({ controller }, layout({ controller }) || []);
		} else {
			LayoutElements = containerize({ controller }, layout || []);
		}

		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__recomendation-layout', className)}>
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
	return name ? `ss__recommendation-layout__${normalizedName}` : '';
}

function containerize(data: { controller: RecommendationController }, layout: RecommendationLayoutElement[]) {
	const { controller } = data;
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
										<RecommendationLayout controller={controller} layout={element.items as RecommendationLayoutElement[]} />
									</Component>
								</Suspense>
							);
						} else {
							InnerContainer = containerize({ controller }, containerElement.items || []);
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

export type RecommendationLayoutElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	layout?: FlexProps;
	items?: RecommendationLayoutElement[];
} & Partial<ImageElement | StringElement | IconElement | ButtonElement | CarouselLayoutElement | ResultsElement>;

const componentMap = {
	Image,
	String,
	Icon,
	Button,
	CarouselLayout,
	Results,
};

type ResultsElement = {
	component: 'Results';
	props: ResultsProps;
};

type CarouselLayoutElement = {
	component: 'CarouselLayout';
	props: CarouselLayoutProps;
};

type StringElement = {
	component: 'String';
	props: StringProps;
};

type IconElement = {
	component: 'Icon';
	props: IconProps;
};

type ImageElement = {
	component: 'Image';
	props: ImageProps;
};

type ButtonElement = {
	component: 'Button';
	props: ButtonProps;
};

export type RecommendationLayoutFunc = (data: { controller: RecommendationController }) => RecommendationLayoutElement[];
export type RecommendationLayoutFuncWrapper = () => RecommendationLayoutFunc | RecommendationLayoutElement[];

export interface RecommendationLayoutProps extends ComponentProps {
	controller: RecommendationController;
	layout?: RecommendationLayoutFunc | RecommendationLayoutElement[];
	width?: string;
	height?: string;
	breakpoints?: {
		[key: number]: RecommendationLayoutFuncWrapper;
	};
}
