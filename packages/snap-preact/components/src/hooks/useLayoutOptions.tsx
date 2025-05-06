import deepmerge from 'deepmerge';
import { useControllerStorage } from './useControllerStorage';
import { Theme } from '../providers';

export const useLayoutOptions = (props: any, globalTheme: Theme) => {
	const layoutOptions = props?.layoutOptions || [];

	// handle layoutOptions and selected option
	const [selectedLayout, setSelectedLayout] = useControllerStorage(
		props.controller,
		'layoutOptions',
		layoutOptions.filter((option: any) => option.default).pop()
	);

	// verify selectedLayout is in layoutOptions - if not set it to the default one
	if (!layoutOptions.some((option: any) => option.value == selectedLayout.value)) {
		const newSelection = layoutOptions.filter((option: any) => option.default).pop();
		setSelectedLayout(newSelection);
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

	//we only want to use overrides if one of the toolbars is actually rendering the layoutSelector
	Object.keys(globalTheme.components).forEach((key) => {
		const paths = key.split(' ');
		const componentTypeAndName = paths.splice(-1).pop() ?? '';
		const [componentType] = componentTypeAndName.split('.');
		if (componentType == 'toolbar') {
			const toolbarConfig = globalTheme.components[key];
			if (toolbarConfig?.layout && toolbarConfig.layout.toString().indexOf('layoutSelector') > -1) {
				shouldUseOverrides = true;
			}
		}
	});

	// grab overrides out of the "selected" or default layoutOptions and merge it in
	if (selectedLayout?.overrides && shouldUseOverrides) {
		props.theme = deepmerge(props.theme, { components: selectedLayout.overrides.components });
	}
};
