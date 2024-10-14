import { h, Fragment } from 'preact';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import type { Filter as FilterType } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const CSS = {
	filter: ({}: Partial<FilterProps>) =>
		css({
			textDecoration: 'none',
			display: 'inline-flex',
			'& .ss__filter__button': {
				alignItems: 'center',
				'& .ss__filter__button__icon': {
					margin: '0 5px 0 0',
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
	const defaultProps: Partial<FilterProps> = {};

	const props = mergeProps('filter', globalTheme, defaultProps, properties);

	const { filter, facetLabel, valueLabel, url, hideFacetLabel, onClick, icon, separator, disableStyles, className, style, styleScript, treePath } =
		props;

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
			treePath,
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
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.filter(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	//initialize lang
	const defaultLang = {
		filter: {
			attributes: {
				'aria-label': !label ? value : `remove selected ${label} filter ${value}`,
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		label,
		value,
	});

	return value ? (
		<CacheProvider>
			<a
				{...styling}
				className={classnames('ss__filter', className)}
				onClick={(e) => {
					link?.onClick && link.onClick(e);
					onClick && onClick(e);
				}}
				href={link?.href}
				{...mergedLang.filter?.attributes}
			>
				<Button {...subProps.button} disableA11y={true}>
					<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} />
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
	icon?: IconType | Partial<IconProps>;
	separator?: string;
	lang?: Partial<FilterLang>;
}

export interface FilterLang {
	filter: Lang<{
		label?: string;
		value?: string;
	}>;
}

interface FilterSubProps {
	button: ButtonProps;
	icon: IconProps;
}

export type FilterNames = 'clear-all';
