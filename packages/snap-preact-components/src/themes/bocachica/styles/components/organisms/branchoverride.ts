import { css, BranchOverrideProps, componentThemes } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the BranchOverride component
const branchOverrideStyleScript = ({ darkMode, error, theme }: BranchOverrideProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;
	const prefersDark = typeof darkMode == 'boolean' ? darkMode : window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
	const componentTheme = componentThemes[error ? 'failureTheme' : prefersDark ? 'darkTheme' : 'lightTheme'];

	return css({
		width: '360px',
		height: '120px',
		overflow: 'hidden',
		fontSize: '14px',
		position: 'fixed',
		zIndex: '9999',
		cursor: 'auto',
		bottom: '50px',
		right: 0,
		background: componentTheme.main.background,
		color: componentTheme.main.color,
		border: componentTheme.main.border,
		borderRight: 0,
		borderTopLeftRadius: '5px',
		borderBottomLeftRadius: '5px',
		boxShadow: componentTheme.main.boxShadow,
		transition: 'height ease 0.2s, right ease 0.5s 0.2s',
		'&.ss__branch-override--collapsed': {
			transition: 'height ease 0.5s 0.5s, right ease 0.5s',
			right: '-316px',
			height: '50px',
			cursor: 'pointer',
		},
		'.ss__branch-override__top': {
			padding: '10px',
			background: componentTheme.top.background,
			borderBottom: componentTheme.top.border,
			'.ss__branch-override__top__logo': {
				display: 'inline-block',
				height: '30px',
				maxHeight: '30px',
				verticalAlign: 'middle',
			},
			'.ss__branch-override__top__collapse': {
				display: 'inline-block',
				float: 'right',
				padding: '5px',
				cursor: 'pointer',
			},
			'.ss__branch-override__top__button': {
				borderRadius: '5px',
				padding: '6px',
				height: '100%',
				lineHeight: '14px',
				textAlign: 'center',
				cursor: 'pointer',
				fontSize: '10px',
				border: componentTheme.top.button.border,
				color: componentTheme.top.button.color,
				float: 'right',
				marginRight: '14px',
			},
		},
		'.ss__branch-override__bottom': {
			padding: '10px 15px',
			fontSize: '12px',
			'.ss__branch-override__bottom__left': {
				fontWeight: 'bold',
				fontStyle: componentTheme.bottom.branch.style,
				color: componentTheme.bottom.branch.color,
				fontSize: '14px',
				lineHeight: '20px',
				display: 'inline-flex',
				alignItems: 'center',
				maxWidth: '180px',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				svg: {
					marginRight: '10px',
				},
			},
			'.ss__branch-override__bottom__right': {
				float: 'right',
				fontStyle: 'italic',
				color: componentTheme.bottom.additional.color,
				fontSize: '12px',
				lineHeight: '20px',
			},
			'.ss__branch-override__bottom__content': {
				marginTop: '10px',
			},
		},
	});
};

// BranchOverride component props
export const branchOverride: Partial<BranchOverrideProps> = {
	styleScript: branchOverrideStyleScript,
};
