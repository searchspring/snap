import { useEffect, useState } from 'preact/hooks';

import type { FunctionalComponent } from 'preact';
import type { RecommendationController } from '@searchspring/snap-controller';

export const useComponent = (snap: any, template: string): undefined | (() => FunctionalComponent<{ controller: RecommendationController }>) => {
	const [recommendationTemplateComponent, setRecommendationTemplateComponent] = useState<
		undefined | (() => FunctionalComponent<{ controller: RecommendationController }>)
	>(undefined);

	useEffect(() => {
		const importFn = snap?.templates?.library.import.component[template];
		if (importFn && typeof importFn === 'function') {
			importFn().then((component: FunctionalComponent) => {
				setRecommendationTemplateComponent(() => component);
			});
		}
	}, []);

	return recommendationTemplateComponent;
};
