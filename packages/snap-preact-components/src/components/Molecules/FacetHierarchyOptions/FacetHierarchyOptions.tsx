/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, HierarchyFacetValue } from '../../../types';

const CSS = {
	list: ({ style }) =>
		css({
			...style,
		}),
	listOption: ({ theme }) =>
		css({
			display: 'flex',
			padding: '6px 0',
			textDecoration: 'none',
			alignItems: 'center',
			'&:hover': {
				cursor: 'pointer',
				background: theme.colors?.hover,
			},
		}),
	textWrapper: () =>
		css({
			display: 'inline-block',
		}),
	valueLabel: ({ theme }) =>
		css({
			marginLeft: '8px',

			'&$filtered': {
				color: theme.colors.primary,
			},
		}),
	countLabel: ({ theme }) =>
		css({
			fontSize: '0.8em',
			marginLeft: '6px',

			'&$filtered': {
				color: theme.colors.primary,
			},
		}),
	filtered: () =>
		css({
			fontWeight: 'bold',
			'&:hover': {
				cursor: 'default',
				background: 'unset',
			},
			'& ~ .ss-hierarchy__link:not(.filtered)': {
				paddingLeft: '16px',
			},
		}),
	return: ({ theme }) =>
		css({
			'&:before': {
				content: `'\\0000ab'`,
				padding: '0 2px 0 0',
				color: theme.colors.primary,
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

		return (
			values?.length && (
				<div className={classnames('ss-hierarchy', !disableStyles && CSS.list({ style }), className)}>
					{values.map((value) => (
						<a
							className={classnames('ss-hierarchy__link', { filtered: value.filtered }, { history: value.history && !value.filtered })}
							css={
								!disableStyles &&
								css`
									${CSS.listOption({ theme })} ${value.filtered && CSS.filtered()} ${value.history && !value.filtered && CSS.return({ theme })}
								`
							}
							onClick={onClick}
							{...value.url?.link}
						>
							<div css={!disableStyles && CSS.textWrapper()}>
								<span css={!disableStyles && CSS.valueLabel({ theme })}>{value.label}</span>
								{!hideCount && value.count > 0 && !value.filtered && (
									<span css={!disableStyles && CSS.countLabel({ theme })} className={'ss-facetCount'}>
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
	values: HierarchyFacetValue[];
	hideCount?: boolean;
	onClick?: (e: Event) => void;
}
