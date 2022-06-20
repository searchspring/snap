/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	searchInput: ({ theme }: { theme: Theme }) =>
		css({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			border: `1px solid ${theme.colors?.primary || '#ccc'}`,

			'& .ss__icon': {
				padding: '5px',
			},

			'& .ss__search-input__input': {
				width: '100%',
				outline: 'none',
				border: '0',
				boxSizing: 'border-box',
			},
		}),
};

export const SearchInput = observer((properties: SearchInputProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	let props: SearchInputProps = {
		// default props
		placeholder: 'Search',
		hideIcon: false,
		// global theme
		...globalTheme?.components?.searchInput,
		//props
		...properties,
		...properties.theme?.components?.searchInput,
	};

	const { placeholder, onChange, hideIcon, disableStyles, style, className } = props;

	const subProps: SearchInputSubProps = {
		icon: {
			// default props
			className: 'ss__search-input__icon',
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

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.searchInput({ theme }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__search-input', className)}>
				{!hideIcon && <Icon {...subProps.icon} icon="search" />}
				<input
					type="text"
					className="ss__search-input__input"
					onChange={(e) => {
						onChange && onChange(e);
					}}
					placeholder={placeholder}
				/>
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	hideIcon?: boolean;
}

interface SearchInputSubProps {
	icon: IconProps;
}
