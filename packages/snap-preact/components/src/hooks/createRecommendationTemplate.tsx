import { RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import { SnapTemplates } from '../../../src';
import { Theme, useSnap } from '../providers';
import { useCreateController } from './useCreateController';
import { useComponent } from './useComponent';
import { ResultComponent, RecommendationComponentNames } from '../types';
import { FunctionalComponent } from 'preact';
import { RecommendationProps } from '../components/Templates/Recommendation';
import { RecommendationGridProps } from '../components/Templates/RecommendationGrid';

export type templatesType = {
	recommendation?: {
		enabled: boolean;
		component?: RecommendationComponentNames; // Need a type for allowed recommendation component names (that would exist in the library)
		resultComponent?: string;
		config?: Partial<RecommendationControllerConfig>;
	};
};

type returnType = {
	RecommendationTemplateComponent: FunctionalComponent<RecommendationProps | RecommendationGridProps> | undefined;
	RecommendationTemplateResultComponent: ResultComponent | undefined;
	recsController: RecommendationController | undefined;
};

export function createRecommendationTemplate(templates: templatesType, theme?: Theme): returnType {
	let recommendationTemplateComponent: FunctionalComponent<{ controller: RecommendationController; name: string }> | undefined;
	let recommendationTemplateResultComponent: ResultComponent | undefined;
	let recsController: RecommendationController | undefined;

	if (templates?.recommendation?.enabled) {
		const componentName = templates?.recommendation?.component || 'Recommendation';
		const snap = useSnap() as SnapTemplates;

		if (snap?.templates) {
			const themeName = theme?.name;
			let defaultResultComponentFromTheme;
			if (themeName) {
				defaultResultComponentFromTheme = snap?.templates?.config.themes[themeName]?.resultComponent;
			}

			const resultComponentName = (templates?.recommendation?.resultComponent || defaultResultComponentFromTheme) as string;
			const mergedConfig = Object.assign(
				{
					id: '',
					tag: 'no-results',
					branch: 'production',
				},
				templates.recommendation!.config
			);
			mergedConfig.id = mergedConfig.id || `search-${mergedConfig.tag}`;

			recsController = useCreateController<RecommendationController>(snap, 'recommendation', mergedConfig);
			if (!recsController?.store?.loaded && !recsController?.store?.loading && recsController?.store.error?.type !== 'error') {
				recsController?.search();
			}

			if (resultComponentName && snap?.templates?.library.import.component.result) {
				recommendationTemplateResultComponent = useComponent(snap?.templates?.library.import.component.result, resultComponentName);
			}

			if (componentName && snap?.templates?.library.import.component.recommendation.default) {
				recommendationTemplateComponent = useComponent(snap?.templates?.library.import.component.recommendation.default, componentName);
			}
		}
	}

	const returnObj: returnType = {
		RecommendationTemplateComponent: recommendationTemplateComponent as
			| FunctionalComponent<RecommendationProps | RecommendationGridProps>
			| undefined,
		RecommendationTemplateResultComponent: recommendationTemplateResultComponent as ResultComponent | undefined,
		recsController: recsController,
	};

	return returnObj;
}
