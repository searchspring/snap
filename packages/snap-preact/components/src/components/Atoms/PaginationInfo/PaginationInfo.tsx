import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import deepmerge from 'deepmerge';
import { Lang, useLang } from '../../../hooks';

const defaultStyles: StyleScript<PaginationInfoProps> = ({}) => {
	return css({});
};

export const PaginationInfo = observer((properties: PaginationInfoProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const pagination = properties.controller?.store.pagination || properties.pagination;

	const defaultProps: Partial<PaginationInfoProps> = {
		infoText: `${pagination?.multiplePages ? `${pagination?.begin} - ${pagination?.end} of` : ''} ${`${pagination?.totalResults} result${
			pagination?.totalResults == 1 ? '' : 's'
		}`}`,
		treePath: globalTreePath,
	};

	const props = mergeProps('paginationInfo', globalTheme, defaultProps, properties);

	const { controller, infoText, className, internalClassName } = props;

	const store = pagination || controller?.store?.pagination;

	const styling = mergeStyles<PaginationInfoProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		infoText: {
			value: infoText,
			attributes: {
				'aria-label': `displaying ${pagination?.multiplePages ? `${pagination?.begin} - ${pagination?.end} of` : ''} ${
					pagination?.totalResults
				} result${pagination?.totalResults == 1 ? '' : 's'} ${
					controller?.store?.search.query ? `for "${controller?.store?.search.query.string}"` : ''
				}`,
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		pagination: store,
	});

	return store?.totalResults ? (
		<CacheProvider>
			<div
				{...styling}
				aria-atomic={true}
				aria-live="assertive"
				className={classnames('ss__pagination-info', className, internalClassName)}
				{...mergedLang.infoText?.all}
			></div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface PaginationInfoProps extends ComponentProps {
	pagination?: SearchPaginationStore;
	controller?: SearchController;
	infoText?: string | ((data: PaginationInfoPropData) => string);
	lang?: Partial<PaginationInfoLang>;
}

export interface PaginationInfoLang {
	infoText: Lang<PaginationInfoPropData>;
}

interface PaginationInfoPropData {
	pagination?: SearchPaginationStore;
}
