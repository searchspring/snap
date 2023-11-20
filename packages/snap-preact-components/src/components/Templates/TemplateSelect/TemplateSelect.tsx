/** @jsx jsx */
import { Fragment } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { jsx } from '@emotion/react';

export const TemplateSelect = observer((properties: TemplateSelectProps): JSX.Element => {
	const { componentMap, templateStore, targetId, type, controller, resultComponent, ...otherProps } = properties;
	const { template, theme } = templateStore.getTemplate(type, targetId);
	const Component = lazy(() => componentMap[template]()) as React.ComponentType<Partial<TemplateSelectProps>>;

	// ensuring that theme and component are
	return (
		theme &&
		Component && (
			<Suspense fallback={<Fragment />}>
				<Component controller={controller} theme={theme} resultComponent={resultComponent} {...otherProps} />
			</Suspense>
		)
	);
});
export interface TemplateSelectProps {
	componentMap: any;
	templateStore: any;
	targetId: string;
	type: string;
	controller: any;
	resultComponent: any;
	theme?: any;
}
