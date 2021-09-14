## Installation

```shell
npm install --save @searchspring/snap-client @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger @searchspring/snap-tracker @searchspring/snap-toolbox @searchspring/snap-controller @searchspring/snap-store-mobx
```

```typescript
import { Client } from '@searchspring/snap-client';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { DomTargeter } from '@searchspring/snap-toolbox';
import { SearchController, AutocompleteController, FinderController } from '@searchspring/snap-controller';
import { SearchStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
```
