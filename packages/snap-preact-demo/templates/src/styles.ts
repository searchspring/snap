export const globalStyles = (theme) => {
	const { variables } = theme;
	return {
		'.ss__result': {
			// background: variables.color.primary,
			// fontSize: '200%',
		},
		[`@media (max-width: ${variables.breakpoints[2]}px)`]: {
			'.ss__result': {
				background: 'blue',
			},
		},
		[`@media (max-width: ${variables.breakpoints[1]}px)`]: {
			'.ss__result': {
				background: 'red',
			},
		},
	};
};
