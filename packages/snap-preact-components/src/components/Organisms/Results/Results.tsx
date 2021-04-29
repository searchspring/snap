/** @jsx jsx */
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { InlineBanner, InlineBannerProps } from '../../Atoms/Merchandising/InlineBanner';
import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, Layout, Result as ResultType, LayoutType, InlineBannerContent } from '../../../types';
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

const defaultResponsiveSettings: ResponsiveProps[] = [
	{
		viewport: 350,
		numAcross: 1,
	},
	{
		viewport: 450,
		numAcross: 2,
	},
	{
		viewport: 500,
		numAcross: 3,
	},
	{
		viewport: 600,
		numAcross: 5,
	},
	{
		viewport: 700,
		numAcross: 5,
	},
];

export const Results = observer(
	(properties: ResultsProp): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: ResultsProp = {
			// default props
			disableStyles: false,
			results: [],
			layout: Layout.GRID,
			responsive: defaultResponsiveSettings,
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
						if (layout === 'list') {
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
				<div
					css={
						!disableStyles &&
						css`
							${CSS.results({ style })}
						`
					}
					className={classnames('ss-results', className)}
				>
					{resultsToShow.map((result) => {
						if (result.type === 'banner') {
							return (
								<InlineBanner
									banner={result}
									width={displaySettings.resultWidthPecent ? `${displaySettings.resultWidthPecent}%` : undefined}
									layout={displaySettings.layout}
								/>
							);
						} else {
							return (
								<Result
									{...subProps.result}
									result={result}
									width={displaySettings.resultWidthPecent ? `${displaySettings.resultWidthPecent}%` : undefined}
									layout={displaySettings.layout}
								/>
							);
						}
					})}
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
