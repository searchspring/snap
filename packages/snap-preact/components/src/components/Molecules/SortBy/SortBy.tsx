import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, ListOption, RootNodeProperties } from '../../../types';
import { Select, SelectProps } from '../Select';
import { SearchSortingStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { RadioList, RadioListProps } from '../RadioList';
import { List, ListProps } from '../List';
import { Lang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	sortBy: ({}: Partial<SortByProps>) => css({}),
};

export const SortBy = observer((properties: SortByProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SortByProps> = {
		label: 'Sort By',
		type: 'dropdown',
	};

	const props = mergeProps('sortBy', globalTheme, defaultProps, properties);

	const { sorting, type, controller, label, disableStyles, className, style, styleScript, treePath } = props;

	const store = sorting || controller?.store?.sorting;

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
			hideOptionCheckboxes: true,
			horizontal: true,
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
		styling.css = [CSS.sortBy(stylingProps), style];
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
	return store?.current && typeof store?.options == 'object' && store.options?.length ? (
		<CacheProvider>
			{type?.toLowerCase() == 'dropdown' && (
				<Select
					{...styling}
					className={classnames('ss__sortby', 'ss__sortby__select', className)}
					{...subProps.Select}
					label={label}
					options={store.options}
					selected={store.current}
					onSelect={(e, selection) => {
						selection?.url?.go();
					}}
					lang={{
						buttonLabel: lang.label,
					}}
				/>
			)}

			{type?.toLowerCase() == 'list' && (
				<List
					{...styling}
					className={classnames('ss__sortby', 'ss__sortby__list', className)}
					{...subProps.List}
					options={store.options}
					selected={store.current}
					titleText={label}
					onSelect={(e, selection) => {
						selection?.url?.go();
					}}
					lang={{
						title: lang.label,
					}}
				/>
			)}

			{type?.toLowerCase() == 'radio' && (
				<RadioList
					{...styling}
					className={classnames('ss__sortby', 'ss__sortby__radioList', className)}
					{...subProps.RadioList}
					options={store.options}
					selected={store.current}
					titleText={label}
					onSelect={(e, selection) => {
						selection?.url?.go();
					}}
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

export interface SortByProps extends ComponentProps {
	sorting?: SearchSortingStore;
	controller?: SearchController;
	label?: string;
	type?: 'dropdown' | 'list' | 'radio';
	lang?: Partial<SortByLang>;
}

export interface SortByLang {
	label: Lang<{
		options: ListOption[];
		selectedOptions: ListOption[];
	}>;
}
