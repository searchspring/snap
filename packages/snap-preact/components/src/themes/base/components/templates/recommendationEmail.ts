import type { RecommendationEmailProps } from '../../../../components/Templates/RecommendationEmail';
import { recommendationEmailThemeComponentProps } from '../../../themeComponents/recommendationEmail';
import { ThemeComponent } from '../../../../providers';

export const recommendationEmail: ThemeComponent<'recommendationEmail', RecommendationEmailProps> = recommendationEmailThemeComponentProps;
