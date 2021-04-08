/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, defaultTheme } from '../../../providers/theme';
import { ComponentProps, ValueFacetHierarchyValue } from '../../../types';

const CSS = {
	list: ({ style }) =>
		css({
			...style,
		}),
	listOption: () =>
		css({
			display: 'flex',
			marginBottom: '12px',
			textDecoration: 'none',
			alignItems: 'center',

			'&:last-child': {
				marginBottom: '0',
			},

			'&:hover': {
				cursor: 'pointer',
			},
		}),
	textWrapper: () =>
		css({
			display: 'inline-block',
		}),
	valueLabel: ({ colorPalette }) =>
		css({
			marginLeft: '8px',

			'&$filtered': {
				color: colorPalette.primary,
			},
		}),
	countLabel: ({ colorPalette }) =>
		css({
			fontSize: '10px',
			marginLeft: '2px',

			'&$filtered': {
				color: colorPalette.primary,
			},
		}),
	filtered: () =>
		css({
			fontWeight: 'bold',
			'& ~ .ss-hierarchy__link:not(.filtered)': {
				paddingLeft: '20px',
			},
		}),
	return: () =>
		css({
			'&:before': {
				content: `'\\0000ab'`,
				padding: '0 2px 0 0',
			},
		}),
};

export const FacetHierarchyOptions = observer(
	(properties: FacetHierarchyOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetHierarchyOptionsProps = {
			// default props
			hideCheckbox: false,
			hideCount: false,
			disableStyles: false,
			// global theme
			...globalTheme?.components?.FacetHierarchyOptions,
			//props
			...properties,
			...properties.theme?.components?.FacetHierarchyOptions,
		};

		const { values, hideCount, onClick, disableStyles, className, style } = props;
		const colorPalette = theme.colors ? theme.colors : defaultTheme.colors;

		return (
			values?.length && (
				<div css={!disableStyles && CSS.list({ style })} className={classnames('ss-hierarchy', className)}>
					{values.map((value) => (
						<a
							className={classnames('ss-hierarchy__link', { filtered: value.filtered }, { history: value.history && !value.filtered })}
							css={
								!disableStyles &&
								css`
									${CSS.listOption()} ${value.filtered && CSS.filtered()} ${value.history && !value.filtered && CSS.return()}
								`
							}
							onClick={onClick}
							{...value.url?.link}
						>
							<div css={!disableStyles && CSS.textWrapper()}>
								<span css={!disableStyles && CSS.valueLabel({ colorPalette })}>{value.label}</span>
								{!hideCount && value.count > 0 && !value.filtered && (
									<span css={!disableStyles && CSS.countLabel({ colorPalette })} className={'ss-facetCount'}>
										({value.count})
									</span>
								)}
							</div>
						</a>
					))}
				</div>
			)
		);
	}
);
export interface FacetHierarchyOptionsProps extends ComponentProps {
	values: ValueFacetHierarchyValue[];
	hideCount?: boolean;
	onClick?: (e: Event) => void;
}
