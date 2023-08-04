/** @jsx jsx */
import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Select, SelectProps } from '../Select';
import { SearchSortingStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';

const CSS = {
	sortBy: ({}) => css({}),
};

export const SortBy = observer((properties: SortByProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	// const theme = { ...globalTheme, ...properties.theme };

	const props: SortByProps = {
		// default props
		label: 'Sort By',
		// global theme
		...globalTheme?.components?.Sortby,
		// props
		...properties,
		...properties.theme?.components?.Sortby,
	};

	const { sorting, controller, label, disableStyles, className, style } = props;

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
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.sortBy({}), style];
	} else if (style) {
		styling.css = [style];
	}
	// options can be an Array or ObservableArray - but should have length
	return store?.current ? (
		<CacheProvider>
			<Select
				{...styling}
				className={classnames('ss__sortby__select', className)}
				{...subProps.Select}
				label={label}
				options={store.options}
				selected={store.current}
				onSelect={(e, selection) => {
					selection?.url.go();
				}}
			/>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface SelectSubProps {
	Select: SelectProps;
}

export interface SortByProps extends ComponentProps {
	sorting?: SearchSortingStore;
	controller?: SearchController;
	label?: string;
}
