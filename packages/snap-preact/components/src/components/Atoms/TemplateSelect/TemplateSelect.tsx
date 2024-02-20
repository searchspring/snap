import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { ControllerTypes } from '@searchspring/snap-controller';
import { ThemeProvider, SnapProvider, Theme } from '../../../providers';
import type { SnapTemplates } from '../../../../../src';
// TODO: cleanup path to just /src when exports added
import type { TemplatesStore, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { snap, templatesStore, targetId, type, controller, resultComponent, ...otherProps } = properties;
	const { loading } = templatesStore;
	const targeter = templatesStore.getTarget(type, targetId);
	const Component = templatesStore?.library?.components[type as keyof typeof templatesStore.library.components][targeter.template];
	const themeLocation = templatesStore?.themes?.[targeter.theme.location];
	const themeStore = themeLocation && themeLocation[targeter.theme.name];
	const theme = themeStore?.theme;

	// ensuring that theme and component are ready to render
	return !loading && theme && Component ? (
		<SnapProvider snap={snap}>
			<ThemeProvider theme={theme}>
				<Component controller={controller} resultComponent={resultComponent} {...otherProps} />
			</ThemeProvider>
		</SnapProvider>
	) : (
		<></>
	);
});
export interface TemplateSelectProps {
	templatesStore: TemplatesStore;
	targetId: string;
	type: TemplateTypes;
	controller: ControllerTypes;
	snap: SnapTemplates;
	resultComponent: any;
	theme?: Theme;
}
