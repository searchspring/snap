import { css } from '@emotion/react';
import type { FilterProps } from '../../../../components/Molecules/Filter';
import { ThemeComponent } from '../../../../providers';
import Color from 'color';

// CSS in JS style script for the Filter component
const filterStyleScript = ({ theme }: FilterProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;
	const backgroundColor = new Color(variables?.colors.primary);
	const backgroundTextColor = backgroundColor.isDark() ? '#fff' : '#000';

	return css({
		'& .ss__filter__button': {
			backgroundColor: backgroundColor.hex(),
			color: backgroundTextColor,

			'& .ss__filter__button__icon': {
				fill: backgroundTextColor,
				stroke: backgroundTextColor,
			},
		},
	});
};

// Filter component props
export const filter: ThemeComponent<'filter', FilterProps> = {
	default: {
		filter: {
			themeStyleScript: filterStyleScript,
		},
	},
};
