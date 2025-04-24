// import { css } from '@emotion/react';
import type { ResultsProps } from '../../../../components/Organisms/Results';

// CSS in JS style script for the Results component
// const resultsStyleScript = () => {

// };

// Results component props
export const results: ThemeComponentProps<ResultsProps> = {
	default: {
		// themeStyleScript: resultsStyleScript,
	},
	mobile: {
		columns: 5,
	},
	tablet: {},
	desktop: {},
};
