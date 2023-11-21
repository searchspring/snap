/** @jsx jsx */
import { observer } from 'mobx-react-lite';
import { jsx } from '@emotion/react';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { templatesStore, targetId, type, controller, resultComponent, ...otherProps } = properties;
	const targeter = templatesStore.getTargeter(type, targetId);
	const Component = templatesStore?.library?.components[type][targeter.template];
	const themeLocation = templatesStore?.themes?.[targeter.theme.location];
	const theme = themeLocation && themeLocation[targeter.theme.name]?.theme;

	console.log('using component', templatesStore?.library?.components[type][targeter.template]);
	console.log('using components[type]', templatesStore?.library?.components[type]);
	console.log('using targeter.template', targeter.template);
	console.log('using -----');

	console.log('template selecting!');

	// ensuring that theme and component are
	return theme && Component && <Component controller={controller} theme={theme} resultComponent={resultComponent} {...otherProps} />;
});
export interface TemplateSelectProps {
	componentMap: any;
	templatesStore: any;
	targetId: string;
	type: string;
	controller: any;
	resultComponent: any;
	theme?: any;
}
