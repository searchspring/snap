import { css, NoResultsProps } from '../../../../../index';

// CSS in JS style script for the NoResults component
const noResultsStyleScript = ({ theme }: NoResultsProps) => {
	const variables = theme?.variables;

	return css({
		color: variables?.color?.secondary,
		' .ss__title': {
			color: variables?.color?.secondary,
		},
	});
};

// NoResults component props
export const noResults: Partial<NoResultsProps> = {
	styleScript: noResultsStyleScript,
};
