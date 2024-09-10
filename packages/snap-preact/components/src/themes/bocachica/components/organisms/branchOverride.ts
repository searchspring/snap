import { css } from '@emotion/react';
import type { BranchOverrideProps, BranchOverrideTheme } from '../../../../components/Organisms/BranchOverride';

const darkTheme: BranchOverrideTheme = {
	class: 'ss__branch-override--dark',
	main: {
		border: '0',
		background: 'rgba(59, 35, 173, 0.9)',
		color: '#fff',
		boxShadow: '#4c3ce2 1px 1px 3px 0px',
	},
	top: {
		background: 'rgba(59, 35, 173, 0.3)',
		border: '1px solid #4c3de1',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring_light.svg',
		},
		button: {
			border: '1px solid #fff',
			color: '#fff',
			content: 'STOP PREVIEW',
		},
		close: {
			fill: '#fff',
		},
	},
	bottom: {
		content: 'Preview functionality may differ from production.',
		branch: {
			color: '#03cee1',
			style: 'italic',
		},
		additional: {
			color: '#03cee1',
		},
	},
};

const lightTheme: BranchOverrideTheme = {
	class: 'ss__branch-override--light',
	main: {
		border: '1px solid #ccc',
		background: 'rgba(255, 255, 255, 0.95)',
		color: '#515151',
		boxShadow: 'rgba(81, 81, 81, 0.5) 1px 1px 3px 0px',
	},
	top: {
		border: '1px solid #ccc',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring.svg',
		},
		button: {
			border: '1px solid #515151',
			color: '#515151',
			content: 'STOP PREVIEW',
		},
		close: {
			fill: '#515151',
		},
	},
	bottom: {
		content: 'Preview functionality may differ from production.',
		branch: {
			color: '#3a23ad',
			style: 'italic',
		},
		additional: {
			color: '#3a23ad',
		},
	},
};

const failureTheme: BranchOverrideTheme = {
	class: 'ss__branch-override--error',
	main: {
		border: '0',
		background: 'rgba(130, 6, 6, 0.9)',
		color: '#fff',
		boxShadow: 'rgba(130, 6, 6, 0.4) 1px 1px 3px 0px',
	},
	top: {
		background: 'rgba(130, 6, 6, 0.3)',
		border: '1px solid #760000',
		logo: {
			src: 'https://snapui.searchspring.io/searchspring_light.svg',
		},
		button: {
			border: '1px solid #fff',
			color: '#fff',
			content: 'REMOVE',
		},
		close: {
			fill: '#fff',
		},
	},
	bottom: {
		content: 'Incorrect branch name or branch no longer exists.',
		branch: {
			color: '#be9628',
			style: 'italic',
		},
		additional: {
			color: '#be9628',
		},
	},
};

export const componentThemes = {
	darkTheme,
	lightTheme,
	failureTheme,
};

// CSS in JS style script for the BranchOverride component
const branchOverrideStyleScript = ({ darkMode, error, theme }: BranchOverrideProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;
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
