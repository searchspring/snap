/** @jsx jsx */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

import { InlineBanner, InlineBannerProps } from '../../Atoms/Merchandising/InlineBanner';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, Layout, Result as ResultType, LayoutType, InlineBannerContent, BannerType } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	results: ({ style }) =>
		css({
			display: 'flex',
			flexWrap: 'wrap',
			...style,
		}),
};

export const Results = observer((properties: ResultsProp): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: ResultsProp = {
		// default props
		results: [],
		layout: Layout.GRID,
		// global theme
		...globalTheme?.components?.results,
		// props
		...properties,
		...properties.theme?.components?.results,
	};
	const { results, disableStyles, className, responsive, style, controller } = props;

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
			...props.theme?.components?.result,
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
			...props.theme?.components?.inlineBanner,
		},
	};

	let resultsToShow = results;
	let layout = props.layout;

	const [displaySettings, setDisplaySettings] = useState({
		resultWidthPecent: undefined,
		maxResultsShown: undefined,
		layout: layout,
	});

	if (responsive) {
		useEffect(() => {
			// Handler to call on window resize
			function handleResize() {
				// Set display settings to state
				getDisplaySettings(responsive);
			}
			// Add event listener
			window.addEventListener('resize', handleResize);

			// Call handler right away so state gets updated with initial window size
			handleResize();

			// Remove event listener on cleanup
			return () => window.removeEventListener('resize', handleResize);
		}, []); // Empty array ensures that effect is only run on mount
	}

	const getDisplaySettings = (responsive: ResponsiveProps) => {
		let settings: ResponsiveEntry;
		let resultWidthPecent;
		let maxResultsShown;

		const currentScreenWidth = window.innerWidth;
		const sortedList = Object.keys(responsive)
			?.sort((a, b) => parseInt(a) - parseInt(b))
			.map((vp) => ({ [vp]: responsive[vp] }));
		if (sortedList.length) {
			//loop through and find the desired responsive setting
			for (let i = 0; i < sortedList.length; i++) {
				const entry = sortedList[i];
				const breakpoint = parseInt(Object.keys(entry)[0]);
				const isLastEntry = i + 1 === sortedList.length;
				const isFirstEntry = i === 0;
				if (isLastEntry || (isFirstEntry && currentScreenWidth < breakpoint)) {
					// last entry or a '0' value breakpoint was not provided
					settings = sortedList[i][breakpoint];
					break;
				} else {
					const nextBreakpoint = parseInt(Object.keys(sortedList[i + 1])[0]);
					if (currentScreenWidth >= breakpoint && currentScreenWidth < nextBreakpoint) {
						settings = sortedList[i][breakpoint];
						break;
					}
				}
			}
			//once found, do the math to find the values we need
			if (settings) {
				//layout override
				if (settings?.layout && Object.values(Layout).includes(settings.layout)) {
					layout = settings.layout;
				} else {
					//have this to reset it to default if user doesnt pass in layout
					// for each and every responsive option
					layout = props.layout;
				}
				if (settings?.numAcross > 0) {
					resultWidthPecent = Math.floor(100 / settings.numAcross);
				}
				if (settings?.numRows > 0) {
					if (layout === Layout.LIST) {
						maxResultsShown = settings.numRows;
					} else {
						maxResultsShown = settings.numRows * settings.numAcross;
					}
				}
			}
			//update the state
			setDisplaySettings({ resultWidthPecent, maxResultsShown, layout });
		}
	};

	if (displaySettings.maxResultsShown) {
		resultsToShow = results.slice(0, displaySettings.maxResultsShown);
	} else {
		resultsToShow = results;
	}

	return resultsToShow?.length ? (
		<div css={!disableStyles && CSS.results({ style })} className={classnames('ss__results', className)}>
			{resultsToShow.map((result) =>
				(() => {
					switch (result.type) {
						case BannerType.BANNER:
							return (
								<InlineBanner
									{...subProps.inlineBanner}
									banner={result}
									width={displaySettings.resultWidthPecent ? `${displaySettings.resultWidthPecent}%` : undefined}
									layout={displaySettings.layout}
								/>
							);
						default:
							return (
								<Result
									{...subProps.result}
									result={result}
									width={displaySettings.resultWidthPecent ? `${displaySettings.resultWidthPecent}%` : undefined}
									layout={displaySettings.layout}
									controller={controller}
								/>
							);
					}
				})()
			)}
		</div>
	) : null;
});

export interface ResultsProp extends ComponentProps {
	results: ResultType[] | InlineBannerContent[];
	layout?: LayoutType;
	responsive?: ResponsiveProps;
	controller?: SearchController | AutocompleteController | RecommendationController;
}

export interface ResponsiveProps {
	[key: number]: ResponsiveEntry;
}
interface ResponsiveEntry {
	numAcross: number;
	numRows?: number;
	layout?: LayoutType;
}

interface ResultsSubProps {
	result: ResultProps;
	inlineBanner: InlineBannerProps;
}
