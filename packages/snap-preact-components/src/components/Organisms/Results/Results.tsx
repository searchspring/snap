/** @jsx jsx */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

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

export const defaultResponsiveOptions: ResponsiveProps[] = [
	{
		viewport: 480,
		numAcross: 1,
		layout: Layout.LIST,
	},
	{
		viewport: 768,
		numAcross: 2,
	},
	{
		viewport: 1024,
		numAcross: 3,
	},
	{
		viewport: 1200,
		numAcross: 4,
	},
];

export const Results = observer(
	(properties: ResultsProp): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: ResultsProp = {
			// default props
			results: [],
			layout: Layout.GRID,
			responsive: defaultResponsiveOptions,
			// global theme
			...globalTheme?.components?.results,
			// props
			...properties,
			...properties.theme?.components?.results,
		};
		const { results, disableStyles, className, responsive, style } = props;

		const subProps: ResultsSubProps = {
			result: {
				// default props
				className: 'ss-results__result',
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
				className: 'ss-results__inlinebanner',
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

		const getDisplaySettings = (responsive: ResponsiveProps[]) => {
			let settings: ResponsiveProps | undefined;
			let resultWidthPecent;
			let maxResultsShown;

			const currentScreenWidth = window.innerWidth;
			let lowvp = 0;

			if (responsive && responsive.length) {
				const sortedList = responsive.sort((a, b) => (a.viewport > b.viewport ? 1 : -1));
				//loop through and find the desired responsive setting
				for (let i = 0; i < sortedList.length; i++) {
					let vpsettings = sortedList[i];
					//if its in the bounds or the last option
					if ((vpsettings.viewport >= currentScreenWidth && lowvp <= currentScreenWidth) || i + 1 === sortedList.length) {
						settings = vpsettings;
						break;
					} else {
						lowvp = vpsettings.viewport;
					}
				}
				//once found, do the math to find the values we need
				if (settings) {
					//layout override
					if (settings.layout) {
						layout = settings.layout;
					} else {
						//have this to reset it to default if user doesnt pass in layout
						// for each and every responsive option
						layout = props.layout;
					}
					if (settings.numAcross) {
						resultWidthPecent = Math.floor(100 / settings.numAcross);
					}
					if (settings.numRows) {
						if (layout === Layout.LIST) {
							maxResultsShown = settings.numRows;
						} else {
							maxResultsShown = settings.numAcross * settings.numRows;
						}
					}
				}
				//update the state
				setDisplaySettings({ resultWidthPecent, maxResultsShown, layout });
			}
		};

		if (displaySettings.maxResultsShown) {
			resultsToShow = results.slice(0, displaySettings.maxResultsShown);
		}

		return (
			resultsToShow?.length && (
				<div css={!disableStyles && CSS.results({ style })} className={classnames('ss-results', className)}>
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
										/>
									);
							}
						})()
					)}
				</div>
			)
		);
	}
);

export interface ResultsProp extends ComponentProps {
	results: ResultType[] | InlineBannerContent[];
	layout?: LayoutType;
	responsive?: ResponsiveProps[];
}

export interface ResponsiveProps {
	viewport: number;
	numAcross: number;
	numRows?: number;
	layout?: LayoutType;
}

interface ResultsSubProps {
	result: ResultProps;
	inlineBanner: InlineBannerProps;
}
