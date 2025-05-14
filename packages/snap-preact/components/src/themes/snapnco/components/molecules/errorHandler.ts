import type { ErrorHandlerProps } from '../../../../components/Molecules/ErrorHandler';
import { ThemeComponent } from '../../../../providers';

// ErrorHandler component props
export const errorHandler: ThemeComponent<'errorHandler', ErrorHandlerProps> = {
	default: {
		props: {
			// themeStyleScript: ErrorHandlerStyleScript,
		},
	},
};
