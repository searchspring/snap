import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, ListOption, RootNodeProperties } from '../../../types';
import { Select, SelectProps } from '../Select';
import { List, ListProps } from '../List';
import { RadioList, RadioListProps } from '../RadioList';
import { Lang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	LayoutSelector: ({}: Partial<LayoutSelectorProps>) => css({}),
};

export const LayoutSelector = observer((properties: LayoutSelectorProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<LayoutSelectorProps> = {
		label: 'Layout',
		type: 'dropdown',
		showSingleOption: false,
		selected: properties.options && properties.options.length ? properties.options[0] : undefined,
	};

	const props = mergeProps('layoutSelector', globalTheme, defaultProps, properties);

	const { options, selected, type, onSelect, showSingleOption, label, disableStyles, className, style, styleScript, treePath } = props;

	const subProps: SelectSubProps = {
		Select: {
			// global theme
			...globalTheme?.components?.select,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		RadioList: {
			// global theme
			...globalTheme?.components?.radioList,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		List: {
			multiSelect: false,
			horizontal: true,
			hideOptionCheckboxes: true,
			// global theme
			...globalTheme?.components?.list,
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
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.LayoutSelector(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		label: {
			value: label,
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});

	// options can be an Array or ObservableArray - but should have length
	return (options && options.length > 1) || (options?.length === 1 && showSingleOption) ? (
		<CacheProvider>
			{type?.toLowerCase() == 'dropdown' && (
				<Select
					{...styling}
					className={classnames('ss__layout__select', className)}
					{...subProps.Select}
					label={label}
					options={options}
					selected={selected}
					onSelect={(e, option) => {
						onSelect(e, option);
					}}
					lang={{
						buttonLabel: lang.label,
					}}
				/>
			)}

			{type?.toLowerCase() == 'list' && (
				<List
					{...styling}
					className={classnames('ss__layout__list', className)}
					{...subProps.List}
					onSelect={(e, option: ListOption) => {
						onSelect(e, option);
					}}
					options={options}
					selected={selected}
					titleText={label}
					lang={{
						title: lang.label,
					}}
				/>
			)}

			{type?.toLowerCase() == 'radio' && (
				<RadioList
					{...styling}
					className={classnames('ss__layout__radioList', className)}
					{...subProps.RadioList}
					onSelect={(e, option: ListOption) => {
						onSelect(e, option);
					}}
					options={options}
					selected={selected}
					titleText={label}
					lang={{
						title: lang.label,
					}}
				/>
			)}
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});
interface SelectSubProps {
	Select: Partial<SelectProps>;
	RadioList: Partial<RadioListProps>;
	List: Partial<ListProps>;
}

export interface LayoutSelectorProps extends ComponentProps {
	onSelect: (e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLElement>, option?: ListOption) => void;
	options?: ListOption[];
	selected?: ListOption;
	label?: string;
	type?: 'dropdown' | 'list' | 'radio';
	showSingleOption?: boolean;
	lang?: Partial<LayoutSelectorLang>;
}

export interface LayoutSelectorLang {
	label: Lang<{
		options: ListOption[];
		selectedOptions: ListOption[];
	}>;
}
