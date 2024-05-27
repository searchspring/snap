import { useEffect, useState } from 'preact/hooks';

import type { FunctionalComponent } from 'preact';
import { ComponentMap } from '../types';

export const useComponentMap = (map: ComponentMap, name: string): undefined | FunctionalComponent<any> => {
	const [importedComponent, setImportedComponent] = useState<undefined | FunctionalComponent>(undefined);

	useEffect(() => {
		const importFn = map[name];
		if (importFn && typeof importFn === 'function') {
			const componentFn = importFn();
			if (componentFn instanceof Promise) {
				componentFn.then((component: FunctionalComponent) => {
					setImportedComponent(() => component);
				});
			} else {
				setImportedComponent(() => componentFn);
			}
		}
	}, []);

	return importedComponent;
};
