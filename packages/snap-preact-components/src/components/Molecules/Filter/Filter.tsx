/** @jsx jsx */
import { h, Fragment } from 'preact';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps } from '../../Atoms/Icon';
import type { Filter as FilterType } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';

const CSS = {
	filter: () =>
		css({
			textDecoration: 'none',
			display: 'inline-flex',
			'& .ss__filter__button': {
				alignItems: 'center',
				'& .ss__filter__button__icon': {
					marginRight: '5px',
				},
			},
			'& .ss__filter__label': {
				marginRight: '5px',
				fontWeight: 'bold',
			},
		}),
};

// TODO: look into urlManager and how it connects in this case, left the href out for the time being
export const Filter = observer((properties: FilterProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: FilterProps = {
		// default props
		// global theme
		...globalTheme?.components?.filter,
		//props
		...properties,
		...properties.theme?.components?.filter,
	};

	const { filter, facetLabel, valueLabel, url, hideFacetLabel, onClick, icon, separator, disableStyles, className, style } = props;

	const link = filter?.url?.link || url?.link;
	const value = filter?.value.label || valueLabel;
	const label = filter?.facet.label || facetLabel;

	const subProps: FilterSubProps = {
		button: {
			// default props
			className: 'ss__filter__button',
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
		},
		icon: {
			// default props
			icon: 'close-thin',
			className: 'ss__filter__button__icon',
			size: '10px',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
				icon,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.filter(), style];
	} else if (style) {
		styling.css = [style];
	}
	return value ? (
		<CacheProvider>
			<a
				{...styling}
				className={classnames('ss__filter', className)}
				aria-label={!label ? value : `remove selected ${label} filter ${value}`}
				onClick={(e) => {
					link?.onClick && link.onClick(e);
					onClick && onClick(e);
				}}
				href={link?.href || '#'}
			>
				<Button {...subProps.button} disableA11y={true}>
					<Icon {...subProps.icon} />
					{!hideFacetLabel && (
						<span className="ss__filter__label">
							{label}
							{separator && <span className="ss__filter__label__separator">{separator}</span>}
						</span>
					)}
					<span className="ss__filter__value">{value}</span>
				</Button>
			</a>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface FilterProps extends ComponentProps {
	filter?: FilterType;
	facetLabel?: string;
	valueLabel?: string;
	url?: UrlManager;
	hideFacetLabel?: boolean;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	icon?: string;
	separator?: string;
}

interface FilterSubProps {
	button: ButtonProps;
	icon: IconProps;
}
