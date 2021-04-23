import { h } from 'preact';

import { Icon } from './Icon';
import { IconProps } from '../../../types';
import { iconPaths } from './paths';

import { componentArgs } from '../../../utilities';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
// @ts-ignore
import Readme from '../Icon/readme.md';

export default {
	title: `Atoms/Icon`,
	component: Icon,
	parameters: {
		docs: {
			page: () => (
				<div>
					<Readme />
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
		actions: {
			disabled: true,
		},
	},
	argTypes: {
		icon: {
			description: 'Icon name',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		path: {
			description: 'SVG path',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		color: {
			defaultValue: '#000',
			description: 'Icon color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#000' },
			},
			control: { type: 'color' },
		},
		size: {
			defaultValue: '16px',
			description: 'Icon size',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '16px' },
			},
			control: { type: 'text' },
		},
		height: {
			description: 'Icon height. Overwrites size.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		width: {
			description: 'Icon width. Overwrites size.',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		viewBox: {
			defaultValue: '0 0 56 56',
			description: 'SVG view box',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '0 0 56 56' },
			},
			control: { type: 'text' },
		},
		...componentArgs,
	},
};

const Template = (props: IconProps) => <Icon {...props} />;

export const Default = (props: IconProps): JSX.Element => <Icon color="#00cee1" icon="cog" size="60px" {...props} />;
Default.args = {
	icon: 'cogs',
};

export const Custom = (props: IconProps): JSX.Element => <Icon color="#00cee1" icon="cog" size="60px" {...props} />;
Custom.args = {
	color: '#00cee1',
	icon: 'cog',
	size: '60px',
};

export const CustomPath = Template.bind({});
CustomPath.args = {
	color: '#3a23ad',
	path:
		'M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8zM8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z',
	size: '120px',
	style: 'padding: 20px;',
	viewBox: '0 0 70 70',
};

export const Gallery = (): JSX.Element => {
	return (
		<div style='display: flex; flex-wrap: wrap; font-family: "Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif; font-size: 10px;'>
			{Object.keys(iconPaths).map((icon, index) => {
				return (
					<div style="margin-bottom: 30px;">
						<Icon icon={icon} color={shiftColor('#3a23ad', (index + '111').padStart(6, '1'))} size="70px" style={{ padding: '10px' }} />
						<div style="text-align: center">{icon}</div>
					</div>
				);
			})}
		</div>
	);
};
Gallery.args = {
	className: 'ss-icon-warning',
	color: '#3a23ad',
	path: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
	size: '24px',
	viewBox: '0 0 24 24',
};
Gallery.parameters = {
	controls: {
		expanded: false,
		disabled: true,
	},
	options: {
		showPanel: false,
	},
};

function shiftColor(base, change) {
	const colorRegEx = /^\#?[A-Fa-f0-9]{6}$/;

	if (!base || !change) {
		return '#000000';
	}

	if (!base.match(colorRegEx) || !change.match(colorRegEx)) {
		return '#000000';
	}

	// remove '#'s
	base = base.replace(/\#/g, '');
	change = change.replace(/\#/g, '');

	let newColor = '';
	for (let i = 0; i < 3; i++) {
		const basePiece = parseInt(base.substring(i * 2, i * 2 + 2), 16);
		const changePiece = parseInt(change.substring(i * 2, i * 2 + 2), 16);
		let newPiece: string | number;

		newPiece = basePiece + changePiece;
		newPiece = newPiece > 255 ? 255 : newPiece;

		newPiece = newPiece.toString(16);
		newPiece = newPiece.length < 2 ? '0' + newPiece : newPiece;
		newColor += newPiece;
	}

	return `#${newColor}`;
}
