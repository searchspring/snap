import { ThemeComponentProperties, ThemeComponents, ThemeComponentsRestricted } from '../../providers';

export const transformThemeComponent = <ComponentName extends string, ComponentProps>(
	componentName: string,
	themeTemplate?: ThemeComponentProperties<ComponentName, ComponentProps>
): ThemeComponents => {
	const themeSelectors: ThemeComponentsRestricted = {
		...(themeTemplate?.components || {}),
	};
	if (themeTemplate?.props) {
		themeSelectors[`*${componentName}` as keyof typeof themeSelectors] = themeTemplate.props;
	}
	return themeSelectors;
};
