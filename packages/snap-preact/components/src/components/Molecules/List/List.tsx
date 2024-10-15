import { Fragment, h } from 'preact';

import { useState } from 'preact/hooks';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import deepmerge from 'deepmerge';
import { filters } from '@searchspring/snap-toolbox';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties, ListOption } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { Lang, useA11y, useLang } from '../../../hooks';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	List: ({ horizontal }: Partial<ListProps>) =>
		css({
			display: 'flex',
			flexDirection: horizontal ? 'row' : 'column',
			alignItems: horizontal ? 'center' : undefined,
			justifyItems: 'flex-start',
			gap: '5px',

			'.ss__list__options': {
				border: 'none',
				listStyle: 'none',
				padding: '0px',
				margin: '0px',
				display: 'flex',
				flexDirection: horizontal ? 'row' : 'column',
				alignItems: horizontal ? 'center' : undefined,
				justifyItems: 'flex-start',
				gap: '5px',
			},

			'.ss__list__option': {
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				gap: '5px',

				'.ss__list__option__label , .ss__list__option__icon': {
					cursor: 'pointer',
				},
			},

			'&.ss__list--disabled, .ss__list__option--disabled': {
				cursor: 'none',
				pointerEvents: 'none',
				opacity: 0.5,
			},

			'&.ss__list--disabled, .ss__list__option--unavailable': {
				cursor: 'pointer',
				opacity: 0.5,
			},

			'.ss__list__option--selected': {
				fontWeight: 'bold',
			},
		}),
};

export function List(properties: ListProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: ListProps = {
		// default props
		// global theme
		...globalTheme?.components?.list,
		// props
		...properties,
		...properties.theme?.components?.list,
	};

	const props = mergeProps('list', globalTheme, defaultProps, properties);

	const {
		titleText,
		onSelect,
		native,
		multiSelect,
		hideOptionLabels,
		hideOptionIcons,
		hideOptionCheckboxes,
		disabled,
		hideTitleText,
		options,
		requireSelection,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

	let selected = props.selected;

	const subProps: ListSubProps = {
		checkbox: {
			// default props
			native: native,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		icon: {
			// default props
			className: 'ss__list__option__icon',
			size: '16px',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.List(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	if (selected && !Array.isArray(selected)) {
		selected = [selected];
	}

	// selection state
	const [selection, setSelection] = useState((selected as ListOption[]) || []);

	// original selection state
	const [originalSelected] = useState((selected as ListOption[]) || []);
	// reset selection if 'selected' prop changes
	try {
		if (selected) {
			const originalSelectedstr = JSON.stringify(originalSelected);
			const selectedstr = JSON.stringify(selected);
			const selectionstr = JSON.stringify(selection);
			if (originalSelectedstr !== selectedstr && selectedstr !== selectionstr) {
				setSelection(selected);
			}
		}
	} catch (e) {
		// noop
	}

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: ListOption) => {
		let newArray: ListOption[];

		if (multiSelect) {
			if (selection.find((select) => select.value === option.value)) {
				newArray = [...selection];

				newArray.splice(
					newArray.findIndex((select) => select.value === option.value),
					1
				);

				if (newArray.length == 0 && requireSelection) {
					newArray = [option];
				}
			} else {
				newArray = [...selection, option];
			}
		} else {
			if (!requireSelection && selection.find((select) => select.value === option.value)) {
				newArray = [];
			} else {
				newArray = [option];
			}
		}

		if (onSelect) {
			onSelect(e, option, newArray);
		}

		setSelection(newArray);
	};

	//initialize lang
	const defaultLang = {};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		options,
		selectedOptions: selection,
	});

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__list', disabled ? 'ss__list--disabled' : '', className)}>
				{(titleText || lang?.title?.value) && !hideTitleText && (
					<label className="ss__list__title" {...mergedLang.title?.all}>
						{titleText}
					</label>
				)}

				<ul className={`ss__list__options`} role="listbox" aria-label={titleText}>
					{options.map((option: ListOption) => {
						const selected = selection.some((select: ListOption) => select.value == option.value);
						return (
							<li
								className={classnames(`ss__list__option ss__list__option--${filters.handleize(option.value?.toString())}`, {
									'ss__list__option--selected': selected,
									'ss__list__option--disabled': option?.disabled,
									'ss__list__option--unavailable': option?.available === false,
								})}
								ref={(e) => useA11y(e)}
								onClick={(e) => !disabled && !option?.disabled && makeSelection(e as any, option)}
								title={option.label}
								role="option"
								aria-selected={selected}
							>
								{!hideOptionCheckboxes && <Checkbox {...subProps.checkbox} checked={selected} disableA11y={true} />}

								{option.icon && !hideOptionIcons && (
									<Icon {...subProps.icon} {...(typeof option.icon == 'string' ? { icon: option.icon } : (option.icon as Partial<IconProps>))} />
								)}

								{!hideOptionLabels && (option.label || !option.icon) && (
									<label className="ss__list__option__label">{option.label || option.value}</label>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface ListProps extends ComponentProps {
	options: ListOption[];
	multiSelect?: boolean;
	hideOptionCheckboxes?: boolean;
	hideOptionLabels?: boolean;
	hideOptionIcons?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: ListOption, selected: ListOption[]) => void;
	titleText?: string;
	hideTitleText?: boolean;
	disabled?: boolean;
	horizontal?: boolean;
	native?: boolean;
	selected?: ListOption | ListOption[];
	requireSelection?: boolean;
	lang?: Partial<ListLang>;
}

export interface ListLang {
	title?: Lang<{
		options: ListOption[];
		selectedOptions: ListOption[];
	}>;
}

interface ListSubProps {
	checkbox: Partial<CheckboxProps>;
	icon: Partial<IconProps>;
}
