import { css, InlineBannerProps } from '../../../../../index';
import { EverestVariables } from '../../../index';

// CSS in JS style script for the InlineBanner component
const inlineBannerStyleScript = ({ width, theme }: InlineBannerProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as EverestVariables;

	return css({
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		'&.ss__inline-banner--grid': {
			flexDirection: 'column',
		},
		'&.ss__inline-banner--list': {
			flexDirection: 'row',
			display: 'block',
			width: '100%',
		},
		'& iframe': {
			maxWidth: '100%',
		},
	});
};

// InlineBanner component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-inlinebanner--default
export const inlineBanner: Omit<InlineBannerProps, 'banner'> = {
	styleScript: inlineBannerStyleScript,
};
