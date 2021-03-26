/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, defaultTheme } from '../../../providers/theme';
import { ComponentProps, ValueFacetValue } from '../../../types';

const CSS = {
	grid: ({ columns, gapSize, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			...style,
		}),
	optionWrapper: () =>
		css({
			position: 'relative',
			'&:hover': {
				cursor: 'pointer',
			},
		}),
	gridOption: ({ colorPalette }) =>
		css({
			paddingTop: '100%',
			position: 'relative',
			background: '#F8F8F8',
			border: '1px solid #EBEBEB',
			fontSize: '12px',
			'&.filtered': {
				background: colorPalette.primary,
			},
		}),
	content: ({ colorPalette }) =>
		css({
			position: 'absolute',
			top: '50%',
			right: 0,
			left: 0,
			bottom: 0,
			textAlign: 'center',
			lineHeight: 0,
			fontSize: '12px',

			'&.filtered': {
				color: colorPalette.secondary,
			},
		}),
};

export const FacetGridOptions = observer(
	(properties: FacetGridOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetGridOptionsProps = {
			// default props
			disableStyles: false,
			columns: 4,
			gapSize: '8px',
			// global theme
			...globalTheme?.components?.facetGridOptions,
			// props
			...properties,
			...properties.theme?.components?.facetGridOptions,
		};

		const { values, columns, gapSize, onClick, disableStyles, className, style } = props;

		// using props or theme if no props, if no theme using defaultTheme
		const colorPalette = theme.colors ? theme.colors : defaultTheme.colors;

		return (
			values?.length && (
				<div css={!disableStyles && CSS.grid({ columns, gapSize, style })} className={classnames('ss-grid', className)}>
					{values.map((value) => (
						<a css={!disableStyles && CSS.optionWrapper()} className={'ss-grid-optionWrapper'} onClick={onClick} {...value.url?.link}>
							<div className={classnames('ss-grid-option', { filtered: value.filtered })} css={!disableStyles && CSS.gridOption({ colorPalette })} />
							<span className={classnames({ filtered: value.filtered })} css={!disableStyles && CSS.content({ colorPalette })}>
								{value.label}
							</span>
						</a>
					))}
				</div>
			)
		);
	}
);

export interface FacetGridOptionsProps extends ComponentProps {
	values: ValueFacetValue[];
	columns?: number;
	gapSize?: string;
	onClick?: (e: Event) => void;
}
