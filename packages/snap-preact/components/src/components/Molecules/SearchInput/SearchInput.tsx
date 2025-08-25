import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { MutableRef, StateUpdater, useState } from 'preact/hooks';
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
		'& .ss__search-input__button--close-search-button': {
			padding: '0px',
			border: '0px',
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
		treePath: globalTreePath,
		submitSearchButton: {
			icon: 'search',
		},
		clearSearchButton: {
			icon: 'close-thin',
		},
	};

	const props = mergeProps('searchInput', globalTheme, defaultProps, properties);

	props.submitSearchButton = {
		//defaults
		...defaultProps.submitSearchButton,
		//theme
		...props.submitSearchButton,
		//passed in properties
		...properties?.submitSearchButton,
	};
	props.clearSearchButton = {
		//defaults
		...defaultProps.clearSearchButton,
		//theme
		...props.clearSearchButton,
		//passed in properties
		...properties?.clearSearchButton,
	};
	props.closeSearchButton = {
		//defaults
		...defaultProps.closeSearchButton,
		//theme
		...props.closeSearchButton,
		//passed in properties
		...properties?.closeSearchButton,
	};

	const {
		placeholderText,
		value,
		submitSearchButton,
		closeSearchButton,
		clearSearchButton,
		inputRef,
		inputName,
		onChange,
		onClick,
		onKeyDown,
		onKeyUp,
		disabled,
		disableStyles,
		className,
		internalClassName,
		treePath,
	} = props;

	let inputValue: string | undefined;
	let setInputValue: undefined | StateUpdater<string>;

	const stateful = value === undefined;

	if (stateful) {
		[inputValue, setInputValue] = useState('');
	} else {
		inputValue = value;
	}

	const subProps: SearchInputSubProps = {
		submitSearchButton: {
			// default props
			...submitSearchButton,
			internalClassName: 'ss__search-input__button--submit-search-button',
			name: 'submit-search',

			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		clearSearchButton: {
			// default props
			...clearSearchButton,
			internalClassName: 'ss__search-input__button--clear-search-button',
			name: 'clear-search',

			onClick: () => {
				if (inputRef?.current) {
					//reset the input value
					(inputRef?.current as HTMLInputElement).value = '';
					//manually trigger the input event so our event listeners in useAcRenderedInput hook get triggered
					//and update pre-existing search inputs with new value
					(inputRef?.current as HTMLInputElement).dispatchEvent(new Event('input', { bubbles: true }));
				}

				setInputValue && setInputValue('');

				// @ts-ignore - this is a button, so it should have an onClick prop?
				clearSearchButton?.onClick && clearSearchButton.onClick();
			},
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		closeSearchButton: {
			// default props
			...closeSearchButton,
			internalClassName: 'ss__search-input__button--close-search-button',
			name: 'close-search',
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
		submitSearchButton: {
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
				className={classnames('ss__search-input', { 'ss__input--disabled': disabled }, className, internalClassName)}
				onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => !disabled && onClick && onClick(e)}
			>
				{closeSearchButton && <Button {...subProps.closeSearchButton} {...mergedLang.closeSearchButton.all} />}

				<input
					type="text"
					className="ss__search-input__input"
					{...mergedLang.placeholderText.attributes}
					value={inputValue}
					name={inputName}
					ref={inputRef}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown && onKeyDown(e)}
					onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyUp && onKeyUp(e)}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						if (setInputValue) {
							setInputValue(e.target.value || '');
						}
						onChange && onChange(e);
					}}
					disabled={disabled}
				/>

				<div className="ss__search-input__icons">
					{clearSearchButton && inputValue?.length ? <Button {...subProps.clearSearchButton} {...mergedLang.clearSearchButton.all} /> : null}

					{submitSearchButton && <Button {...subProps.submitSearchButton} {...mergedLang.submitSearchButton.all} />}
				</div>
			</div>
		</CacheProvider>
	);
});

export interface SearchInputProps extends ComponentProps {
	value?: string;
	placeholderText?: string;
	submitSearchButton?: Buttons;
	clearSearchButton?: Buttons;
	closeSearchButton?: Buttons;
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

type Buttons = Partial<ButtonProps> | false;

interface SearchInputSubProps {
	submitSearchButton: Partial<ButtonProps>;
	clearSearchButton: Partial<ButtonProps>;
	closeSearchButton: Partial<ButtonProps>;
}

export interface SearchInputLang {
	placeholderText?: LangAttributes<never>;
	closeSearchButton?: Lang<never>;
	clearSearchButton?: Lang<never>;
	submitSearchButton?: Lang<never>;
}
