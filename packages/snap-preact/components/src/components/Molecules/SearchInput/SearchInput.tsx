import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Icon, IconProps } from '../../Atoms/Icon/Icon';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { IconType } from '../../Atoms/Icon';
import { Lang } from '../../../hooks';
import { MutableRef } from 'preact/hooks';

const defaultStyles: StyleScript<SearchInputProps> = ({ theme }) => {
	return css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `1px solid ${theme?.variables?.colors?.primary || '#ccc'}`,

		'& .ss__icon': {
			padding: '5px',
		},

		'& .ss__search-input__input': {
			width: '100%',
			outline: 'none',
			border: '0',
			boxSizing: 'border-box',
		},
	});
};

export const SearchInput = observer((properties: SearchInputProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<SearchInputProps> = {
		placeholderText: 'Search',
		icon: 'search',
		treePath: globalTreePath,
	};

	const props = mergeProps('searchInput', globalTheme, defaultProps, properties);

	const { placeholderText, inputRef, inputName, onChange, onClick, onKeyDown, onKeyUp, icon, disabled, disableStyles, className, treePath } = props;

	const subProps: SearchInputSubProps = {
		icon: {
			// default props
			className: 'ss__search-input__icon',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<SearchInputProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__search-input', { 'ss__input--disabled': disabled }, className)}
				onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => !disabled && onClick && onClick(e)}
			>
				<input
					type="text"
					className="ss__search-input__input"
					placeholder={placeholderText}
					name={inputName}
					ref={inputRef}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown(e)}
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyUp && onKeyUp(e)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e)}
					disabled={disabled}
				/>

				{icon && <Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} />}
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	icon?: IconType | Partial<IconProps>;
	placeholderText?: string;
	inputName?: string;
	inputRef?: MutableRef<HTMLInputElement | null>;
	disabled?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	disableA11y?: boolean;
	lang?: Partial<SearchInputLang>;
}

interface SearchInputSubProps {
	icon: Partial<IconProps>;
}

export interface SearchInputLang {
	placeholderText?: Lang<never>;
}
