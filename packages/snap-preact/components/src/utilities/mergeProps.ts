import type { ComponentProps } from '../types';
import type { Theme, ThemeComponents } from '../providers';

export function mergeProps<GenericComponentProps = ComponentProps>(
	componentType: string,
	globalTheme: Theme,
	defaultProps: Partial<GenericComponentProps>,
	props: GenericComponentProps
): GenericComponentProps {
	/*

		production behaviour:
		
		1. start with default props
		2. spreads global theme props of component
		3. spreads standard props (directly passed via JSX) - these may be provided by the integration or sub-props
		4. spreads component theme props of component

		templates behaviour:
		
		1. start with default props
		2. spreads standard props (directly passed via JSX) - these may be provided by the integration or sub-props
		3. spreads component theme props of component and named component
		4. spreads global theme props of component and named component
		5. ensure templates theme variables pass on in `theme`
		6. if treepath contains 'custom' do #2 again

	*/

	const theme = (props as ComponentProps).theme;
	const componentName = (props as any)?.name;

	let treePath = (props as ComponentProps).treePath || (defaultProps as ComponentProps).treePath || '';

	if (componentType !== 'layout' && componentType !== 'autocompleteTemplate') {
		treePath += `${treePath ? ' ' : ''}${componentType}`;
	}

	// start with defaultProps
	let mergedProps = {
		...defaultProps,
	};

	if (!globalTheme?.name) {
		// add globalTheme props if they exist
		const globalComponent = globalTheme?.components && globalTheme.components[componentType as keyof typeof globalTheme.components];

		if (globalComponent) {
			mergedProps = mergeThemeProps(globalComponent, mergedProps) as Partial<GenericComponentProps>;
		}

		// normal props
		mergedProps = {
			...mergedProps,
			...props,
			treePath,
		};

		// add theme props if they exist
		const themeComponent = theme?.components && theme.components[componentType as keyof typeof theme.components];
		if (themeComponent) {
			mergedProps = mergeThemeProps(themeComponent, mergedProps) as Partial<GenericComponentProps>;
		}
	} else {
		// normal props
		mergedProps = {
			...mergedProps,
			...props,
		};

		treePath += componentName?.match(/^[A-Z,a-z,-]+$/) ? `.${componentName}` : '';

		// component props from the theme
		// add globalTheme props for components with selector matches if they exist
		const filteredGlobalApplicableSelectors = filterSelectors(globalTheme?.components || {}, treePath);
		const globalApplicableSelectors = filteredGlobalApplicableSelectors.sort(sortSelectors);
		globalApplicableSelectors.forEach((selector) => {
			const componentProps = globalTheme.components?.[selector as keyof typeof globalTheme.components];
			if (componentProps) {
				mergedProps = mergeThemeProps(componentProps, mergedProps) as Partial<GenericComponentProps>;
			}
		});

		// og theme prop in default components
		// add theme props for components with selector matches if they exist
		const themeApplicableSelectors = filterSelectors(theme?.components || {}, treePath).sort(sortSelectors);
		themeApplicableSelectors.forEach((selector) => {
			const componentProps = theme?.components?.[selector as keyof typeof globalTheme.components];
			if (componentProps) {
				mergedProps = mergeThemeProps(componentProps, mergedProps) as Partial<GenericComponentProps>;
			}
		});

		// tacking on name and variables to `theme`
		mergedProps = {
			...mergedProps,
			theme: {
				...(mergedProps as ComponentProps).theme,
				name: globalTheme.name,
			},
			treePath,
		};

		if ((props as any).lang) {
			(mergedProps as any).lang = (props as any).lang;
		}

		if (globalTheme.variables) {
			(mergedProps as ComponentProps).theme!.variables = globalTheme.variables;
		}

		//if custom component, re-spread props again
		if (treePath && treePath.indexOf('customComponent') > -1) {
			mergedProps = {
				...mergedProps,
				...props,
			};
		}
	}

	return mergedProps as GenericComponentProps;
}

function mergeThemeProps(componentThemeProps: Partial<ComponentProps>, mergedProps: Partial<ComponentProps>): Partial<ComponentProps> {
	// add theme props if they exist
	if (componentThemeProps) {
		mergedProps = {
			...mergedProps,
			...componentThemeProps,
		};
	}

	return mergedProps;
}

// sort function is necessary in order for the user overrides to take priority over the base theme and also for responsive overrides
// weights are used in the reduce initial value
// priority is: Base - * < Override < Responsive - "(M)" || "(T)" || "(D)" [regex find responsive matches]
export function sortSelectors(a: string, b: string): number {
	const aWeight = a
		.split(' ')
		.map((selector, i) => (i * 2) ** (selector.includes('.') ? 2 : 1))
		.reduce((acc, val) => acc + val, (a.includes('*') ? 0 : 1000) + (a.match(/\([MDT]\)/) ? 2000 : 0));
	const bWeight = b
		.split(' ')
		.map((selector, i) => (i * 2) ** (selector.includes('.') ? 2 : 1))
		.reduce((acc, val) => acc + val, (b.includes('*') ? 0 : 1000) + (b.match(/\([MDT]\)/) ? 2000 : 0));

	return aWeight - bWeight;
}

export function filterSelectors(themeComponents: ThemeComponents, treePath: string): string[] {
	let selectors = Object.keys(themeComponents);
	const paths = treePath.split(' ');
	const componentTypeAndName = paths.slice(-1).pop() ?? '';
	const [componentType, componentName] = componentTypeAndName.split('.');

	const mappedSplitTreePath = paths.map((path) => {
		const [type, name] = path.split('.');
		return {
			type,
			name,
			path,
		};
	});

	if (componentName) {
		selectors = selectors.filter((key) => {
			const keys = key.split(' ');
			const lastkey = keys[keys.length - 1].replace(/\*?(\([MDT]\))?/g, '');
			if (lastkey == componentType || lastkey == `${componentType}.${componentName}`) {
				return true;
			}
		});
	} else {
		selectors = selectors.filter((key) => key.endsWith(componentType));
	}
	return selectors.filter((selector) => {
		// when considering matches, we do not care about the base theme prefix "*" nor the responsive prefix "(M)" || "(T)" || "(D)"
		// these are automatically added by the ThemeStore in Snap Templates in order to preserve merge ordering of these overrides
		const split = selector
			.replace(/\*?(\([MDT]\))?/g, '')
			.split(' ')
			.slice(0, -1);

		if (split.length == 0) return true;

		for (let s = 0; s < split.length; s++) {
			let prevIndex = -1;
			const value = split[s];

			for (let i = prevIndex == -1 ? 0 : prevIndex; i < mappedSplitTreePath.length; i++) {
				const pathValue = mappedSplitTreePath[i];

				if (value === pathValue.path || value === pathValue.type) {
					prevIndex = s;
					break;
				}
			}

			if (prevIndex == -1) {
				// selector path not found at all - selector is invalid
				return false;
			}
		}

		return true;
	});
}
