import { h } from 'preact';

import { ArgsTable, PRIMARY_STORY, Markdown } from '@storybook/blocks';

import { Carousel, CarouselProps } from './Carousel';
import { Icon, iconPaths, IconType } from '../../Atoms/Icon';
import { componentArgs, Colour, highlightedCode } from '../../../utilities';
import Readme from './readme.md';

export default {
	title: 'Molecules/Carousel',
	component: Carousel,
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
			description: 'Configuration for pagination dots',
			table: {
				type: {
					summary: 'boolean | SwiperOptions.pagination',
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
		modules: {
			description: 'Additional Swiper modules',
			table: {
				type: {
					summary: 'SwiperModule[]',
				},
				defaultValue: { summary: '[Navigation, Pagination]' },
			},
			control: { type: 'none' },
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
			defaultValue: false,
			description:
				'If true and children length is less than the current breakpoint slidesPerView value, slidesPerView and slidesPerGroup will be set to the children length and loop to false',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
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
			control: { type: 'none' },
			action: 'onNextButtonClick',
		},
		onPrevButtonClick: {
			description: 'Carousel prev button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onPrevButtonClick',
		},
		onClick: {
			description: 'Carousel onClick event handler (Swiper)',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onClick',
		},
		onInit: {
			description: 'Carousel onInit event handler (Swiper)',
			table: {
				type: {
					summary: 'function',
				},
			},
			control: { type: 'none' },
			action: 'onInit',
		},
		...componentArgs,
	},
};

const count = 10;
const carouselStep = Math.floor(180 / count);
const colors = Array.from(Array(count).keys());
const color = new Colour('#3a23ad');

export const Colors = (props: CarouselProps) => {
	return (
		<Carousel {...props}>
			{colors.map((number, index) => (
				<div style={{ height: '100px', width: '100px', background: color.lighten(index * carouselStep).hex, margin: '0 auto' }}></div>
			))}
		</Carousel>
	);
};
Colors.args = {
	pagination: true,
	hideButtons: true,
	loop: false,
};

const iconPathStep = Math.floor(180 / Object.keys(iconPaths).length);

export const Icons = (props: CarouselProps) => {
	return (
		<Carousel {...props}>
			{Object.keys(iconPaths).map((icon, index) => {
				return (
					<div style={{ margin: '0 auto', textAlign: 'center' }}>
						<Icon icon={icon as IconType} color={color.lighten(index * iconPathStep).hex} size="80px" style={{ padding: '20px' }} />
						<div style={{ textAlign: 'center' }}>{icon}</div>
					</div>
				);
			})}
		</Carousel>
	);
};
