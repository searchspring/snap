import { BadgeText } from '../components/Atoms/BadgeText';
import { BadgePill } from '../components/Atoms/BadgePill';
import { BadgeRectangle } from '../components/Atoms/BadgeRectangle';
import { BadgeImage } from '../components/Atoms/BadgeImage';
import { ComponentMap } from '../types';

export const defaultBadgeComponentMap: ComponentMap = {
	BadgeText: () => BadgeText,
	BadgePill: () => BadgePill,
	BadgeRectangle: () => BadgeRectangle,
	BadgeImage: () => BadgeImage,
};
