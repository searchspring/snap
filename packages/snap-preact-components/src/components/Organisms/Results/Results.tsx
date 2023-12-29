/** @jsx jsx */
import { Fragment, h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { SearchResultStore, Product, Banner } from '@searchspring/snap-store-mobx';
import { ContentType } from '@searchspring/snap-store-mobx';
import { InlineBanner, InlineBannerProps } from '../../Atoms/Merchandising/InlineBanner';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, ResultsLayout, ResultsLayoutType, BreakpointsProps, StylingCSS, ResultComponent } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { SearchResultTracker } from '../../Trackers/SearchResultTracker';

const CSS = {
	results: ({ columns, gapSize }: Partial<ResultsProps>) =>
		css({
			display: 'flex',
			flexFlow: 'row wrap',
			gap: gapSize,
			gridTemplateRows: 'auto',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,

			'& .ss__result, & .ss__result-layout': {
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

				'& .ss__result, & .ss__result-layout': {
					width: 'initial',
					flex: undefined,
					margin: 0,
				},
			},
		}),
};

export const Results = observer((properties: ResultsProps): JSX.Element => {
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

	const defaultProps: Partial<ResultsProps> = {
		results: properties.controller?.store?.results,
		columns: 4,
		gapSize: '20px',
		layout: ResultsLayout.GRID,
		breakpoints: defaultBreakpointsProps,
	};

	let props = mergeProps('results', globalTheme, defaultProps, properties);

	if (!properties.theme?.name) {
		// breakpoint settings are calculated in ThemeStore for snap templates
		const displaySettings = useDisplaySettings(props?.breakpoints || {});
		const theme = deepmerge(props?.theme || {}, displaySettings?.theme || {}, { arrayMerge: (destinationArray, sourceArray) => sourceArray });
		props = {
			...props,
			...displaySettings,
			theme,
		};
	}

	const { disableStyles, resultComponent, className, layout, style, theme, styleScript, controller } = props;

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
	const stylingProps = { ...props, columns: layout == ResultsLayout.LIST ? 1 : props.columns, gapSize: props.gapSize, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.results(stylingProps), style];
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
								// TODO: wrap with SearchResultTracker component (need to create)
								if (resultComponent && controller) {
									const ResultComponent = resultComponent;
									return <ResultComponent controller={controller} result={result} theme={theme} />;
								} else {
									return (
										<SearchResultTracker result={result} controller={controller as SearchController}>
											<Result
												key={(result as Product).id}
												{...subProps.result}
												result={result as Product}
												layout={props.layout}
												controller={controller}
											/>
										</SearchResultTracker>
									);
								}
						}
					})()
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface ResultsProps extends ComponentProps {
	results?: SearchResultStore;
	columns?: number;
	rows?: number;
	gapSize?: string;
	layout?: ResultsLayoutType;
	breakpoints?: BreakpointsProps;
	controller?: SearchController | AutocompleteController | RecommendationController;
	resultComponent?: ResultComponent;
}

interface ResultsSubProps {
	result: Partial<ResultProps>;
	inlineBanner: Partial<InlineBannerProps>;
}
