import { css } from '@emotion/react';
import type { BreadcrumbsProps } from '../../../../../components/Atoms/Breadcrumbs';

// CSS in JS style script for the Breadcrumbs component
const breadcrumbsStyleScript = ({ theme }: BreadcrumbsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

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
export const breadcrumbs: Partial<BreadcrumbsProps> = {
	styleScript: breadcrumbsStyleScript,
};
