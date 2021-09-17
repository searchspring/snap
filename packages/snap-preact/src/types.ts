import type { Client } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
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

export type RootComponent = React.ElementType<{ controller: AbstractController }>;
