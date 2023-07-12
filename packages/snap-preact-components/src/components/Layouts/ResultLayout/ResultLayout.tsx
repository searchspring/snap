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

import type { SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { ComponentProps, StylingCSS } from '../../../types';

import type { ImageProps } from '../../Atoms/Image';
import type { BadgeProps } from '../../Atoms/Badge/Badge';
import type { StringProps } from '../../Atoms/String/String';
import type { PriceProps } from '../../Atoms/Price/Price';
import type { ButtonProps } from '../../Atoms/Button/Button';
import type { FormattedNumberProps } from '../../Atoms/FormattedNumber/FormattedNumber';
import type { DropdownProps } from '../../Atoms/Dropdown/Dropdown';
import type { CarouselProps } from '../../Molecules/Carousel/Carousel';
import type { CheckboxProps } from '../../Molecules/Checkbox/Checkbox';
import type { SelectProps } from '../../Molecules/Select/Select';

// dynamically imported lazy loaded components
const Image = lazy(async () => {
	return (await import('../../Atoms/Image')).Image;
});

const Badge = lazy(async () => {
	return (await import('../../Atoms/Badge')).Badge;
});

const String = lazy(async () => {
	return (await import('../../Atoms/String/')).String;
});

const Price = lazy(async () => {
	return (await import('../../Atoms/Price/')).Price;
});

const Button = lazy(async () => {
	return (await import('../../Atoms/Button/')).Button;
});

const FormattedNumber = lazy(async () => {
	return (await import('../../Atoms/FormattedNumber/')).FormattedNumber;
});

const Dropdown = lazy(async () => {
	return (await import('../../Atoms/Dropdown/')).Dropdown;
});

const Carousel = lazy(async () => {
	return (await import('../../Molecules/Carousel/')).Carousel;
});

const Checkbox = lazy(async () => {
	return (await import('../../Molecules/Checkbox/')).Checkbox;
});

const Select = lazy(async () => {
	return (await import('../../Molecules/Select/')).Select;
});

/*
	TODO:
		* swatch component
		* ratings component
*/

// CSS in JS
const CSS = {
	layout: ({ width, height }: Partial<ResultLayoutProps>) =>
		css({
			position: 'relative',
			width,
			height,
		}),
};

export const ResultLayout = observer((properties: ResultLayoutProps) => {
	const globalTheme: Theme = useTheme();

	const props: ResultLayoutProps = {
		// default props

		// global theme
		...globalTheme?.components?.flex,
		// props
		...properties,
		...properties.theme?.components?.flex,
	};
	const { controller, result, width, height, disableStyles, className, style, theme } = props;
	const layout = props.layout;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.layout({ width, height }), style];
	} else if (style) {
		styling.css = [style];
	}

	useEffect(() => {
		// TODO: Can we operate with out this?
	}, [controller.store.pagination]);

	if (layout) {
		let LayoutElements;
		if (typeof layout == 'function') {
			LayoutElements = containerize({ controller, result }, layout({ controller, result }) || []);
		} else {
			LayoutElements = containerize({ controller, result }, layout || []);
		}

		return (
			<ControllerProvider controller={controller}>
				<ThemeProvider theme={theme || {}}>
					<CacheProvider>
						<div {...styling} className={classnames('ss__resultLayout', className)}>
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
	return name ? `ss__result-layout__${normalizedName}` : '';
}

function containerize(data: { controller: SearchController; result: Product }, layout: ResultLayoutElement[]) {
	const { controller, result } = data;
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
										<ResultLayout controller={controller} result={result} layout={element.items as ResultLayoutElement[]} />
									</Component>
								</Suspense>
							);
						} else {
							InnerContainer = containerize({ controller, result }, containerElement.items || []);
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

export type ResultLayoutElement = {
	name?: string;
	type?: 'Flex'; // supported layout container elements
	layout?: FlexProps;
	items?: ResultLayoutElement[];
} & Partial<
	| BadgeElement
	| ImageElement
	| StringElement
	| PriceElement
	| ButtonElement
	| FormattedNumberElement
	| DropdownElement
	| CarouselElement
	| CheckboxElement
	| SelectElement
>;

const componentMap = {
	Badge,
	Image,
	String,
	Price,
	Button,
	FormattedNumber,
	Dropdown,
	Carousel,
	Checkbox,
	Select,
};

type StringElement = {
	component: 'String';
	props: StringProps;
};

type BadgeElement = {
	component: 'Badge';
	props: BadgeProps;
};

type ImageElement = {
	component: 'Image';
	props: ImageProps;
};

type PriceElement = {
	component: 'Price';
	props: PriceProps;
};

type ButtonElement = {
	component: 'Button';
	props: ButtonProps;
};

type FormattedNumberElement = {
	component: 'FormattedNumber';
	props: FormattedNumberProps;
};

type DropdownElement = {
	component: 'Dropdown';
	props: DropdownProps;
};

type CarouselElement = {
	component: 'Carousel';
	props: CarouselProps;
};

type CheckboxElement = {
	component: 'Checkbox';
	props: CheckboxProps;
};

type SelectElement = {
	component: 'Select';
	props: SelectProps;
};

export type ResultLayoutFunc = (data: { controller: SearchController; result: Product }) => ResultLayoutElement[];

export interface ResultLayoutProps extends ComponentProps {
	controller: SearchController;
	result: Product;
	layout: ResultLayoutFunc | ResultLayoutElement[];
	width?: string;
	height?: string;
}
