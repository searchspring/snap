/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, ValueFacetValue } from '../../../types';

const CSS = {
	grid: ({ columns, gapSize, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			...style,
		}),
	optionWrapper: ({ theme }) =>
		css({
			position: 'relative',
			border: `1px solid ${theme.colors?.primary}`,
			padding: '1em',
			'&.filtered': {
				background: theme.colors?.primary,
				color: theme.colors?.text?.secondary,
			},
			'&:hover:not(.filtered)': {
				cursor: 'pointer',
				background: theme.colors?.hover,
			},
			'::before': {
				content: '""',
				paddingBottom: '100%',
				display: 'block',
			},
		}),
	gridOption: () =>
		css({
			position: 'absolute',
			maxWidth: '100%',
			top: 'calc(50% - 0.5em)',
			bottom: '0',
			right: '0',
			left: '0',
			margin: 'auto',
			textAlign: 'center',
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

		const { values, columns, gapSize, onClick, previewOnFocus, valueProps, disableStyles, className, style } = props;

		return (
			values?.length && (
				<div css={!disableStyles && CSS.grid({ columns, gapSize, style })} className={classnames('ss-grid', className)}>
					{values.map((value) => (
						<a
							css={!disableStyles && CSS.optionWrapper({ theme })}
							className={classnames('ss-grid-optionWrapper', { filtered: value.filtered })}
							onClick={onClick}
							onFocus={() => {
								previewOnFocus && value.preview && value.preview();
							}}
							{...valueProps}
							{...value.url?.link}
						>
							<div className={classnames('ss-grid-option')} css={!disableStyles && CSS.gridOption()}>
								{value.label}
							</div>
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
	previewOnFocus?: boolean;
	valueProps?: any;
}
