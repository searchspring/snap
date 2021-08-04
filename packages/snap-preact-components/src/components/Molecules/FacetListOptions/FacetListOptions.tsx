/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider, cache } from '../../../providers';
import { ComponentProps, ValueFacetValue } from '../../../types';
import { defined } from '../../../utilities';
import { Checkbox, CheckboxProps } from '../../Molecules/Checkbox/Checkbox';

const CSS = {
	list: ({ theme, style, hideCheckbox }) =>
		css({
			'& .ss__facet-list-options__option': {
				display: 'flex',
				padding: '6px',
				textDecoration: 'none',
				alignItems: 'center',
				'&:hover': {
					cursor: 'pointer',
					background: theme.colors?.hover,
				},
				'&.ss__facet-list-options__option--filtered': {
					fontWeight: 'bold',
					color: theme.colors?.primary,
				},
				'& .ss__facet-list-options__option__value': {
					marginLeft: hideCheckbox ? '' : '8px',
					'& .ss__facet-list-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
			...style,
		}),
};

export const FacetListOptions = observer((properties: FacetListOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: FacetListOptionsProps = {
		// default props
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
			className: 'ss__facet-list-options__checkbox',
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
			<CacheProvider value={cache}>
				<div css={!disableStyles && CSS.list({ theme, style, hideCheckbox })} className={classnames('ss__facet-list-options', className)}>
					{values.map((value) => (
						<a
							className={classnames('ss__facet-list-options__option', { 'ss__facet-list-options__option--filtered': value.filtered })}
							onClick={onClick}
							onFocus={() => previewOnFocus && value.preview && value.preview()}
							{...valueProps}
							{...value.url?.link}
						>
							{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={value.filtered} />}
							<span className="ss__facet-list-options__option__value">
								{value.label}
								{!hideCount && value.count > 0 && <span className="ss__facet-list-options__option__value__count">({value.count})</span>}
							</span>
						</a>
					))}
				</div>
			</CacheProvider>
		)
	);
});

export interface FacetListOptionsProps extends ComponentProps {
	values: ValueFacetValue[];
	hideCheckbox?: boolean;
	hideCount?: boolean;
	onClick?: (e: any) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
}

interface FacetListOptionsSubProps {
	checkbox: CheckboxProps;
}
