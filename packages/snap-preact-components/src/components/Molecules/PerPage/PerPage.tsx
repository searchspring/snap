/** @jsx jsx */
import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Select, SelectProps } from '../Select';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { RadioSelect, RadioSelectProps } from '../../Molecules/RadioSelect';

const CSS = {
	perPage: ({}: Partial<PerPageProps>) => css({}),
};

export const PerPage = observer((properties: PerPageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<PerPageProps> = {
		label: 'Per Page',
		type: 'Dropdown',
	};

	const props = mergeProps('perPage', globalTheme, defaultProps, properties);

	const { pagination, type, controller, label, disableStyles, className, style, styleScript } = props;

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
		},
		RadioSelect: {
			// global theme
			...globalTheme?.components?.radioSelect,
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
		styling.css = [CSS.perPage(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

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
					selected={{ label: `Show ${store.pageSize}`, value: store.pageSize }}
					onSelect={(e, option) => {
						store.setPageSize(+option!.value);
					}}
				/>
			)}

			{type?.toLowerCase() == 'list' && (
				<RadioSelect
					{...styling}
					className={classnames('ss__perpage__list', className)}
					{...subProps.RadioSelect}
					hideRadios={true}
					onSelect={(e: any, option: any) => {
						store.setPageSize(+option!.value);
					}}
					options={store.pageSizeOptions}
					selected={store.pageSize}
					titleText={label}
				/>
			)}

			{type?.toLowerCase() == 'radio' && (
				<RadioSelect
					{...styling}
					className={classnames('ss__perpage__radioList', className)}
					{...subProps.RadioSelect}
					onSelect={(e: any, option: any) => {
						store.setPageSize(+option!.value);
					}}
					options={store.pageSizeOptions}
					selected={store.pageSize}
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
	RadioSelect: Partial<RadioSelectProps>;
}

export interface PerPageProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	label?: string;
	type?: 'Dropdown' | 'List' | 'Radio';
}
