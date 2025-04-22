// import { css } from '@emotion/react';
import type { ResultsProps } from '../../../../components/Organisms/Results';

// CSS in JS style script for the Results component
// const resultsStyleScript = () => {

// };

// Results component props
export const results: ThemeComponentProps<ResultsProps> = {
	default: {
		// themeStyleScript: resultsStyleScript,
		columns: 4,
	},
	mobile: {
		columns: 2,
	},
	tablet: {
		columns: 3,
	},
	desktop: {
		columns: 4,
	},
};
