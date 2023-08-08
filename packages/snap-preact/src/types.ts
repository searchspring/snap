import type { Client, ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type {
	ControllerConfig,
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
	ContextVariables,
} from '@searchspring/snap-controller';
import type { SearchStore, AutocompleteStore, FinderStore, RecommendationStore } from '@searchspring/snap-store-mobx';
import type { UrlManager, UrlTranslatorConfig, UrlState } from '@searchspring/snap-url-manager';
import type { EventManager } from '@searchspring/snap-event-manager';
import type { Profiler } from '@searchspring/snap-profiler';
import type { Logger } from '@searchspring/snap-logger';
import type { Tracker } from '@searchspring/snap-tracker';
import { AppMode } from '@searchspring/snap-toolbox';

export type SnapControllerServices = {
	client?: Client;
	store?: SearchStore | AutocompleteStore | FinderStore | RecommendationStore;
	urlManager?: UrlManager;
	eventManager?: EventManager;
	profiler?: Profiler;
	logger?: Logger;
	tracker?: Tracker;
};

type UrlParameterConfig<Type> = {
	[Property in keyof Type]: {
		action?: 'merge' | 'set';
		ignoreParameters?: string[];
		useGlobalIgnoreParameters?: boolean;
		state: Type[Property];
	};
};

export type InitialUrlConfig = {
	settings?: {
		ignoreParameters?: string[];
		useDefaultIgnoreParameters?: boolean;
	};
	parameters: UrlParameterConfig<UrlState>;
};

export type SnapControllerConfig = {
	mode?: keyof typeof AppMode | AppMode;
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: ControllerConfig;
	context?: ContextVariables;
};

export type SnapSearchControllerConfig = {
	mode?: keyof typeof AppMode | AppMode;
	url?: UrlTranslatorConfig & {
		initial?: InitialUrlConfig;
	};
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: SearchControllerConfig;
	context?: ContextVariables;
};

export type SnapAutocompleteControllerConfig = {
	mode?: keyof typeof AppMode | AppMode;
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: AutocompleteControllerConfig;
	context?: ContextVariables;
};

export type SnapFinderControllerConfig = {
	mode?: keyof typeof AppMode | AppMode;
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: FinderControllerConfig;
	context?: ContextVariables;
};

export type SnapRecommendationControllerConfig = {
	mode?: keyof typeof AppMode | AppMode;
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: RecommendationControllerConfig;
	context?: ContextVariables;
};

declare global {
	interface Window {
		searchspring?: any;
	}
}

export type SnapFeatures = {
	integratedSpellCorrection?: {
		enabled?: boolean;
	};
};

export type SnapThemeConfig = {
	import: () => Promise<any> | any;
	variables?: any;
	overrides?: any;
};
