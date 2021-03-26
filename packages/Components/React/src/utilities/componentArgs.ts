export const componentArgs = {
	className: {
		description: 'Class name appended to root element of component',
		table: {
			type: {
				summary: 'string',
			},
			defaultValue: { summary: 'ss-${componentname}' },
		},
		control: { type: 'text' },
	},
	disableStyles: {
		defaultValue: false,
		description: 'Disable all default styling',
		table: {
			type: {
				summary: 'boolean',
			},
			defaultValue: { summary: false },
		},
		control: { type: 'boolean' },
	},
	style: {
		description: 'Inline style',
		table: {
			type: {
				summary: 'string, object',
			},
		},
		control: { type: 'text' },
	},
	theme: {
		description: 'Specify specific sub component props',
		table: {
			type: {
				summary: 'object',
			},
		},
		control: { type: 'object' },
	},
};
