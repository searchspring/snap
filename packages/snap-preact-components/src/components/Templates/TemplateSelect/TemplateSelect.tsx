/** @jsx jsx */
import { observer } from 'mobx-react-lite';
import { jsx } from '@emotion/react';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { templatesStore, targetId, type, controller, resultComponent, ...otherProps } = properties;
	const { loading } = templatesStore;
	const targeter = templatesStore.getTarget(type, targetId);
	const Component = templatesStore?.library?.components[type][targeter.template];
	const themeLocation = templatesStore?.themes?.[targeter.theme.location];
	const theme = themeLocation && themeLocation[targeter.theme.name]?.theme;

	// ensuring that theme and component are
	return !loading && theme && Component && <Component controller={controller} theme={theme} resultComponent={resultComponent} {...otherProps} />;
});
export interface TemplateSelectProps {
	templatesStore: any;
	targetId: string;
	type: string;
	controller: any;
	resultComponent: any;
	theme?: any;
}
