import { h } from 'preact';

import { Image, FALLBACK_IMAGE_URL } from './Image';

import { componentArgs } from '../../../utilities';
import { searchResponse } from '../../../mocks/searchResponse';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';
// @ts-ignore
import Readme from '../Image/readme.md';

export default {
	title: `Atoms/Image`,
	component: Image,
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
					margin: '1em',
					width: '350px',
					position: 'relative',
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		src: {
			description: 'Image url',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		alt: {
			description: 'Image alt text',
			type: { required: true },
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		fallback: {
			description: 'Fallback image url',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: FALLBACK_IMAGE_URL },
			},
			control: { type: 'text' },
		},
		hoverSrc: {
			description: 'Image onHover url',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		onLoad: {
			description: 'Image loaded event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onLoad',
		},
		onClick: {
			description: 'Image click event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onClick',
		},
		onMouseOver: {
			description: 'Image mouse enter event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onMouseOver',
		},
		onMouseOut: {
			description: 'Image mouse exit event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onMouseOut',
		},
		...componentArgs,
	},
};

const Template = (args) => <Image {...args} style={{ width: '100%' }} />;

export const Default = Template.bind({});
Default.args = {
	src: searchResponse.results[6].mappings.core.imageUrl,
	alt: searchResponse.results[6].mappings.core.name,
	fallback: undefined,
};

export const BrokenImg = Template.bind({});
BrokenImg.args = {
	src: 'brokenurlgoeshere.comonviefocdns',
	alt: searchResponse.results[0].mappings.core.name,
	fallback: undefined,
};

export const ManualFallBack = Template.bind({});
ManualFallBack.args = {
	src: 'brokenurlgoeshere.comonviefocdns',
	alt: searchResponse.results[0].mappings.core.name,
	fallback: 'https://www.telegraph.co.uk/content/dam/Pets/spark/royal-canin/happy-puppy-xlarge.jpg?imwidth=1200',
};

export const onhover = Template.bind({});
onhover.args = {
	src: searchResponse.results[7].mappings.core.imageUrl,
	alt: searchResponse.results[7].mappings.core.name,
	hoverSrc: searchResponse.results[6].mappings.core.imageUrl,
};
