import { ThemeTemplateProperties } from '../../providers';

export const getProps = <ComponentName extends string, ComponentProps>(
	componentName: string,
	themeTemplate?: ThemeTemplateProperties<ComponentName, ComponentProps>
) => {
	const themeSelectors: any = {
		...(themeTemplate?.components || {}),
	};
	if (themeTemplate?.props) {
		themeSelectors[`*${componentName}`] = themeTemplate.props;
	}
	return themeSelectors;
};
