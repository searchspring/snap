import { Fragment, h } from 'preact';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Carousel, defaultCarouselResponsive } from './Carousel';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { Result } from '../../Molecules/Result';
import Readme from './readme.md';

export default {
	title: `Organisms/Carousel`,
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
		(Story) => (
			<div
				style={{
					maxWidth: '900px',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		loop: {
			defaultValue: true,
			description: 'Recommendation pagination loops',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: true },
			},
			control: { type: 'boolean' },
		},
		title: {
			description: 'Recommendation title',
			table: {
				type: {
					summary: 'string | JSX Element',
				},
				defaultValue: { summary: '' },
			},
			control: { type: 'text' },
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
			defaultValue: defaultCarouselResponsive,
			description: 'Recommendation title',
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: { summary: 'Breakpoint object' },
			},
			control: { type: 'object' },
		},
		onNextButtonClick: {
			description: 'Carousel next button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onPrevButtonClick: {
			description: 'Carousel prev button click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onCarouselClick: {
			description: 'Carousel Child click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onSlideChange: {
			description: 'On slide change event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onBreakpoint: {
			description: 'Window resize breakpoint event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'window resize',
		},
		...componentArgs,
	},
};

const snapInstance = Snapify.recommendation({ id: 'Recommendation', tag: 'trending', globals: { siteId: '8uyt2m' } });
export const Products = (props, { loaded: { controller } }) => {
	return (
		<Carousel {...props}>
			{controller.store?.results.map((result) => (
				<Result result={result} />
			))}
		</Carousel>
	);
};

const people = ['Chris', 'Kevin', 'Dennis', 'John', 'Kelly', 'Jessy', 'Phil', 'Kyle'];
export const Names = (props) => {
	return <Carousel {...props}>{people}</Carousel>;
};

const colors = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'black', 'white'];
export const Colors = (props) => {
	return (
		<Carousel {...props}>
			{colors.map((color) => (
				<div style={{ height: '100px', width: '100px', background: color }}></div>
			))}
		</Carousel>
	);
};

const puppyImgs = [
	'https://www.thesprucepets.com/thmb/EBp990AJt94XwAp7oOAzUtdg9Xg=/2121x1193/smart/filters:no_upscale()/golden-retriever-puppy-in-grass-923135452-5c887d4146e0fb00013365ba.jpg',
	'https://media.4-paws.org/1/e/d/6/1ed6da75afe37d82757142dc7c6633a532f53a7d/VIER%20PFOTEN_2019-03-15_001-2886x1999-1920x1330.jpg',
	'https://dogtime.com/assets/uploads/2011/03/puppy-development.jpg',
	'https://www.forbes.com/uk/advisor/wp-content/uploads/2021/05/short-coated-tan-puppy-stockpack-unsplash-scaled.jpg',
	'https://www.rcinet.ca/en/wp-content/uploads/sites/3/2020/11/dog-cute-puppy-spca.jpg',
	'https://www.petmd.com/sites/default/files/styles/article_image/public/puppy-laying-down-outside.jpg?itok=ClNNCi52',
	'https://gardneranimalcarecenter.com/wp-content/uploads/2019/10/puppy-1082141_1280-min-1080x675.jpg',
];
export const Puppys = (props) => {
	return (
		<Carousel {...props}>
			{puppyImgs.map((pup) => (
				<img style={{ width: '150px' }} src={pup} />
			))}
		</Carousel>
	);
};

export const Swatches = (props, { loaded: { controller } }) => {
	return (
		<Carousel {...props}>
			{controller.store?.results.map((result) => {
				return (
					<div style={{ maxWidth: '250px' }}>
						<Result
							result={result}
							buttonSlot={
								<Carousel {...props} onCarouselClick={(e) => (result.mappings.core.imageUrl = e.target.src)}>
									{puppyImgs.map((img) => (
										<div style={{ position: 'relative', height: '25px', width: '25px' }}>
											<img
												src={img}
												style={{
													top: '0',
													left: '0',
													right: '0',
													width: 'auto',
													border: '2px solid white',
													bottom: '0',
													height: 'auto',
													margin: 'auto',
													display: 'inline',
													opacity: '1',
													padding: '2px',
													position: 'absolute',
													maxWidth: '100%',
													maxHeight: '100%',
												}}
											/>
										</div>
									))}
								</Carousel>
							}
						/>
					</div>
				);
			})}
		</Carousel>
	);
};

Products.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];

Swatches.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
