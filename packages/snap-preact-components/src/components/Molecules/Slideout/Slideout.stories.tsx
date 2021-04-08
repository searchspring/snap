import { h } from 'preact';

import { Slideout, SlideoutProps } from './Slideout';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';

import { Button } from '../../Atoms/Button';
import { Icon } from '../../Atoms/Icon';
import { Facets } from '../../Organisms/Facets';
import { FilterSummary } from '../../Organisms/FilterSummary';

export default {
	title: `Molecules/Slideout`,
	component: Slideout,
	argTypes: {
		active: {
			defaultValue: false,
			description: 'Slideout is active',
			type: { required: true },
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		width: {
			defaultValue: '300px',
			description: 'Slideout width',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '300px' },
			},
			control: { type: 'text' },
		},
		displayAt: {
			defaultValue: '',
			description: 'Media query for when to render this component',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
		},
		buttonContent: {
			description: 'Slideout button content (children), appended to buttonText',
			table: {
				type: {
					summary: 'string, jsx',
				},
				defaultValue: { summary: 'click me' },
			},
			control: { type: 'text' },
		},
		scrollbarWidth: {
			defaultValue: '8px',
			description: 'Slideout scrollbar with',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '8px' },
			},
			control: { type: 'text' },
		},
		transitionSpeed: {
			defaultValue: '0.25s',
			description: 'Overlay opening/closing transition speed',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '0.25s' },
			},
			control: { type: 'text' },
		},
		overlayColor: {
			defaultValue: 'rgba(0,0,0,0.8)',
			description: 'Slideout overlay color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'rgba(0,0,0,0.8)' },
			},
			control: { type: 'color' },
		},
		...componentArgs,
	},
};

const _HelloWorld = (args: SlideoutProps, { loaded: { controller } }) => (
	<Slideout {...args}>
		<div>props.children will be rendered here</div>
	</Slideout>
);

export const Default = _HelloWorld.bind({});
Default.args = {
	active: true,
};
