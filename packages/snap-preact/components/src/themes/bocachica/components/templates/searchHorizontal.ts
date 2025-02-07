import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the SearchHorizontal component
const searchHorizontalStyleScript = () => {
	return css({
		'.ss__filter-summary': {
			margin: '10px 0',
		},
	});
};

// SearchHorizontal component props
export const searchHorizontal: Partial<SearchHorizontalProps> = {
	themeStyleScript: searchHorizontalStyleScript,
};
