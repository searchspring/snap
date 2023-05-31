import type { UrlManager } from '@searchspring/snap-url-manager';
import { InitialUrlConfig } from '../types';

const VALID_ACTIONS = ['merge', 'set'];
const DEFAULT_IGNORE_PARAMETERS = ['query', 'tag', 'oq', 'fallbackQuery'];

export const getInitialUrlState = (intitialStateConfig: InitialUrlConfig, urlManager: UrlManager): UrlManager => {
	const { parameters } = intitialStateConfig;
	const useDefaultIgnoreParameters = intitialStateConfig.settings?.useDefaultIgnoreParameters ?? true;

	// global ignore parameters combine configured ignore with default when set
	let globalIgnoreParameters = intitialStateConfig?.settings?.ignoreParameters || [];
	globalIgnoreParameters = useDefaultIgnoreParameters ? globalIgnoreParameters.concat(DEFAULT_IGNORE_PARAMETERS) : globalIgnoreParameters;

	const initialUrlState = urlManager;
	let newUrlState = urlManager.merge({});

	Object.keys(parameters).forEach((param) => {
		const action = parameters[param].action || 'merge';
		const { state } = parameters[param];
		const ignoreParameters = parameters[param].ignoreParameters || [];
		const useGlobalIgnoreParameters = parameters[param].useGlobalIgnoreParameters ?? true;
		const specificIgnoreParameters = useGlobalIgnoreParameters ? globalIgnoreParameters.concat(ignoreParameters) : ignoreParameters;

		const applyState = Boolean(Object.keys(initialUrlState.state).filter((key) => !specificIgnoreParameters.includes(key)).length == 0);

		if (state && applyState && VALID_ACTIONS.includes(action)) {
			newUrlState = newUrlState[action](param, state);
		}
	});

	return newUrlState;
};
