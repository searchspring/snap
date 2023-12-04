import { h } from 'preact';
import { observer } from 'mobx-react';

import { ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs/blocks';

import { Select, SelectProps } from './Select';
import { componentArgs } from '../../../utilities';
import { Snapify } from '../../../utilities/snapify';
import { iconPaths } from '../../Atoms/Icon';
import Readme from '../Select/readme.md';
import type { SearchController } from '@searchspring/snap-controller';

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
			description: 'Hide label when selection has been made (non-native only)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideSelection: {
			description: 'Hide the current selection in the dropdown button (non-native only)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideIcon: {
			description: 'Hide the icon in the dropdown button (non-native only)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideOptionIcons: {
			description: 'Hide the icon in the options (non-native only)',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: false },
			},
			control: { type: 'boolean' },
		},
		hideOptionLabels: {
			description: 'Hide the label in the options (non-native only)',
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
		disableClickOutside: {
			defaultValue: false,
			description: 'Ignore clicks outside of element',
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

const snapInstance = Snapify.search({ id: 'Select', globals: { siteId: '8uyt2m' } });

const ObservableSelect = observer(({ args, controller }: { args: SelectProps; controller: SearchController }) => {
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

export const Default = (args: SelectProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableSelect args={args} controller={controller} />;
};

Default.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Default.args = {
	label: 'Sort By',
};

export const Native = (args: SelectProps, { loaded: { controller } }: { loaded: { controller: SearchController } }) => {
	return <ObservableSelect args={args} controller={controller} />;
};

Native.loaders = [
	async () => {
		await snapInstance.search();
		return {
			controller: snapInstance,
		};
	},
];
Native.args = {
	label: 'Sort By',
	native: true,
};

export const IconOptions = (args: SelectProps) => {
	const iconOptions = [
		{
			label: '1 wide',
			value: '1 wide',
			icon: 'square',
			columns: 1,
		},
		{
			label: '2 wide',
			value: '2 wide',
			icon: {
				icon: 'layout-large',
			},
			columns: 2,
		},
		{
			label: '3 wide',
			value: '3 wide',
			icon: {
				icon: 'layout-grid',
			},
			columns: 3,
		},
	];

	return <Select {...args} options={iconOptions} />;
};

IconOptions.args = {
	label: 'Layout',
};
