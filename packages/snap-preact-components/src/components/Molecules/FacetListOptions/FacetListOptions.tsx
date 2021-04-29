/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme } from '../../../providers/theme';
import { ComponentProps, ValueFacetValue } from '../../../types';
import { defined } from '../../../utilities';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox/Checkbox';

const CSS = {
	style: ({ style }) =>
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
	valueLabel: ({ theme }) =>
		css({
			marginLeft: '8px',
			'&$filtered': {
				color: theme.colors?.primary,
			},
		}),
	countLabel: ({ theme }) =>
		css({
			fontSize: '10px',
			marginLeft: '2px',
			'&$filtered': {
				color: theme.colors?.primary,
			},
		}),
};

export const FacetListOptions = observer(
	(properties: FacetListOptionsProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetListOptionsProps = {
			// default props
			hideCheckbox: false,
			hideCount: false,
			disableStyles: false,
			// global theme
			...globalTheme?.components?.facetListOptions,
			//props
			...properties,
			...properties.theme?.components?.facetListOptions,
		};

		const { values, hideCheckbox, hideCount, onClick, previewOnFocus, valueProps, disableStyles, className, style } = props;

		const subProps: FacetListOptionsSubProps = {
			checkbox: {
				// default props
				className: 'ss-facetList-checkbox',
				// global theme
				...globalTheme?.components?.checkbox,
				// inherited props
				...defined({
					disableStyles,
				}),
				// component theme overrides
				...theme?.components?.checkbox,
			},
		};

		return (
			values?.length && (
				<div css={!disableStyles && CSS.style({ style })} className={classnames('ss-list', className)}>
					{values.map((value) => (
						<a
							css={!disableStyles && CSS.listOption()}
							className={'ss-list__link'}
							onFocus={() => {
								previewOnFocus && value.preview && value.preview();
							}}
							{...valueProps}
							{...value.url?.link}
							onClick={(e) => {
								if (typeof onClick == 'function') {
									onClick(e);
								}

								value.url?.link?.onClick(e);
							}}
						>
							{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={value.filtered} />}
							<div css={!disableStyles && CSS.textWrapper()}>
								<span css={!disableStyles && CSS.valueLabel({ theme })}>{value.label}</span>
								{!hideCount && (
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

export interface FacetListOptionsProps extends ComponentProps {
	values: ValueFacetValue[];
	hideCheckbox?: boolean;
	hideCount?: boolean;
	onClick?: (e: any) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
}

interface FacetListOptionsSubProps {
	checkbox?: CheckboxProps;
}
