import { css, BannerProps } from '../../../../../index';
import { EverestVariables } from '../../../index';

// CSS in JS style script for the Banner component
const bannerStyleScript = ({ theme }: BannerProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as EverestVariables;

	return css({
		'& iframe, img': {
			maxWidth: '100%',
			height: 'auto',
		},
	});
};

// Banner component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-banner--footer
export const banner: Omit<BannerProps, 'type'> = {
	styleScript: bannerStyleScript,
};
