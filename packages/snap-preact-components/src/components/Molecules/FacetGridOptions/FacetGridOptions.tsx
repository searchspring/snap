/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, ValueFacetValue } from '../../../types';

const CSS = {
	grid: ({ columns, gapSize, theme, style }) =>
		css({
			display: 'grid',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,
			gap: gapSize,
			'& .ss-grid__option': {
				position: 'relative',
				border: `1px solid ${theme.colors?.primary}`,
				padding: '1em',
				'&.ss-grid__option-filtered': {
					background: theme.colors?.primary,
					color: theme.colors?.text?.secondary,
				},
				'&:hover:not(.ss-grid__option-filtered)': {
					cursor: 'pointer',
					background: theme.colors?.hover,
				},
				'::before': {
					content: '""',
					paddingBottom: '100%',
					display: 'block',
				},
				'& .ss-grid__option__value': {
					position: 'absolute',
					maxWidth: '100%',
					top: 'calc(50% - 0.5em)',
					bottom: '0',
					right: '0',
					left: '0',
					margin: 'auto',
					textAlign: 'center',
				},
			},
			...style,
		}),
};

export const FacetGridOptions = observer(
	(properties: FacetGridOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetGridOptionsProps = {
			// default props
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
				<div css={!disableStyles && CSS.grid({ columns, gapSize, theme, style })} className={classnames('ss-grid', className)}>
					{values.map((value) => (
						<a
							className={classnames('ss-grid__option', { 'ss-grid__option-filtered': value.filtered })}
							onClick={onClick}
							onFocus={() => previewOnFocus && value.preview && value.preview()}
							{...valueProps}
							{...value.url?.link}
						>
							<span className="ss-grid__option__value">{value.label}</span>
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
