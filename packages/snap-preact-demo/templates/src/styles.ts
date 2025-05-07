export const globalStyles = (theme: Theme) => {
	const { variables } = theme;
	return {
		'.ss__result': {
			// background: 'purple',
		},
		[`@media (max-width: ${variables.breakpoints.desktop}px)`]: {
			'.ss__result': {
				// background: 'blue',
			},
		},
		[`@media (max-width: ${variables.breakpoints.tablet}px)`]: {
			'.ss__result': {
				// background: 'red',
			},
		},
		[`@media (max-width: ${variables.breakpoints.mobile}px)`]: {
			'.ss__result': {
				// background: 'green',
			},
		},
	};
};
