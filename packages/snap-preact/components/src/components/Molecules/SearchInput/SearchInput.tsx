import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { IconType } from '../../Atoms/Icon';
import { MutableRef } from 'preact/hooks';
import { Button, ButtonProps } from '../../Atoms/Button';
import deepmerge from 'deepmerge';
import { Lang, LangAttributes, useLang } from '../../../hooks/useLang';

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
		'& .ss__search-input__icons': {
			display: 'flex',
			alignItems: 'center',

			'& .ss__button': {
				padding: '0px',
				border: '0px',
			},
		},
	});
};

export const SearchInput = observer((properties: SearchInputProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();
	const defaultProps: Partial<SearchInputProps> = {
		placeholderText: 'Search',
		searchIcon: 'search',
		treePath: globalTreePath,
	};

	const props = mergeProps('searchInput', globalTheme, defaultProps, properties);

	const {
		placeholderText,
		value,
		closeSearchIcon,
		onCloseSearchClick,
		//  onImageSearchClick, imageSearchIcon,
		onSearchIconClick,
		searchIcon,
		clearSearchIcon,
		onClearSearchClick,
		inputRef,
		inputName,
		onChange,
		onClick,
		onKeyDown,
		onKeyUp,
		disabled,
		disableStyles,
		className,
		treePath,
	} = props;

	const subProps: SearchInputSubProps = {
		searchIcon: {
			// default props
			className: 'ss__search-input__button--search-icon',
			name: 'search-icon',
			onClick: onSearchIconClick,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		clearSearchIcon: {
			// default props
			className: 'ss__search-input__button--clear-search-icon',
			name: 'clear-search-icon',
			onClick: () => {
				if (inputRef?.current) {
					//reset the input value
					(inputRef?.current as HTMLInputElement).value = '';
					//manually trigger the input event so our event listeners in useAcRenderedInput hook get triggered
					//and update pre-existing search inputs with new value
					(inputRef?.current as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));
				}
				onClearSearchClick && onClearSearchClick();
			},
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		// imageSearchIcon: {
		// 	// default props
		// 	className: 'ss__search-input__button--image-search-icon',
		// 	name: 'image-search-icon',
		// 	onClick: onImageSearchClick,
		// 	// inherited props
		// 	...defined({
		// 		disableStyles,
		// 	}),
		// 	// component theme overrides
		// 	theme: props?.theme,
		// 	treePath,
		// },
		closeSearchIcon: {
			// default props
			className: 'ss__search-input__button--close-search-icon',
			name: 'close-search-icon',
			onClick: onCloseSearchClick,
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

	//initialize lang
	const defaultLang: Partial<SearchInputLang> = {
		placeholderText: {
			attributes: {
				placeholder: placeholderText,
			},
		},
		closeSearchButton: {
			attributes: {
				'aria-label': 'Close Search',
			},
		},
		clearSearchButton: {
			attributes: {
				'aria-label': 'Clear Search',
			},
		},
		searchButton: {
			attributes: {
				'aria-label': 'Submit Search',
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {});

	return (
		<CacheProvider>
			<div
				{...styling}
				className={classnames('ss__search-input', { 'ss__input--disabled': disabled }, className)}
				onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => !disabled && onClick && onClick(e)}
			>
				{closeSearchIcon && (
					<Button
						{...subProps.closeSearchIcon}
						{...(typeof closeSearchIcon == 'string' ? { icon: closeSearchIcon } : closeSearchIcon)}
						{...mergedLang.closeSearchButton.all}
					/>
				)}

				<input
					type="text"
					className="ss__search-input__input"
					{...mergedLang.placeholderText.attributes}
					value={value}
					name={inputName}
					ref={inputRef}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown(e)}
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyUp && onKeyUp(e)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e)}
					disabled={disabled}
				/>

				<div className="ss__search-input__icons">
					{/* {icons?.imageSearch?.icon && <Button {...subProps.imageSearchIcon} {...(typeof icons?.imageSearch?.icon == 'string' ? { icon: icons?.imageSearch?.icon } : (icons?.imageSearch?.icon))} />} */}
					{clearSearchIcon && value?.length ? (
						<Button
							{...subProps.clearSearchIcon}
							{...(typeof clearSearchIcon == 'string' ? { icon: clearSearchIcon } : clearSearchIcon)}
							{...mergedLang.clearSearchButton.all}
						/>
					) : null}

					{searchIcon && (
						<Button
							{...subProps.searchIcon}
							{...(typeof searchIcon == 'string' ? { icon: searchIcon } : searchIcon)}
							{...mergedLang.searchButton.all}
						/>
					)}
				</div>
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	value: string;
	placeholderText?: string;
	searchIcon?: Icons;
	clearSearchIcon?: Icons;
	closeSearchIcon?: Icons;
	onCloseSearchClick?: () => void;
	onClearSearchClick?: () => void;
	onSearchIconClick?: () => void;
	// imageSearchIcon?:Icons;
	// onImageSearchClick?: () => void;
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

type Icons = IconType | Partial<ButtonProps> | false;

interface SearchInputSubProps {
	searchIcon: Partial<ButtonProps>;
	// imageSearchIcon: Partial<ButtonProps>;
	clearSearchIcon: Partial<ButtonProps>;
	closeSearchIcon: Partial<ButtonProps>;
}

export interface SearchInputLang {
	placeholderText?: LangAttributes<never>;
	closeSearchButton?: Lang<never>;
	clearSearchButton?: Lang<never>;
	searchButton?: Lang<never>;
}
