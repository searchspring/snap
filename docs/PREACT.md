## Snap Preact

The [@searchspring/snap-preact](@searchspring/snap-preact) package is an abstraction layer that provides a config based interface for creating a Searchspring integration quickly. Underneath the hood it utilizes all of the core Snap packages. If you wish to create a Snap integration using core packages individually, see the Advanced section.

If you are not using Snapfu to start with a template, you will need to start by adding Snap to your project.

```bash
npm install --save @searchspring/snap-preact
```

```typescript
import { Snap } from '@searchspring/snap-preact';
```