/** @jsx jsx */
import { Suspense, lazy } from 'preact/compat';

import { observer } from 'mobx-react-lite';
import { jsx } from '@emotion/react';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { componentMap, templateStore, targetId, type, themeName, controller, resultComponent, resultLayout } = properties;
	const { template, theme } = templateStore.getTemplate(type, targetId, themeName);
	const Component = lazy(() => componentMap[type][template]()) as React.ComponentType<Partial<TemplateSelectProps>>;

	return (
		<Suspense fallback={<div>Loading Template...</div>}>
			<Component controller={controller} theme={theme} resultComponent={resultComponent} resultLayout={resultLayout} />
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
