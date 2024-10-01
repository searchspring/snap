import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the SearchHorizontal component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__filter-summary': {
			margin: '10px 0',
		},
	});
};

// SearchHorizontal component props
export const searchHorizontal: Partial<SearchHorizontalProps> = {
	styleScript: searchHorizontalStyleScript,
};
