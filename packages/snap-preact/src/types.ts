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
import type { CSSInterpolation } from '@emotion/serialize';
import type { ThemeVariables } from '../components/src';
import { AppMode } from '@searchspring/snap-toolbox';

export type IntegrationPlatforms = 'shopify' | 'bigCommerce' | 'magento2' | 'other';

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

export type GlobalThemeStyleScript = (props: { name?: string; variables?: ThemeVariables }) => CSSInterpolation;

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

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

// This would be wired to `TemplateEditorStore.setControllerOverride`.
export type SetOverrideFn<Controller> = (obj: { path: string[]; value?: unknown; controller: Controller }) => void;
export type ResetOverrideFn<Controller> = (obj: { path: string[]; value?: unknown; controller: Controller }) => void;

// The state of a UI control, which determines how it's rendered.
export type ControlDisplayState = 'visible' | 'disabled' | 'hidden';

// Defines a single abstracted UI control (e.g., a dropdown).
export interface AbstractedControl<Controller> {
	// The type of UI control to render.
	type: 'dropdown' | 'checkbox' | 'number' | 'text' | 'color' | 'layout';

	// The label to display next to the control.
	label: string;

	// A description of what this control is for.
	description: string;

	// For 'dropdown' type: a static list of options or a function to dynamically generate them.
	options?: (string | number)[] | ((controller: Controller) => (string | number)[]);

	// A function to determine the display state of the control (visible, disabled, or hidden).
	// If not provided, the control defaults to 'visible'.
	getDisplayState?: (controller: Controller) => ControlDisplayState;

	// A function to read the low-level settings and return the current value for this UI control.
	getValue: (controller: Controller) => string | number | boolean;

	// A function that's called when the UI control's value changes. It's responsible
	// for updating the necessary low-level settings.
	onValueChange: (newValue: any, setOverride: SetOverrideFn<Controller>, controller: Controller) => void;

	// A function that's called when the UI control's value is reset. It's responsible
	onReset: (resetOverride: ResetOverrideFn<Controller>, controller: Controller) => void;
}

// Defines a group of related UI controls that appear together.
export interface AbstractionGroup<Controller> {
	// A title for the group to be displayed in the UI.
	title: string;

	// A description of what this group of settings controls.
	description: string;

	// A map of the controls in this group, where the key is a unique ID for the control.
	controls: AbstractedControl<Controller>[];
}
