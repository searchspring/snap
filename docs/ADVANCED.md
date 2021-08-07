## Advanced Snap Usage

This advanced guide covers how you can create a Snap integration using core packages. The [@searchspring/snap-preact](@searchspring/snap-preact) package is an abstraction layer that creates a Snap integration by using config based interface. Underneath the hood it utilizes all of the core Snap packages that we will be using here.

If you are not using Snapfu to start with a template, you will need to start by adding all the core Snap packages to your project.

## Installation & Imports

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
