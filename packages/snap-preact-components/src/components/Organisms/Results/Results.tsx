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
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	results: ({ columns, gapSize, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gridTemplateRows: 'auto',
			gap: gapSize,
			...style,
		}),
};

const defaultBreakpointsProps = {
	0: {
		columns: 1,
	},
	540: {
		columns: 2,
	},
	768: {
		columns: 3,
	},
	991: {
		columns: 4,
	},
};

export const Results = observer((properties: ResultsProp): JSX.Element => {
	const globalTheme: Theme = useTheme();

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

	const displaySettings = useDisplaySettings(props.breakpoints);
	if (displaySettings && Object.keys(displaySettings).length) {
		props = {
			...props,
			...displaySettings,
		};
	}

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

	let results;
	if (props?.columns > 0 && props?.rows > 0) {
		results = props.results.slice(0, props.columns * props.rows);
	} else {
		results = props.results;
	}

	return results?.length ? (
		<CacheProvider>
			<div
				css={!disableStyles && CSS.results({ columns: layout == Layout.LIST ? 1 : props.columns, gapSize: props.gapSize, style })}
				className={classnames('ss__results', className)}
			>
				{results.map((result) =>
					(() => {
						switch (result.type) {
							case BannerType.BANNER:
								return <InlineBanner key={result.uid} {...subProps.inlineBanner} banner={result} layout={props.layout} />;
							default:
								return <Result key={result.uid} {...subProps.result} result={result} layout={props.layout} controller={controller} />;
						}
					})()
				)}
			</div>
		</CacheProvider>
	) : null;
});

export interface ResultsProp extends ComponentProps {
	results?: ResultType[] | InlineBannerContent[];
	columns?: number;
	rows?: number;
	gapSize?: string;
	layout?: LayoutType;
	breakpoints?: BreakpointsProps;
	controller?: SearchController | AutocompleteController | RecommendationController;
}

export type BreakpointsProps = {
	[key: number]: BreakpointsEntry;
};

export type BreakpointsEntry = {
	[property: string]: any;
};
interface ResultsSubProps {
	result: ResultProps;
	inlineBanner: InlineBannerProps;
}
