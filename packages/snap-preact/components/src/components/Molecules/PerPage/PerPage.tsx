import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Select, SelectProps } from '../Select';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { RadioList, RadioListProps } from '../RadioList';
import { List, ListProps } from '../List';

const CSS = {
	perPage: ({}: Partial<PerPageProps>) =>
		css({
			'.ss__button__content': {
				display: 'flex',
			},
		}),
};

export const PerPage = observer((properties: PerPageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<PerPageProps> = {
		label: 'Per Page',
		type: 'dropdown',
	};

	const props = mergeProps('perPage', globalTheme, defaultProps, properties);

	const { pagination, type, controller, label, disableStyles, className, style, styleScript, treePath } = props;

	const store = pagination || controller?.store?.pagination;

	const subProps: SelectSubProps = {
		select: {
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
		styling.css = [CSS.perPage(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	const selectedOption = store && store?.pageSizeOptions?.find((option) => option.value == store?.pageSize);

	// options can be an Array or ObservableArray - but should have length
	return store?.pageSize && typeof store?.pageSizeOptions == 'object' && store.pageSizeOptions?.length ? (
		<CacheProvider>
			{type?.toLowerCase() == 'dropdown' && (
				<Select
					{...styling}
					className={classnames('ss__perpage__select', className)}
					{...subProps.select}
					label={label}
					options={store.pageSizeOptions}
					selected={selectedOption}
					onSelect={(e, option) => {
						store.setPageSize(+option!.value);
					}}
				/>
			)}

			{type?.toLowerCase() == 'list' && (
				<List
					{...styling}
					className={classnames('ss__perpage__list', className)}
					{...subProps.List}
					onSelect={(e: any, option: any) => {
						store.setPageSize(+option!.value);
					}}
					options={store.pageSizeOptions}
					selected={store.pageSizeOption}
					titleText={label}
				/>
			)}

			{type?.toLowerCase() == 'radio' && (
				<RadioList
					{...styling}
					className={classnames('ss__perpage__radioList', className)}
					{...subProps.RadioList}
					onSelect={(e: any, option: any) => {
						store.setPageSize(+option!.value);
					}}
					options={store.pageSizeOptions}
					selected={store.pageSizeOption}
					titleText={label}
				/>
			)}
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface SelectSubProps {
	select: Partial<SelectProps>;
	RadioList: Partial<RadioListProps>;
	List: Partial<ListProps>;
}

export interface PerPageProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	label?: string;
	type?: 'dropdown' | 'list' | 'radio';
}
