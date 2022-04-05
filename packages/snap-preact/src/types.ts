import type { Client, ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type {
	AbstractController,
	SearchControllerConfig,
	AutocompleteControllerConfig,
	FinderControllerConfig,
	RecommendationControllerConfig,
	ContextVariables,
} from '@searchspring/snap-controller';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { UrlManager, UrlTranslatorConfig } from '@searchspring/snap-url-manager';
import type { EventManager } from '@searchspring/snap-event-manager';
import type { Profiler } from '@searchspring/snap-profiler';
import type { Logger } from '@searchspring/snap-logger';
import type { Tracker } from '@searchspring/snap-tracker';

export type SnapControllerServices = {
	client?: Client;
	store?: AbstractStore;
	urlManager?: UrlManager;
	eventManager?: EventManager;
	profiler?: Profiler;
	logger?: Logger;
	tracker?: Tracker;
};

export type SnapControllerConfigs =
	| SnapSearchControllerConfig
	| SnapAutocompleteControllerConfig
	| SnapFinderControllerConfig
	| SnapRecommendationControllerConfig;

export type RootComponent = React.ElementType<{ controller: AbstractController }>;

export type SnapSearchControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: SearchControllerConfig;
	context?: ContextVariables;
};

export type SnapAutocompleteControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: AutocompleteControllerConfig;
	context?: ContextVariables;
};

export type SnapFinderControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: FinderControllerConfig;
	context?: ContextVariables;
};

export type SnapRecommendationControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: RecommendationControllerConfig;
	context?: ContextVariables;
};
