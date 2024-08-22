import { Fragment, h } from 'preact';
import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import type { RecommendationController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, BreakpointsProps, StylingCSS, ResultComponent } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';
import { RecommendationProfileTracker } from '../../Trackers/Recommendation/ProfileTracker';
import { RecommendationResultTracker } from '../../Trackers/Recommendation/ResultTracker';

const CSS = {
	results: ({ columns, gapSize }: Partial<RecommendationGridProps>) =>
		css({
			overflow: 'auto',
			maxWidth: '100%',
			maxHeight: '100%',
			'.ss__recommendation-grid__results': {
				display: 'flex',
				flexFlow: 'row wrap',
				gap: gapSize,
				gridTemplateRows: 'auto',
				gridTemplateColumns: `repeat(${columns}, 1fr)`,

				'@supports (display: grid)': {
					display: 'grid',
				},
			},
		}),
};

export const RecommendationGrid = observer((properties: RecommendationGridProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<RecommendationGridProps> = {
		results: properties.controller?.store?.results,
		gapSize: '20px',
	};

	let props = mergeProps('recommendationGrid', globalTheme, defaultProps, properties);

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

	const { disableStyles, title, resultComponent, trim, className, style, theme, styleScript, controller } = props;

	const subProps: RecommendationGridSubProps = {
		result: {
			// default props
			className: 'ss__recommendation-grid__result',
			// global theme
			...globalTheme?.components?.result,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	let results = props.results || controller.store.results;
	if (!props.columns && !props.rows) {
		props.rows = 1;
		props.columns = results.length;
	} else if (props.columns && !props.rows) {
		props.rows = Math.floor(results.length / props.columns);

		if (trim) {
			const remainder = results.length % props.columns;
			results = results.slice(0, results.length - remainder);
		}
	} else if (props.rows && !props.columns) {
		if (trim) {
			const remainder = results.length % props.rows;
			results = results.slice(0, results.length - remainder);
		}

		props.columns = Math.ceil(results.length / props.rows);
	} else if (props?.columns && props?.rows && props.columns > 0 && props.rows > 0) {
		results = results?.slice(0, props.columns * props.rows);
	}

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, columns: props.columns, gapSize: props.gapSize, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.results(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return results?.length ? (
		<CacheProvider>
			<RecommendationProfileTracker controller={controller}>
				<div {...styling} className={classnames('ss__recommendation-grid', className)}>
					{title && <h3 className="ss__recommendation-grid__title">{title}</h3>}

					<div className="ss__recommendation-grid__results">
						{results.map((result) =>
							(() => {
								if (resultComponent && controller) {
									const ResultComponent = resultComponent;
									return <ResultComponent controller={controller} result={result as Product} theme={theme} />;
								} else {
									return (
										<RecommendationResultTracker result={result as Product} controller={controller}>
											<Result key={(result as Product).id} {...subProps.result} result={result as Product} controller={controller} />
										</RecommendationResultTracker>
									);
								}
							})()
						)}
					</div>
				</div>
			</RecommendationProfileTracker>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationGridProps extends ComponentProps {
	controller: RecommendationController;
	title?: string;
	results?: Product[];
	columns?: number;
	rows?: number;
	gapSize?: string;
	trim?: boolean;
	breakpoints?: BreakpointsProps;
	resultComponent?: ResultComponent;
}

interface RecommendationGridSubProps {
	result: Partial<ResultProps>;
}
