/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';
import { HierarchyValue } from '@searchspring/snap-store-mobx';

const CSS = {
	hierarchy: ({ theme }: { theme: Theme }) =>
		css({
			'& .ss__facet-hierarchy-options__option': {
				display: 'flex',
				padding: '6px 0',
				textDecoration: 'none',
				alignItems: 'center',
				'&:hover': {
					cursor: 'pointer',
					background: theme.colors?.hover,
				},
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme.colors?.primary,
					'&:hover': {
						cursor: 'default',
						background: 'unset',
					},
					'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
						paddingLeft: '16px',
					},
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						content: `'\\0000ab'`,
						padding: '0 2px 0 0',
						color: theme.colors?.primary,
					},
				},
				'& .ss__facet-hierarchy-options__option__value': {
					marginLeft: '8px',
					'& .ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		}),
};

export const FacetHierarchyOptions = observer((properties: FacetHierarchyOptionsProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: FacetHierarchyOptionsProps = {
		// default props
		// global theme
		...globalTheme?.components?.facetHierarchyOptions,
		//props
		...properties,
		...properties.theme?.components?.facetHierarchyOptions,
	};

	const { values, hideCount, onClick, disableStyles, previewOnFocus, valueProps, className, style } = props;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.hierarchy({ theme }), style];
	} else if (style) {
		styling.css = [style];
	}

	return values?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__facet-hierarchy-options', className)}>
				{values.map((value) => (
					<a
						className={classnames(
							'ss__facet-hierarchy-options__option',
							{ 'ss__facet-hierarchy-options__option--filtered': value.filtered },
							{ 'ss__facet-hierarchy-options__option--return': value.history && !value.filtered }
						)}
						href={value.url?.link?.href}
						onClick={(e: React.MouseEvent<Element, MouseEvent>) => {
							value.url?.link?.onClick(e);
							onClick && onClick(e);
						}}
						onFocus={() => previewOnFocus && value.preview && value.preview()}
						{...valueProps}
					>
						<span className="ss__facet-hierarchy-options__option__value">
							{value.label}
							{!hideCount && value.count && value.count > 0 && !value.filtered && (
								<span className="ss__facet-hierarchy-options__option__value__count">({value.count})</span>
							)}
						</span>
					</a>
				))}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});
export interface FacetHierarchyOptionsProps extends ComponentProps {
	values: HierarchyValue[];
	hideCount?: boolean;
	onClick?: (e: React.MouseEvent) => void;
	previewOnFocus?: boolean;
	valueProps?: any;
}
