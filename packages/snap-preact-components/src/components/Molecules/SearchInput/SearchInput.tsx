/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState, useRef } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import deepmerge from 'deepmerge';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, BreakpointsProps } from '../../../types';
import { useDisplaySettings } from '../../../hooks/useDisplaySettings';

const CSS = {
	searchInput: ({ theme, subProps }) =>
		css({
			margin: '16px 0 0 0',
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			'& .ss__search-input__wrapper': {
				display: 'flex',
				alignItems: 'center',
				width: '100%',
				height: '35px',
				border: `1px solid ${theme.colors?.primary || '#ccc'}`,
				borderRadius: '4px',
				'& .ss__search-input__wrapper__icon': {
					display: 'flex',
					alignItems: 'center',
					height: '100%',
					paddingLeft: '0.5rem',
					paddingRight: '0.5rem',
				},
				'& .ss__search-input__wrapper__input': {
					display: 'flex',
					alignItems: 'center',
					width: `calc(100% - 1rem - 2px - ${subProps?.icon?.width || subProps?.icon?.size || '30px'})`,
					height: '100%',
					outline: '2px solid transparent',
					outlineOffset: '2px',
					paddingRight: '16px',
					border: '0',
					boxSizing: 'border-box',
				},
			},
		}),
};

export const SearchInput = observer((properties: SearchInputProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	let props: SearchInputProps = {
		// default props
		placeholder: 'Search',
		// global theme
		...globalTheme?.components?.searchInput,
		//props
		...properties,
		...properties.theme?.components?.searchInput,
	};

	const { placeholder, onChange, disableStyles, style, className } = props;

	const subProps: SearchInputSubProps = {
		icon: {
			// default props
			className: 'ss__search-input__wrapper__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.searchInput({ theme, subProps }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search-input', className)}>
				<div className="ss__search-input__wrapper">
					<div className="ss__search-input__wrapper__icon">
						<Icon {...subProps.icon} icon="search" />
					</div>
					<input
						type="text"
						className="ss__search-input__wrapper__input"
						onChange={(e) => {
							onChange && onChange(e);
						}}
						placeholder={placeholder}
					/>
				</div>
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
}

interface SearchInputSubProps {
	icon: IconProps;
}
