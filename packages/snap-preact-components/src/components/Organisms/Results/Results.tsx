/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { SearchResultStore, Product, Banner } from '@searchspring/snap-store-mobx';
import { ContentType } from '@searchspring/snap-store-mobx';
import { InlineBanner, InlineBannerProps } from '../../Atoms/Merchandising/InlineBanner';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, Layout, LayoutType, BreakpointsProps, StylingCSS } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	results: ({ columns, gapSize }: ResultsProp) =>
		css({
			display: 'flex',
			flexFlow: 'row wrap',
			gap: gapSize,
			gridTemplateRows: 'auto',
			gridTemplateColumns: columns && `repeat(${columns}, ${100 / columns}%)`,

			'& .ss__result': {
				boxSizing: 'border-box',
				flex: '0 1 auto',
				width: `calc(${100 / columns!}% - (${columns! - 1} * ${gapSize} / ${columns} ) )`,
				marginRight: gapSize,
				marginBottom: gapSize,

				[`&:nth-of-type(${columns}n)`]: {
					marginRight: '0',
				},
				[`&:nth-last-of-type(-n+${columns})`]: {
					marginBottom: '0',
				},
			},
			'@supports (display: grid)': {
				display: 'grid',

				'& .ss__result': {
					width: 'initial',
					margin: 0,
				},
			},
		}),
};

export const Results = observer((properties: ResultsProp): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultBreakpointsProps = {
		0: {
			columns: properties.columns || 1,
		},
		540: {
			columns: properties.columns || 2,
		},
		768: {
			columns: properties.columns || 3,
		},
		991: {
			columns: properties.columns || 4,
		},
	};

	let props: ResultsProp = {
		// default props
		results: properties.controller?.store?.results,
		columns: 4,
		gapSize: '20px',
		layout: Layout.GRID,
		breakpoints: defaultBreakpointsProps,
		// global theme
		...globalTheme?.components?.results,
		// props
		...properties,
		...properties.theme?.components?.results,
	};

	const displaySettings = useDisplaySettings(props?.breakpoints || {});
	const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });

	props = {
		...props,
		...displaySettings,
		theme,
	};

	const { disableStyles, className, layout, style, controller } = props;

	const subProps: ResultsSubProps = {
		result: {
			// default props
			className: 'ss__results__result',
			// global theme
			...globalTheme?.components?.result,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		inlineBanner: {
			// default props
			className: 'ss__results__inline-banner',
			// global theme
			...globalTheme?.components?.inlineBanner,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let results = props.results;
	if (props?.columns && props?.rows && props.columns > 0 && props.rows > 0) {
		results = props.results?.slice(0, props.columns * props.rows);
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.results({ columns: layout == Layout.LIST ? 1 : props.columns, gapSize: props.gapSize }), style];
	} else if (style) {
		styling.css = [style];
	}

	return results?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__results', `ss__results-${props.layout}`, className)}>
				{results.map((result) =>
					(() => {
						switch (result.type) {
							case ContentType.BANNER:
								return <InlineBanner {...subProps.inlineBanner} key={result.id} banner={result as Banner} layout={props.layout} />;
							default:
								return (
									<Result
										key={(result as Product).id}
										{...subProps.result}
										result={result as Product}
										layout={props.layout}
										controller={controller}
									/>
								);
						}
					})()
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface ResultsProp extends ComponentProps {
	results?: SearchResultStore;
	columns?: number;
	rows?: number;
	gapSize?: string;
	layout?: LayoutType;
	breakpoints?: BreakpointsProps;
	controller?: SearchController | AutocompleteController | RecommendationController;
}

interface ResultsSubProps {
	result: ResultProps;
	inlineBanner: InlineBannerProps;
}
