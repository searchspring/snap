/** @jsx jsx */
import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { Select, SelectProps } from '../Select';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import { parseProps } from '../../../utilities';

const CSS = {
	perPage: ({}) => css({}),
};

export const PerPage = observer((properties: PerPageProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	// const theme = { ...globalTheme, ...properties.theme };

	const props: PerPageProps = {
		// default props
		label: 'Per Page',
		// global theme
		...globalTheme?.components?.perPage,
		// props
		...properties,
		...properties.theme?.components?.perPage,
	};

	const parsedProps = parseProps(props.controller!, props);

	const { pagination, controller, label, disableStyles, className, style } = parsedProps;

	const store = pagination || controller?.store?.pagination;

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
		styling.css = [CSS.perPage({}), style];
	} else if (style) {
		styling.css = [style];
	}
	// options can be an Array or ObservableArray - but should have length
	return store?.pageSize ? (
		<CacheProvider>
			<Select
				{...styling}
				className={classnames('ss__perpage__select', className)}
				{...subProps.Select}
				label={label}
				options={store.pageSizeOptions}
				selected={{ label: `Show ${store.pageSize}`, value: store.pageSize }}
				onSelect={(e, option) => {
					store.setPageSize(+option!.value);
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

export interface PerPageProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	label?: string;
}
