## Snap Usage

This guide covers how you can quickly get started using Snap.

If you have used Snapfu to create your project, you will not need to include the following installation step.

## Installation & Imports
If you are integrating Snap into an exisiting project, start by installing some Snap dependencies:

```shell
npm install --save @searchspring/snap-client-javascript @searchspring/snap-url-manager @searchspring/snap-event-manager @searchspring/snap-profiler @searchspring/snap-logger @searchspring/snap-toolbox @searchspring/snap-controller @searchspring/snap-store-mobx
```

```typescript
import { Client } from '@searchspring/snap-client-javascript';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { DomTargeter } from '@searchspring/snap-toolbox';
import { SearchController, AutocompleteController, FinderController } from '@searchspring/snap-controller';
import { SearchStore, AutocompleteStore, FinderStore } from '@searchspring/snap-store-mobx';
```

