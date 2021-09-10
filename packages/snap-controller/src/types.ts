import type { AbstractController } from './Abstract/AbstractController';
import type { EventManager, Middleware, Next } from '@searchspring/snap-event-manager';

import type { Client } from '@searchspring/snap-client';
import type { AbstractStore, ControllerConfig as StoreControllerConfig, Attachments as StoreAttachments } from '@searchspring/snap-store-mobx';
import type { Tracker } from '@searchspring/snap-tracker';
import type { Profiler } from '@searchspring/snap-profiler';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Logger } from '@searchspring/snap-logger';

// Global
declare global {
	interface Window {
		searchspring?: any;
	}
}

// Middleware

export type NextEvent = Next;

export type PluginFunction = (cntrlr: AbstractController, ...args) => Promise<void>;
export type PluginGrouping = [func: PluginFunction, ...args: unknown[]];

export type BeforeSearchObj = {
	controller: AbstractController;
	request: any;
};

export type AfterSearchObj = {
	controller: AbstractController;
	response: any;
};

export type AfterStoreObj = {
	controller: AbstractController;
	request: any;
	response: any;
};

export interface ControllerConfig extends StoreControllerConfig {
	plugins?: PluginGrouping[];
}

export type ControllerServices = {
	client: Client;
	store: AbstractStore;
	urlManager: UrlManager;
	eventManager: EventManager;
	profiler: Profiler;
	logger: Logger;
	tracker: Tracker;
};

export type Attachments = StoreAttachments & {
	plugins?: PluginGrouping[];
};
