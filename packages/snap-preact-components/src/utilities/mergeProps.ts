import type { ComponentProps } from '../types';
import type { Theme } from '../providers';
import deepmerge from 'deepmerge';

type NamedComponentProps = ComponentProps & {
	named: {
		[name: string]: ComponentProps;
	};
};

export function mergeProps<GenericComponentProps = ComponentProps>(
	componentType: string,
	globalTheme: Theme,
	defaultProps: Partial<GenericComponentProps>,
	props: GenericComponentProps
): GenericComponentProps {
	const theme = (props as ComponentProps).theme;
	const componentName = (props as ComponentProps).name;

	// start with defaultProps
	let mergedProps = {
		...defaultProps,
	};

	// add globalTheme props if they exist
	const globalComponent = globalTheme?.components && globalTheme.components[componentType as keyof typeof globalTheme.components];

	if (globalComponent) {
		mergedProps = mergeThemeProps(componentName, globalComponent, mergedProps) as Partial<GenericComponentProps>;
	}

	// normal props
	mergedProps = {
		...mergedProps,
		...props,
	};

	// add theme props if they exist
	const themeComponent = theme?.components && theme.components[componentType as keyof typeof theme.components];
	if (themeComponent) {
		mergedProps = mergeThemeProps(componentName, themeComponent, mergedProps) as Partial<GenericComponentProps>;
	}

	// put additional theme properties back onto the theme (without components)
	const globalThemeProperties = {
		...globalTheme,
	};
	delete globalThemeProperties.components;

	const themeProperties = {
		...theme,
	};
	delete themeProperties.components;

	mergedProps = {
		...mergedProps,
		theme: {
			...(mergedProps as ComponentProps).theme,
			...deepmerge(globalThemeProperties, themeProperties),
		},
	};

	return mergedProps as GenericComponentProps;
}

function mergeThemeProps(
	componentName = '',
	componentThemeProps: Partial<NamedComponentProps>,
	mergedProps: Partial<NamedComponentProps>
): Partial<NamedComponentProps> {
	// add theme props if they exist
	if (componentThemeProps) {
		mergedProps = {
			...mergedProps,
			...componentThemeProps,
		};

		// get named component props if they exist
		const namedThemeComponentProps =
			componentName && componentThemeProps.named && componentThemeProps.named[componentName as keyof typeof componentThemeProps.named];
		if (namedThemeComponentProps) {
			mergedProps = {
				...mergedProps,
				...mergeThemeProps(componentName, namedThemeComponentProps, mergedProps),
			};
		}
	}

	return mergedProps;
}
