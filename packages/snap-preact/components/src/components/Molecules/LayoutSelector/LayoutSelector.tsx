import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, ListOption, StylingCSS } from '../../../types';
import { Select, SelectProps } from '../Select';
import { List, ListProps } from '../List';
import { RadioList, RadioListProps } from '../RadioList';

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

	const { options, selected, type, onSelect, label, showSingleOption, disableStyles, className, style, styleScript } = props;

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
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.LayoutSelector(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

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
}
