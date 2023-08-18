import { css, BreadcrumbsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Breadcrumbs component
const breadcrumbsStyleScript = ({ theme }: BreadcrumbsProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& .ss__breadcrumbs__crumbs': {
			padding: '0',
		},
		'& .ss__breadcrumbs__crumbs__crumb, & .ss__breadcrumbs__crumbs__separator': {
			padding: '0 5px',
			display: 'inline-block',
		},
	});
};

// Breadcrumbs component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-breadcrumbs--search-page
export const breadcrumbs: Omit<BreadcrumbsProps, 'data'> = {
	styleScript: breadcrumbsStyleScript,
};
