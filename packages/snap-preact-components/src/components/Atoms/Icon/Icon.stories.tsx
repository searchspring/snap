import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Icon, IconProps } from './Icon';
import { iconPaths } from './paths';
import { componentArgs, shiftColor, highlightedCode } from '../../../utilities';
import Readme from '../Icon/readme.md';

export default {
	title: 'Atoms/Icon',
	component: Icon,
	tags: ['autodocs'],
	parameters: {
		docs: {
			page: () => (
				<div>
					<Markdown
						options={{
							overrides: {
								code: highlightedCode,
							},
						}}
					>
						{Readme}
					</Markdown>
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
			options: [...Object.keys(iconPaths)],
			control: {
				type: 'select',
			},
		},
		path: {
			description: 'SVG path',
			table: {
				type: {
					summary: 'string | SVGPathElement[]',
				},
			},
			control: { type: 'text' },
		},
		children: {
			description: 'SVG elements to be contained within (using children)',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'none' },
		},
		color: {
			description: 'Icon color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'theme.colors.primary' },
			},
			control: { type: 'color' },
		},
		size: {
			defaultValue: '16px',
			description: 'Icon size',
			table: {
				type: {
					summary: 'string | number',
				},
				defaultValue: { summary: '16px' },
			},
			control: { type: 'text' },
		},
		height: {
			description: 'Icon height. Overwrites size.',
			table: {
				type: {
					summary: 'string | number',
				},
			},
			control: { type: 'text' },
		},
		width: {
			description: 'Icon width. Overwrites size.',
			table: {
				type: {
					summary: 'string | number',
				},
			},
			control: { type: 'text' },
		},
		viewBox: {
			description: 'SVG view box',
			defaultValue: '0 0 56 56',
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

export const Default = (props: IconProps): JSX.Element => <Icon {...props} />;
Default.args = {
	icon: 'cogs',
};

export const Custom = (props: IconProps): JSX.Element => <Icon {...props} />;
Custom.args = {
	color: '#00cee1',
	icon: 'cog',
	size: '60px',
};

export const CustomPath = (props: IconProps): JSX.Element => <Icon {...props} />;
CustomPath.args = {
	path: 'M12.9,13.8C12.9,13.8,12.9,13.8,12.9,13.8c-0.1,0.1-0.3,0.2-0.5,0.2C4.5,17.9,1.9,28.8,6.6,38.5l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2C43.5,20.6,46.2,9.7,41.5,0L12.9,13.8zM8.6,42.1C8.6,42.1,8.6,42.1,8.6,42.1c-0.1,0.1-0.3,0.1-0.5,0.2C0.3,46.1-2.4,57,2.3,66.7l28.6-13.8 c0,0,0,0,0,0c0.2-0.1,0.3-0.1,0.5-0.2c7.9-3.8,10.5-14.8,5.8-24.4L8.6,42.1z',
	size: '70px',
	viewBox: '0 0 70 70',
};

export const Gallery = (): JSX.Element => {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				fontFamily:
					'"Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif',
				fontSize: '10px',
			}}
		>
			{Object.keys(iconPaths).map((icon, index) => {
				return (
					<div style={{ marginBottom: '40px' }}>
						<Icon icon={icon} color={shiftColor('#3a23ad', (index + '111').padStart(6, '1'))} size="40px" style={{ padding: '20px' }} />
						<div style={{ textAlign: 'center' }}>{icon}</div>
					</div>
				);
			})}
		</div>
	);
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
