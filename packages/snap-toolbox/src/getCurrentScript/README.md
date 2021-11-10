## Current Script
This utility function gets the current executing script.

```typescript
import { getCurrentScript } from '@searchspring/snap-toolbox';
```

This utilizes `document.currentScript` to retrieve the current executing script. IE11 does not support this, therefore the function will query for the Snap script tag using the default selector `script[src*="snapui.searchspring.io"]`. This selector can be changed by specifying the optional function parameter.

