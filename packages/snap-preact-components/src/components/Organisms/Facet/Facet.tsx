/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { FacetListOptions, FacetListOptionsProps } from '../../Molecules/FacetListOptions';
import { FacetGridOptions, FacetGridOptionsProps } from '../../Molecules/FacetGridOptions';
import { FacetPaletteOptions, FacetPaletteOptionsProps } from '../../Molecules/FacetPaletteOptions';
import { Slider, SliderProps } from '../../Molecules/Slider';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { ComponentProps, FacetDisplay, ValueFacet, RangeFacet, RangeBucketFacet, BaseFacet } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, defaultTheme } from '../../../providers/theme';

const CSS = {
	facet: ({ disableCollapse, color, theme, style }) =>
		css({
			'& .ss-facet__header': {
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				color: color || theme.colorPrimary || '#333',
			},
			'& .ss-dropdown': {
				'&.ss-open': {
					'& .ss-dropdown__content': {
						position: 'relative',
					},
				},
				'& .ss-dropdown__button': {
					cursor: disableCollapse ? 'default' : 'pointer',
				},
			},
			...style,
		}),
	options: () =>
		css({
			marginTop: '8px',
			maxHeight: '300px',
			overflowY: 'auto',
		}),
	icon: () =>
		css({
			marginRight: '8px',
		}),
	showMore: ({ theme }) =>
		css({
			color: theme.colorPrimary,
			display: 'block',
			textAlign: 'right',
			margin: '8px',
			cursor: 'pointer',
		}),
};

export const Facet = observer(
	(properties: FacetProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: FacetProps = {
			// default props
			disableCollapse: false,
			disableStyles: false,
			hideIcon: false,
			iconCollapse: 'angle-up',
			iconExpand: 'angle-down',
			// global theme
			...globalTheme?.components?.facet,
			// props
			...properties,
			...properties.theme?.components?.facet,
		};

		const {
			disableCollapse,
			facet,
			hideIcon,
			iconCollapse,
			iconExpand,
			optionsLimitCount,
			iconColor,
			color,
			previewOnFocus,
			valueProps,
			disableStyles,
			className,
			style,
		} = props;

		const subProps: FacetSubProps = {
			dropdown: {
				// default props
				disableClickOutside: true,
				// global theme
				...globalTheme?.components?.dropdown,
				// inherited props
				...defined({
					disableStyles,
				}),
				// component theme overrides
				...props.theme?.components?.dropdown,
			},
			facetListOptions: {
				// default props

				// global theme
				...globalTheme?.components?.facetListOptions,
				// inherited props
				...defined({
					disableStyles,
					previewOnFocus,
					valueProps,
				}),
				// component theme overrides
				...props.theme?.components?.facetListOptions,
			},
			facetGridOptions: {
				// default props

				// global theme
				...globalTheme?.components?.facetGridOptions,
				// inherited props
				...defined({
					disableStyles,
					previewOnFocus,
					valueProps,
				}),
				// component theme overrides
				...props.theme?.components?.facetGridOptions,
			},
			facetPaletteOptions: {
				// default props
				// global theme
				...globalTheme?.components?.facetPaletteOptions,
				// inherited props
				...defined({
					disableStyles,
					previewOnFocus,
					valueProps,
				}),
				// component theme overrides
				...props.theme?.components?.facetPaletteOptions,
			},
			slider: {
				// default props

				// global theme
				...globalTheme?.components?.slider,
				// inherited props
				...defined({
					disableStyles,
				}),
				// component theme overrides
				...props.theme?.components?.slider,
			},
			icon: {
				// default props
				className: 'ss-facet__button-icon',
				size: '12px',
				color: iconColor || color || theme.colorPrimary || '#333',
				// global theme
				...globalTheme?.components?.icon,
				// inherited props
				...defined({
					disableStyles,
				}),
				// component theme overrides
				...props.theme?.components?.icon,
			},
		};

		if ((facet as ValueFacet)?.overflow && optionsLimitCount) {
			(facet as ValueFacet).overflow.setLimit(optionsLimitCount);
		}

		return (
			<div css={!disableStyles && CSS.facet({ disableCollapse, color, theme, style })} className={classnames('ss-facet', className)}>
				<Dropdown
					open={!facet?.collapsed}
					onClick={(e) => {
						!disableCollapse && facet?.toggleCollapse();
					}}
					button={
						<div className={'ss-facet__header'}>
							{facet?.label}
							{!hideIcon && <Icon {...subProps.icon} icon={facet?.collapsed ? iconExpand : iconCollapse} />}
						</div>
					}
				>
					<div css={!disableStyles && CSS.options()} className={classnames('ss-facet-options', className)}>
						{(() => {
							switch (facet?.display) {
								case FacetDisplay.SLIDER:
									return <Slider {...subProps.slider} facet={facet as RangeFacet} />;
								case FacetDisplay.GRID:
									return <FacetGridOptions {...subProps.facetGridOptions} values={(facet as ValueFacet)?.refinedValues} />;
								case FacetDisplay.PALETTE:
									return <FacetPaletteOptions {...subProps.facetPaletteOptions} values={(facet as ValueFacet)?.refinedValues} />;
								default:
									return <FacetListOptions {...subProps.facetListOptions} values={(facet as ValueFacet)?.refinedValues} />;
							}
						})()}
					</div>
					{/* TODO: more configs for showmore showless */}

					{(facet as ValueFacet)?.overflow && (facet as ValueFacet).overflow.enabled && (
						<div
							css={!disableStyles && CSS.showMore({ theme })}
							onClick={() => {
								(facet as ValueFacet).overflow.toggle();
							}}
						>
							<Icon
								icon={(facet as ValueFacet).overflow.remaining > 0 ? 'plus' : 'minus'}
								color={defaultTheme.colorPrimary}
								size="10px"
								css={!disableStyles && CSS.icon()}
							/>
							<span>{(facet as ValueFacet).overflow.remaining > 0 ? 'Show More' : 'Show Less'}</span>
						</div>
					)}
				</Dropdown>
			</div>
		);
	}
);

interface FacetSubProps {
	dropdown: DropdownProps;
	facetListOptions?: FacetListOptionsProps;
	facetGridOptions?: FacetGridOptionsProps;
	facetPaletteOptions?: FacetPaletteOptionsProps;
	slider?: SliderProps;
	icon?: IconProps;
}

export interface FacetProps extends ComponentProps {
	disableCollapse?: boolean;
	facet: ValueFacet | RangeFacet | RangeBucketFacet | BaseFacet;
	color?: string;
	iconCollapse?: IconType | string;
	iconColor?: string;
	iconExpand?: IconType | string;
	hideIcon?: boolean;
	optionsLimitCount?: number;
	previewOnFocus?: boolean;
	valueProps?: any;
}
