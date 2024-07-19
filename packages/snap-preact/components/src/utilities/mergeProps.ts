import type { ComponentProps } from '../types';
import type { Theme } from '../providers';

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
	/*

		production behaviour:
		
		1. start with default props
		2. spreads global theme props of component
		3. spreads standard props (directly passed via JSX) - these may be provided by the integration or sub-props
		4. spreads component theme props of component

		templates behaviour:
		
		1. start with default props
		2. spreads standard props (directly passed via JSX) - these may be provided by the integration or sub-props
		3. spreads global theme props of component and named component
		4. spreads component theme props of component and named component
		5. ensure templates theme variables pass on in `theme`

	*/

	const theme = (props as ComponentProps).theme;
	const componentName = (props as ComponentProps).name;

	// start with defaultProps
	let mergedProps = {
		...defaultProps,
	};

	if (!globalTheme?.name) {
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
	} else {
		// normal props
		mergedProps = {
			...mergedProps,
			...props,
		};

		// add globalTheme props if they exist
		const globalComponent = globalTheme?.components && globalTheme.components[componentType as keyof typeof globalTheme.components];
		if (globalComponent) {
			mergedProps = mergeThemeProps(componentName, globalComponent, mergedProps) as Partial<GenericComponentProps>;
		}

		// add theme props if they exist
		const themeComponent = theme?.components && theme.components[componentType as keyof typeof theme.components];
		if (themeComponent) {
			mergedProps = mergeThemeProps(componentName, themeComponent, mergedProps) as Partial<GenericComponentProps>;
		}

		// tacking on name, variables and layoutOptions to `theme`
		mergedProps = {
			...mergedProps,
			theme: {
				...(mergedProps as ComponentProps).theme,
				name: globalTheme.name,
				variables: globalTheme.variables,
				layoutOptions: globalTheme.layoutOptions,
			},
		};
	}

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

			// remove the named props after having pulled them out
			delete mergedProps.named;
		}
	}

	return mergedProps;
}
