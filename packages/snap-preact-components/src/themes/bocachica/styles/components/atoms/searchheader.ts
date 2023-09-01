import { css, SearchHeaderProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the SearchHeader component
const searchHeaderStyleScript = ({ theme }: SearchHeaderProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		' .ss__search-header__title': {
			color: variables?.color?.primary,
		},
	});
};

// SearchHeader component props
export const searchHeader: Partial<SearchHeaderProps> = {
	styleScript: searchHeaderStyleScript,
};
