import { h } from 'preact';
import { observer } from 'mobx-react-lite';
import { ThemeProvider, SnapProvider } from '../../../providers';
import type { Snap } from '../../../../../src';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { snap, templatesStore, targetId, type, controller, resultComponent, ...otherProps } = properties;
	const { loading } = templatesStore;
	const targeter = templatesStore.getTarget(type, targetId);
	const Component = templatesStore?.library?.components[type][targeter.template];
	const themeLocation = templatesStore?.themes?.[targeter.theme.location];
	const theme = themeLocation && themeLocation[targeter.theme.name]?.theme;

	// ensuring that theme and component are
	return (
		!loading &&
		theme &&
		Component && (
			<SnapProvider snap={snap}>
				<ThemeProvider theme={theme}>
					<Component controller={controller} resultComponent={resultComponent} theme={theme} {...otherProps} />
				</ThemeProvider>
			</SnapProvider>
		)
	);
});
export interface TemplateSelectProps {
	templatesStore: any;
	targetId: string;
	type: string;
	controller: any;
	snap: Snap;
	resultComponent: any;
	theme?: any;
}
