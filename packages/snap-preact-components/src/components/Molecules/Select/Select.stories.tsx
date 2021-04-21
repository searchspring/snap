import { h } from 'preact';
import { observer } from 'mobx-react';

import { Select, SelectProps } from './Select';

import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { iconPaths } from '../../Atoms/Icon';
import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

// @ts-ignore
import Readme from '../Select/readme.md';

export default {
	title: `Molecules/Select`,
	component: Select,
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
	argTypes: {
		options: {
			description: 'Select options from store reference',
			type: { required: true },
			table: {
				type: {
					summary: 'Array of Option objects',
				},
			},
			control: { type: 'none' },
		},
		selected: {
			description: 'Current selected options from store reference',
			table: {
				type: {
					summary: 'Option object',
				},
			},
			control: { type: 'none' },
		},
		disabled: {
			defaultValue: false,
			description: 'Disable select',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		label: {
			description: 'Header label',
			table: {
				type: {
					summary: 'string, JSX',
				},
			},
			control: { type: 'text' },
		},
		clearSelection: {
			description: 'Unselect label',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'text' },
		},
		hideLabelOnSelection: {
			defaultValue: false,
			description: 'Hide label when selection has been made (non-native only)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		separator: {
			defaultValue: ': ',
			description: 'Select delimiter',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: ': ' },
			},
			control: { type: 'text' },
		},
		color: {
			description: 'Select color',
			table: {
				type: {
					summary: 'string',
				},
			},
			control: { type: 'color' },
		},
		borderColor: {
			description: 'Select border color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		backgroundColor: {
			description: 'Select background color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#FFF' },
			},
			control: { type: 'color' },
		},
		iconColor: {
			description: 'Select icon color',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: '#333' },
			},
			control: { type: 'color' },
		},
		iconOpen: {
			defaultValue: 'angle-down',
			description: 'Icon for when select is closed',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'angle-down' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		iconClose: {
			defaultValue: 'angle-up',
			description: 'Icon for when select is open',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'angle-up' },
			},
			control: {
				type: 'select',
				options: [...Object.keys(iconPaths)],
			},
		},
		stayOpenOnSelection: {
			defaultValue: false,
			description: 'Keep dropdown open when an option is selected',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		startOpen: {
			defaultValue: false,
			description: 'Open on initial render',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		native: {
			defaultValue: false,
			description: 'Use native select element',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		onSelect: {
			description: 'Select onSelect event handler',
			table: {
				type: {
					summary: 'function',
				},
			},
			action: 'onSelect',
		},
		...componentArgs,
	},
};

const selectOptions = [
	{
		label: 'Red',
		value: 'red',
	},
	{
		label: 'Orange',
		value: 'orange',
	},
	{
		label: 'Yellow',
		value: 'yellow',
	},
	{
		label: 'Green',
		value: 'green',
	},
	{
		label: 'Blue',
		value: 'blue',
	},
	{
		label: 'Indigo',
		value: 'indigo',
	},
	{
		label: 'Violet',
		value: 'violet',
	},
];

const snapInstance = Snapify.search({ globals: { siteId: 'scmq7n' } });

const ObservableSelect = observer(({ args, controller }) => {
	return (
		<Select
			{...args}
			options={controller?.store?.sorting?.options}
			selected={controller?.store?.sorting?.current}
			onSelect={(e, selectedOption) => {
				selectedOption && selectedOption.url.go();
			}}
		/>
	);
});

const Template = (args: SelectProps, { loaded: { controller } }) => {
	return <ObservableSelect args={args} controller={controller} />;
};

export const Default = Template.bind({});
Default.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Default.args = {
	label: 'Sort By',
};

export const Native = Template.bind({});
Native.loaders = [
	async () => ({
		controller: await snapInstance.search(),
	}),
];
Native.args = {
	label: 'Sort By',
	native: true,
};
