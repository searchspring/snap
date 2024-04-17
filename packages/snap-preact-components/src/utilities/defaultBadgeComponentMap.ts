import { BadgeText } from '../components/Atoms/BadgeText';
import { BadgePill } from '../components/Atoms/BadgePill';
import { BadgeRectangle } from '../components/Atoms/BadgeRectangle';
import { BadgeImage } from '../components/Atoms/BadgeImage';
import { ComponentMap } from '../types';

export const defaultBadgeComponentMap: ComponentMap = {
	BadgeText: () => BadgeText, // TODO: remove these
	'searchspring/text': () => BadgeText,

	BadgePill: () => BadgePill, // TODO: remove these
	'searchspring/pill': () => BadgePill,

	BadgeRectangle: () => BadgeRectangle, // TODO: remove these
	'searchspring/rectangle': () => BadgeRectangle,

	BadgeImage: () => BadgeImage, // TODO: remove these
	'searchspring/image': () => BadgeImage,
};
