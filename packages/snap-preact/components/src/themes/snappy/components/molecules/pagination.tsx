import { css } from '@emotion/react';
import type { PaginationProps } from '../../../../components/Molecules/Pagination';
import { Icon } from '../../../../components/Atoms/Icon';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Pagination component
const paginationStyleScript = ({ theme }: PaginationProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__pagination__page': {
			display: 'none',
			color: variables?.colors?.secondary,
			border: '1px solid black',
			borderRadius: '10px',
			background: 'white',
			padding: '5px 10px',
			margin: '0px 5px',

			'&:hover': {
				opacity: 0.7,
			},
		},
		'& .ss__pagination__page--previous, & .ss__pagination__page--next': {
			display: 'inline-block',
		},
		'& .ss__pagination__prev, & .ss__pagination__next': {
			display: 'inline-flex',
			alignItems: 'center',
			verticalAlign: 'top',
		},

		'& .ss__pagination__prev .ss__icon': {
			marginRight: '10px',
		},
		'& .ss__pagination__next .ss__icon': {
			marginLeft: '10px',
		},
	});
};

const PrevButton = () => {
	return (
		<div className="ss__pagination__prev">
			<Icon icon="angle-left" />
			Previous
		</div>
	);
};

const NextButton = () => {
	return (
		<div className="ss__pagination__next">
			Next
			<Icon icon="angle-right" />
		</div>
	);
};

// Pagination component props
export const pagination: ThemeComponent<'pagination', PaginationProps> = {
	default: {
		props: {
			themeStyleScript: paginationStyleScript,
			hideFirst: true,
			hideLast: true,
			hideEllipsis: true,
			pages: 0,
			prevButton: <PrevButton />,
			nextButton: <NextButton />,
		},
	},
};
