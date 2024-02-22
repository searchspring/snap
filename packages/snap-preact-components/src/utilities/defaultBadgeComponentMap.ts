import { BadgePill } from '../components/Atoms/BadgePill';
import { BadgeImage } from '../components/Atoms/BadgeImage';
import { ComponentMap } from '../types';

export const defaultBadgeComponentMap: ComponentMap = {
	BadgePill: BadgePill, // TODO: remove these
	'searchspring/pill': BadgePill,

	BadgeImage: BadgeImage, // TODO: remove these
	'searchspring/image': BadgeImage,
};
