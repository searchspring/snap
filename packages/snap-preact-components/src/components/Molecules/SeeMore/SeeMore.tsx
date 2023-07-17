/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined } from '../../../utilities';
import { ComponentProps, StylingCSS } from '../../../types';
import { parseProps } from '../../../utilities';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { AutocompleteController } from '@searchspring/snap-controller';

const CSS = {
	SeeMore: () => css({}),
};

export const SeeMore = observer((properties: SeeMoreProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SeeMoreProps = {
		// default props
		content: 'See More',
		icon: 'angle-right',
		// global theme
		...globalTheme?.components?.string,
		// props
		...properties,
		...properties.theme?.components?.string,
	};

	const parsedProps = parseProps(props.controller!, props);
	const { onClick, icon, iconColor, disableStyles, className, style, controller } = parsedProps;

	if (controller?.store) {
		const { pagination, filters, search, state } = (properties.controller as AutocompleteController).store;

		props.content = `See ${pagination.totalResults} ${filters.length > 0 ? 'filtered' : ''} result${pagination.totalResults == 1 ? '' : 's'} for "${
			search.query?.string
		}"`;

		props.href = state.url.href;
	}

	const subProps: SeeMoreSubProps = {
		Icon: {
			// default props
			className: 'ss__see-more__icon',
			size: '10px',
			color: iconColor,
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const { href, content } = props;

	const styling: { css?: StylingCSS } = {};

	if (!disableStyles) {
		styling.css = [CSS.SeeMore(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (controller as AutocompleteController)?.store.results.length ? (
		<CacheProvider>
			<a {...styling} className={classnames('ss__see-more', className)} href={href} onClick={(e) => onClick && onClick(e)}>
				{content}
				{icon && <Icon icon={icon} {...subProps.Icon} />}
			</a>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface SeeMoreProps extends ComponentProps {
	contoller?: AutocompleteController;
	content?: string;
	href?: string;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	icon?: IconType | string;
	iconColor?: string;
}

interface SeeMoreSubProps {
	Icon: IconProps;
}
