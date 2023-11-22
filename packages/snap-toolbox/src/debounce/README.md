## Debounce
A function used to delay frequent inputs

```typescript
import { debounce } from '@searchspring/snap-toolbox';
```

## `debounce` function
Example: debounce the window resize event.

```typescript
const debouncedHandleResize = debounce(() => {
    console.log("do something")
}, 50);

window.addEventListener('resize', debouncedHandleResize);
```
