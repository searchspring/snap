import type { RecommendationBundleListProps } from '../../../../components/Templates/RecommendationBundleList';
import { recommendationBundleListThemeComponentProps } from '../../../themeComponents/recommendationBundleList';
import { ThemeComponent } from '../../../../providers';

export const recommendationBundleList: ThemeComponent<'recommendationBundleList', RecommendationBundleListProps> =
	recommendationBundleListThemeComponentProps;
