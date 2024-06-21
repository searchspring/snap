import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';
import { Controllers } from '@searchspring/snap-controller';
import { ThemeProvider, SnapProvider, Theme } from '../../../providers';
import type { SnapTemplates } from '../../../../../src';
// TODO: cleanup path to just /src when exports added
import type { TemplatesStore, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';
import type { ResultComponent as ResultComponentType } from '../../../';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { snap, templatesStore, targetId, type, controller, ...otherProps } = properties;
	const { loading } = templatesStore;
	const targeter = templatesStore.getTarget(type, targetId);
	const Component = templatesStore?.library?.components[type as keyof typeof templatesStore.library.components][targeter.component];
	let ResultComponent: ResultComponentType | undefined = undefined;
	if (targeter.resultComponent) {
		ResultComponent = templatesStore?.library?.components.result[targeter.resultComponent];
		if (!ResultComponent) {
			controller.log.error(`Result component "${targeter.resultComponent}" not found in library for target "${targetId}"`);
			return <Fragment />;
		}
	}
	const themeLocation = templatesStore?.themes?.[targeter.theme.location];
	const themeStore = themeLocation && themeLocation[targeter.theme.name];
	const theme = themeStore?.theme;

	// ensuring that theme and component are ready to render
	return !loading && theme && Component ? (
		<SnapProvider snap={snap}>
			<ThemeProvider theme={theme}>
				<div className={`ss__template-select ss__theme__${theme.name}`}>
					<Component controller={controller} resultComponent={ResultComponent} {...otherProps} />
				</div>
			</ThemeProvider>
		</SnapProvider>
	) : (
		<Fragment />
	);
});
export interface TemplateSelectProps {
	templatesStore: TemplatesStore;
	targetId: string;
	type: TemplateTypes;
	controller: Controllers;
	snap: SnapTemplates;
	theme?: Theme;
}
