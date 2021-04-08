/** @jsx jsx */
import { h } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Result, ResultProps } from '../../Molecules/Result';
import { ComponentProps, Layout, Result as ResultType, LayoutType } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	results: ({ style }) =>
		css({
			display: 'flex',
			flexWrap: 'wrap',
			...style,
		}),
	list: () =>
		css({
			flexDirection: 'column',
		}),
	grid: () => undefined,
};

export const Results = observer(
	(properties: ResultsProp): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: ResultsProp = {
			// default props
			disableStyles: false,
			results: [],
			layout: Layout.GRID,
			// global theme
			...globalTheme?.components?.results,
			// props
			...properties,
			...properties.theme?.components?.results,
		};

		const { results, layout, disableStyles, className, style } = props;

		const subProps: ResultSubProps = {
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
		};

		return (
			results?.length && (
				<div
					css={
						!disableStyles &&
						css`
							${CSS.results({ style })} ${CSS[layout]()}
						`
					}
					className={classnames('ss-results', className)}
				>
					{results.map((result) => (
						<Result {...subProps.result} result={result} />
					))}
				</div>
			)
		);
	}
);

export interface ResultsProp extends ComponentProps {
	results: ResultType[];
	layout: LayoutType;
}

interface ResultSubProps {
	result: ResultProps;
}
