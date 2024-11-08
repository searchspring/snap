import { h, Fragment } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { mergeProps } from '../../../utilities';
import { ComponentProps, RootNodeProperties } from '../../../types';
import type { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import type { SearchController } from '@searchspring/snap-controller';
import deepmerge from 'deepmerge';
import { Lang, useLang } from '../../../hooks';

const CSS = {
	paginationInfo: ({}: Partial<PaginationInfoProps>) => css({}),
};

export const PaginationInfo = observer((properties: PaginationInfoProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const pagination = properties.controller?.store.pagination || properties.pagination;

	const defaultProps: Partial<PaginationInfoProps> = {
		infoText: `${pagination?.multiplePages ? `${pagination?.begin} - ${pagination?.end} of` : ''} ${`${pagination?.totalResults} result${
			pagination?.totalResults == 1 ? '' : 's'
		}`}`,
	};

	const props = mergeProps('paginationInfo', globalTheme, defaultProps, properties);

	const { controller, infoText, disableStyles, className, style, styleScript } = props;

	const store = pagination || controller?.store?.pagination;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.paginationInfo(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		infoText: {
			value: infoText,
			attributes: {
				'aria-label': `displaying ${pagination?.multiplePages ? `${pagination?.begin} - ${pagination?.end} of` : ''} ${
					pagination?.totalResults
				} result${pagination?.totalResults == 1 ? '' : 's'}`,
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
			<div {...styling} className={classnames('ss__pagination-info', className)} {...mergedLang.infoText?.all}></div>
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
