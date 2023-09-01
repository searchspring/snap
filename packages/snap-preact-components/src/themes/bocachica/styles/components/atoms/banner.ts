import { css, BannerProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Banner component
const bannerStyleScript = ({ theme }: BannerProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& iframe, img': {
			maxWidth: '100%',
			height: 'auto',
		},
	});
};

// Banner component props
export const banner: Partial<BannerProps> = {
	styleScript: bannerStyleScript,
};
