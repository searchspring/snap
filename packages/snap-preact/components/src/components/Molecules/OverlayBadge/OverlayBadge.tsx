import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider, useSnap } from '../../../providers';
import { ComponentProps, RootNodeProperties, ComponentMap } from '../../../types';
import { defaultBadgeComponentMap } from '../../../utilities';
import { useComponent } from '../../../hooks';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';
import type { SnapTemplates } from '../../../../../src/Templates';

const CSS = {
	OverlayBadge: ({ grid }: OverlayBadgeProps & { grid: string[][] }) => {
		let gridProperties = {};
		if (grid?.length && grid[0]?.length) {
			const gridTemplateAreas = grid.map((row: string[]) => `"${row.join(' ')}"`).join(' ');
			const columns = grid[0].length;
			gridProperties = {
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
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
	BadgePositioning: ({ index, top, bottom, section, tag }: { index: number; top: boolean; bottom: boolean; section: string; tag: string }) => {
		return css({
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			alignItems: section == 'right' ? 'flex-end' : 'flex-start',
			justifyContent: !top && !bottom ? 'center' : bottom && !top ? 'flex-end' : 'flex-start',
			gap: '0.5em',
			gridArea: tag,
			boxSizing: 'border-box',
			zIndex: Math.max(100 - index, 1),
			width: '100%',
			height: '100%',
		});
	},
};

export const OverlayBadge = observer((properties: OverlayBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const snap = useSnap();

	const props: OverlayBadgeProps = {
		// default props
		limit: 1,
		// global theme
		...globalTheme?.components?.overlayBadge,
		// props
		...properties,
		...properties.theme?.components?.overlayBadge,
	};
	const { result, children, controller, renderEmpty, limit, disableStyles, className, style } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };

	if (!children) {
		controller?.log?.warn('OverlayBadge component must have children');
		return <Fragment />;
	}

	const meta = controller?.store?.meta;
	if (!meta) {
		controller?.log?.warn('Controller must have a meta store');
		return <Fragment>{children}</Fragment>;
	}
	const group = 'overlay';
	const grid = meta?.badges?.groups?.[group]?.grid;
	const badgeComponentMap = {
		...defaultBadgeComponentMap,
		...((snap as SnapTemplates)?.templates?.library.import.component.badge || {}),
		...props.componentMap,
	};

	const sections = meta?.badges?.groups?.[group]?.sections;

	// build locations and filter out the locations that have no badges in them to prevent rendering
	const locations = sections
		?.map((section) => {
			const sectionSlots = meta?.data?.badges?.locations[section as keyof typeof meta.data.badges.locations];
			const slots = sectionSlots
				?.map((slot, index) => ({
					tag: slot.tag,
					name: slot.name,
					top: index == 0,
					bottom: index == sectionSlots.length - 1,
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
										css={[CSS.BadgePositioning({ tag: slot.tag, section: location.section, index, top: slot.top, bottom: slot.bottom })]}
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
	limit?: number;
}
