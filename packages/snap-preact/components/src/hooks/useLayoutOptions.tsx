import deepmerge from 'deepmerge';
import { useControllerStorage } from './useControllerStorage';
import { Theme } from '../providers';
import { ToolbarProps } from '../components/Organisms/Toolbar';

export const useLayoutOptions = (props: any, globalTheme: Theme) => {
	const layoutOptions = props?.layoutOptions || [];

	// handle layoutOptions and selected option
	const [selectedLayout, setSelectedLayout] = useControllerStorage(
		props.controller,
		'layoutOptions',
		layoutOptions.filter((option: any) => option.default).pop()
	);

	// verify selectedLayout is in layoutOptions - if not set it to the default one
	try {
		if (!layoutOptions.some((option: any) => JSON.stringify(option) == JSON.stringify(selectedLayout))) {
			const newSelection = layoutOptions.filter((option: any) => option.default).pop();
			setSelectedLayout(newSelection);
		}
	} catch (err) {
		props.controller.log('invalid layoutOptions provided to component', props.inherits ? ` '${props.inherits}'` : '');
	}

	props.theme = props.theme || {};
	props.theme.components = {
		...(props.theme.components || {}),
		layoutSelector: {
			options: layoutOptions,
			onSelect: (e: any, option: any) => {
				if (option) {
					setSelectedLayout(option);
				}
			},
			selected: selectedLayout,
		},
	};
	let shouldUseOverrides = false;

	if (globalTheme.components && props.treePath) {
		// pull out the template (top level parent) component from the treePath to use in filtering out globalTheme overrides
		const templateComponent = props.treePath.split(' ')[0];

		// we only want to use overrides if one of the toolbars is actually rendering the layoutSelector
		Object.keys(globalTheme.components).forEach((key) => {
			const paths = key.split(' ');
			const componentTypeAndName = paths.splice(-1).pop() ?? '';
			const [componentType] = componentTypeAndName.split('.');
			if (
				globalTheme.components &&
				componentType == 'toolbar' &&
				(paths[0] == templateComponent || paths[0] == `*${templateComponent}` || !paths.length)
			) {
				const toolbarConfig = globalTheme.components[key as keyof typeof globalTheme.components] as Partial<ToolbarProps>;
				if (toolbarConfig?.layout && toolbarConfig.layout.toString().indexOf('layoutSelector') > -1) {
					shouldUseOverrides = true;
				}
			}
		});
	}

	// grab overrides out of the "selected" or default layoutOptions and merge it in
	if (selectedLayout?.overrides && shouldUseOverrides) {
		props.theme = deepmerge(props.theme, { components: selectedLayout.overrides.components });
	}
};
