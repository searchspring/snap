/** @jsx jsx */
import { ComponentChildren, Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import type { CSSObject } from '@emotion/serialize';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

import type { AbstractController, SearchController } from '@searchspring/snap-controller';
import type { Product } from '@searchspring/snap-store-mobx';

const positioningStyles = ({ type, overlayLocation, location, overlayLocationOptions }: SelfServeBadgeProps): CSSObject => {
	let styles: CSSObject = {
		[overlayLocation]: 0, // left or right
	};

	if (type === 'callout') {
		styles = { ...styles, display: 'inline-block' };
	} else if (type === 'overlay') {
		styles = { ...styles, position: 'absolute' };

		const index = overlayLocationOptions.findIndex((option: any) => option.name === location);
		if (index === 0) {
			// first option, assume top
			styles = { ...styles, top: 0 };
		} else if (index === overlayLocationOptions.length - 1) {
			// last in list, assume bottom
			styles = { ...styles, bottom: 0 };
		} else if (index > 0 && index < overlayLocationOptions.length - 1) {
			// middle options, calculate percentage based on position in list
			const percentage = (index / (overlayLocationOptions.length - 1)) * 100;
			styles = { ...styles, top: `${percentage}%`, transform: `translateY(-${percentage}%)`, margin: 'auto' };
		}
	}

	return styles;
};
const CSS = {
	selfServeBadge: ({ type }: SelfServeBadgeProps) =>
		css({
			position: type === 'overlay' ? 'relative' : undefined,
		}),
	BadgePill: (props: SelfServeBadgeProps) => {
		const { parameters } = props;
		const { color, colorText } = parameters;
		return css({
			...positioningStyles(props),

			padding: '0.2em 0.5em',

			background: color || 'rgba(255, 255, 255, 0.5)',
			color: colorText || '#000000',
		});
	},
	BadgeImage: (props: SelfServeBadgeProps) => {
		const { parameters } = props;
		const { color, colorText } = parameters;
		return css({
			...positioningStyles(props),

			background: color || 'rgba(255, 255, 255, 0.5)',
			color: colorText || '#000000',
		});
	},
};

export const SelfServeBadge = observer((properties: SelfServeBadgeProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SelfServeBadgeProps = {
		// default props
		callout: properties.children ? '' : 'callout',
		type: properties.children ? 'overlay' : 'callout',
		// global theme
		...globalTheme?.components?.badge,
		// props
		...properties,
		...properties.theme?.components?.badge,
	};
	const { result, callout, type, children, controller, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};

	// {
	// 	tag: 'on-sale',
	// 	label: '30% Off',
	// 	component: '',
	// 	location: 'left',
	// 	parameters: {
	// 		color: '#0000FF',
	// 		colorText: '#FFFFFF',
	// 		url: '',
	// 	},
	// }

	// locations: {
	// 	overlay: {
	// 		[position: string]: {
	// 			name: string;
	// 			label: string;
	// 			description: string;
	// 		}[];
	// 	};
	// 	callouts: {
	// 		name: string;
	// 		label: string;
	// 		description: string;
	// 	}[];
	// };

	if (!disableStyles) {
		styling.css = [CSS.selfServeBadge(props), style];
	} else if (style) {
		styling.css = [style];
	}

	const resultBadges = result.badges;
	const locations = (controller?.store as any)?.meta?.badges?.locations;
	if (!resultBadges?.length || !locations) {
		return <Fragment>{children}</Fragment>;
	}

	const callouts = locations?.callouts;
	const overlay = locations?.overlay;

	const calloutBadge = resultBadges.find((badge: any) => {
		return callouts?.some((callout: any) => callout.name === badge.location) && badge.location === callout;
	});

	const overlayBadges =
		resultBadges
			?.map((badge: any) => {
				// add overlayLocation property to badge to be used in styling
				const isRightOverlay = overlay.right.some((rightOverlays: any) => rightOverlays.name === badge.location);
				const isLeftOverlay = overlay.left.some((leftOverlays: any) => leftOverlays.name === badge.location);
				const overlayLocation = isRightOverlay ? 'right' : isLeftOverlay ? 'left' : '';

				return {
					...badge,
					overlayLocation,
					overlayLocationOptions: overlay[overlayLocation],
				};
			})
			.filter((badge: any) => {
				// filter out badges that are not overlay badges
				return badge.overlayLocation;
			}) || [];

	if (calloutBadge && type === 'callout') {
		return (
			<CacheProvider>
				<div
					{...styling}
					className={classnames(
						'ss__self-serve-badge',
						'ss__self-serve-badge--callouts',
						`ss__self-serve-badge--${calloutBadge.location}`,
						`ss__self-serve-badge--${calloutBadge.component}`,
						`ss__self-serve-badge--${calloutBadge.tag}`,
						className
					)}
				>
					{(() => {
						switch (calloutBadge.component) {
							case 'BadgePill':
								return <BadgePill type={'callout'} badge={calloutBadge} parentProps={props} />;
							case 'BadgeImage':
								return <BadgeImage type={'callout'} badge={calloutBadge} parentProps={props} />;
							default:
								return;
						}
					})()}
				</div>
			</CacheProvider>
		);
	}

	if (overlayBadges.length && type === 'overlay') {
		console.log('overlayBadges', overlayBadges);
		return (
			<CacheProvider>
				<div {...styling} className={classnames('ss__self-serve-badge', 'ss__self-serve-badge--overlay', className)}>
					{children}
					{overlayBadges.map((badge: any) => {
						switch (badge.component) {
							case 'BadgePill':
								return <BadgePill type={'overlay'} badge={badge} parentProps={props} />;
							case 'BadgeImage':
								return <BadgeImage type={'overlay'} badge={badge} parentProps={props} />;
							default:
								return;
						}
					})}
				</div>
			</CacheProvider>
		);
	}

	return <Fragment>{children}</Fragment>;
});

const BadgePill = ({ badge, parentProps, type }: any) => {
	const styling: { css?: StylingCSS } = {};
	if (!parentProps.disableStyles) {
		styling.css = [CSS.BadgePill({ ...parentProps, ...badge, type }), parentProps.style];
	} else if (parentProps.style) {
		styling.css = [parentProps.style];
	}

	return (
		<div
			{...styling}
			className={classnames(
				'ss__self-serve-badge__badge',
				`ss__self-serve-badge__badge--${type}`,
				`ss__self-serve-badge__badge--${badge.component}`,
				`ss__self-serve-badge__badge--${badge.location}`,
				`ss__self-serve-badge__badge--${badge.tag}`
			)}
		>
			{badge.label}
		</div>
	);
};

const BadgeImage = ({ badge, parentProps, type }: any) => {
	const styling: { css?: StylingCSS } = {};
	if (!parentProps.disableStyles) {
		styling.css = [CSS.BadgeImage({ ...parentProps, ...badge, type }), parentProps.style];
	} else if (parentProps.style) {
		styling.css = [parentProps.style];
	}
	return (
		<img
			{...styling}
			className={classnames(
				'ss__self-serve-badge__badge',
				`ss__self-serve-badge__badge--${type}`,
				`ss__self-serve-badge__badge--${badge.component}`,
				`ss__self-serve-badge__badge--${badge.location}`
			)}
			alt={badge.label}
			src={badge.parameters.url}
		/>
	);
};

export interface SelfServeBadgeProps extends ComponentProps {
	result: Product;
	controller?: AbstractController | SearchController;

	children?: ComponentChildren;
	callout?: string;
}
