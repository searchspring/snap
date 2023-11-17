/** @jsx jsx */
import { Suspense, lazy } from 'preact/compat';

import { observer } from 'mobx-react-lite';
import { jsx } from '@emotion/react';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { templateStore, targetId, type, controller, resultComponent, resultLayout, ...otherProps } = properties;
	// @ts-ignore - TODO: fix this
	const Component = lazy(() => templateStore.getTemplate(type, targetId)) as React.ComponentType<Partial<TemplateSelectProps>>;
	const theme = lazy(async () => await templateStore.getTheme(type, targetId));

	console.log('Component', Component);
	console.log('theme', theme);
	// const { template, theme } = templateStore.getTemplate(type, targetId);
	// const Component = lazy(() => componentMap[type][template]()) as React.ComponentType<Partial<TemplateSelectProps>>;

	return (
		<Suspense fallback={<div>Loading Template...</div>}>
			<Component controller={controller} theme={theme} resultComponent={resultComponent} resultLayout={resultLayout} {...otherProps} />
		</Suspense>
	);
});

export interface TemplateSelectProps {
	componentMap: any;
	type: string;
	templateStore: any;
	targetId: string;
	themeName: string;
	controller: any;
	resultComponent: any;
	resultLayout: any;
	theme?: any;
}
