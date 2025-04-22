// import { css } from '@emotion/react';
import type { LayoutSelectorProps } from '../../../../components/Molecules/LayoutSelector';

// CSS in JS style script for the LayoutSelector component
// const layoutSelectorStyleScript = ({ }: LayoutSelectorProps) => {
// 	return css({
// 	});
// };

// LayoutSelector component props
export const layoutSelector: ThemeComponentProps<LayoutSelectorProps> = {
	default: {
		// themeStyleScript: layoutSelectorStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
