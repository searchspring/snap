import { Fragment, h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Carousel, CarouselProps } from './Carousel';
import { Icon, iconPaths } from '../../Atoms/Icon';
import { componentArgs, shiftColor } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: `Molecules/Carousel`,
	component: Carousel,
	parameters: {
		docs: {
			page: () => (
				<div>
					<Readme />
					<ArgsTable story={PRIMARY_STORY} />
				</div>
			),
		},
	},
	decorators: [
		(Story: any) => (
			<div
				style={{
					maxWidth: '900px',
					height: '300px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		loop: {
			defaultValue: true,
			description: 'Carousel slides loop',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		pagination: {
			defaultValue: false,
			description: 'Display pagination dots',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		vertical: {
			defaultValue: false,
			description: 'Carousel vertical slide direction',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideButtons: {
			defaultValue: false,
			description: 'Hide prev/next buttons',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		prevButton: {
			description: 'Previous button',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
			},
			control: { type: 'text' },
		},
		nextButton: {
			description: 'Next button',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
			},
			control: { type: 'text' },
		},
		breakpoints: {
			defaultValue: undefined,
			description: 'Carousel breakpoints',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Breakpoint object' },
			},
			control: { type: 'object' },
		},
		autoAdjustSlides: {
			defaultValue: true,
			description:
				'If true and children length is less than the current breakpoint slidesPerView value, slidesPerView and slidesPerGroup will be set to the children length and loop to false',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		onNextButtonClick: {
			description: 'Carousel next button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onNextButtonClick',
		},
		onPrevButtonClick: {
			description: 'Carousel prev button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onPrevButtonClick',
		},
		onClick: {
			description: 'Carousel onClick event handler (Swiper)',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onInit: {
			description: 'Carousel onInit event handler (Swiper)',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onInit',
		},
		...componentArgs,
	},
};

const colors = Array.from(Array(9).keys());

export const Colors = (props: CarouselProps) => {
	return (
		<Carousel {...props}>
			{colors.map((number, index) => (
				<div style={{ height: '100px', width: '100px', background: shiftColor('#3a23ad', (index + `111`).padStart(6, '0')), margin: '0 auto' }}></div>
			))}
		</Carousel>
	);
};
Colors.args = {
	pagination: true,
	hideButtons: true,
	loop: false,
};

export const Icons = (props: CarouselProps) => {
	return (
		<Carousel {...props}>
			{Object.keys(iconPaths).map((icon, index) => {
				return (
					<div style={{ margin: '0 auto', textAlign: 'center' }}>
						<Icon icon={icon} color={shiftColor('#3a23ad', (index + '111').padStart(6, '1'))} size="80px" style={{ padding: '20px' }} />
						<div style="text-align: center">{icon}</div>
					</div>
				);
			})}
		</Carousel>
	);
};
