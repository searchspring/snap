import { h, Fragment } from 'preact';
import { observer } from 'mobx-react-lite';
import { Controllers } from '@searchspring/snap-controller';
import { ThemeProvider, ControllerProvider, SnapProvider, Theme } from '../../../providers';
import type { SnapTemplates } from '../../../../../src';
import type { TemplatesStore, TemplateThemeTypes, TemplateTypes } from '../../../../../src/Templates/Stores/TemplateStore';
import type { ResultComponent as ResultComponentType } from '../../../';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { snap, templatesStore, targetId, type, controller, ...otherProps } = properties;
	const { loading } = templatesStore;
	const targeter = templatesStore.getTarget(type, targetId);
	if (!targeter) {
		controller.log.error(`Target "${targetId}" not found in store for type "${type}"`);
		return <Fragment />;
	}
	const Component = templatesStore.library.getComponent(type, targeter.component);

	let ResultComponent: ResultComponentType | undefined = undefined;
	if (targeter.resultComponent) {
		ResultComponent = templatesStore.library.components.result[targeter.resultComponent];
		if (!loading && !ResultComponent) {
			const error = `Result component "${targeter.resultComponent}" not found in library for target "${targetId}"`;
			controller.log.error(error);
			throw error;
		}
	}
	const themeLocation = templatesStore?.themes?.[targeter.theme.location as TemplateThemeTypes];
	const themeStore = themeLocation && themeLocation[targeter.theme.name];
	const theme = themeStore?.theme;

	if (!loading && !theme) {
		// TODO: when using the template editor, the preload is not complete yet so this throws and breaks functionality.
		// const error = `Theme "${targeter.theme.name}" not found in library for target "${targetId}"`;
		// controller.log.error(error);
		// throw error;
	}

	let componentProp = {};
	if (targeter.resultComponent && ResultComponent) {
		componentProp = {
			resultComponent: ResultComponent,
		};
	}

	console.log('rendering template select', !loading && theme && Component);
	// ensuring that theme and component are ready to render
	return !loading && theme && Component ? (
		<SnapProvider snap={snap}>
			<ThemeProvider theme={theme}>
				<ControllerProvider controller={controller}>
					<div className={`ss__template-select ss__theme__${theme.name}`}>
						<Component controller={controller} {...componentProp} {...otherProps} />
					</div>
				</ControllerProvider>
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
