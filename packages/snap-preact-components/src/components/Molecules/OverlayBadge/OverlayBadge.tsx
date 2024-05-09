/** @jsx jsx */
import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';
import { useComponent } from '../../../hooks';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

const CSS = {
	OverlayBadge: ({ grid }: OverlayBadgeProps) => {
		let gridProperties = {};
		if (grid?.length && grid[0]?.length) {
			const gridTemplateAreas = grid.map((row: string[]) => `"${row.join(' ')}"`).join(' ');
			const columns = grid[0].length;
			gridProperties = {
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gridTemplateAreas,
			};
		}

		return css({
			position: 'relative',

			'& .ss__overlay-badge__grid-wrapper': {
				display: 'grid',
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				...gridProperties,
			},
		});
	},
	BadgePositioning: ({ index, section, tag }: { index: number; section: string; tag: string }) => {
		return css({
			position: 'absolute',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: '0.5em',
			gridArea: tag,
			[['left', 'right'].includes(section) ? section : '']: 0,
			boxSizing: 'border-box',
			zIndex: Math.max(100 - index, 1),
			width: '100%',
			height: '100%',
		});
	},
};

export const OverlayBadge = observer((properties: OverlayBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: OverlayBadgeProps = {
		// default props
		// global theme
		...globalTheme?.components?.overlayBadge,
		// props
		...properties,
		...properties.theme?.components?.overlayBadge,
	};
	const { result, children, controller, renderEmpty, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	if (!children) {
		controller?.log?.warn('OverlayBadge component must have children');
		return <Fragment />;
	}

	const limit = 1;
	const meta = controller?.store?.meta;
	const group = 'overlay';
	const grid = meta?.badges?.groups?.[group]?.grid;
	const badgeComponentMap = { ...defaultBadgeComponentMap, ...props.componentMap };

	const sections = meta?.badges?.groups?.[group]?.sections;

	// build locations and filter out the locations that have no badges in them to prevent rendering
	const locations = sections
		?.map((section) => {
			const sectionSlots = meta?.data?.badges?.locations[section as keyof typeof meta.data.badges.locations];
			const slots = sectionSlots
				?.map((slot) => ({
					tag: slot.tag,
					name: slot.name,
					badges: result?.badges?.atLocation(`${section}/${slot.tag}`).slice(0, limit),
				}))
				.filter((slot) => slot.badges.length);

			return {
				section,
				slots,
			};
		})
		.filter((location) => location.slots?.length);

	if (!disableStyles) {
		styling.css = [CSS.OverlayBadge({ ...props, grid }), style];
	} else if (style) {
		styling.css = [style];
	}

	if (renderEmpty || locations?.length) {
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__overlay-badge', className)}>
					<div className="ss__overlay-badge__grid-wrapper">
						{locations.map((location, index) => {
							return location.slots?.map((slot) => {
								return (
									<div
										className={classnames('ss__overlay-badge__grid-wrapper__slot', `ss__overlay-badge__grid-wrapper__slot--${slot.tag}`)}
										css={[CSS.BadgePositioning({ tag: slot.tag, section: location.section, index })]}
									>
										{slot.badges.map((badge) => {
											const BadgeComponent = useComponent(badgeComponentMap, badge.component);
											if (!BadgeComponent) {
												return <Fragment />;
											}

											return <BadgeComponent {...badge} {...badge.parameters} />;
										})}
									</div>
								);
							});
						})}
					</div>
					{children}
				</div>
			</CacheProvider>
		);
	}

	return <Fragment>{children}</Fragment>;
});

export interface OverlayBadgeProps extends ComponentProps {
	result: Product;
	controller: SearchController | AutocompleteController | RecommendationController;
	children: ComponentChildren;
	renderEmpty?: boolean;
	componentMap?: ComponentMap;
}
