// import { css } from '@emotion/react';
import type { SkeletonProps } from '../../../../components/Atoms/Skeleton';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Skeleton component
// const skeletonStyleScript = () => {};

// Skeleton component props
export const skeleton: ThemeComponent<'skeleton', SkeletonProps> = {
	default: {
		props: {
			// themeStyleScript: skeletonStyleScript,
		},
	},
};
