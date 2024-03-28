import { BadgeText } from '../components/Atoms/BadgeText';
import { BadgeImage } from '../components/Atoms/BadgeImage';
import { ComponentMap } from '../types';

export const defaultBadgeComponentMap: ComponentMap = {
	BadgeText: BadgeText, // TODO: remove these
	'searchspring/text': BadgeText,

	BadgeImage: BadgeImage, // TODO: remove these
	'searchspring/image': BadgeImage,
};
