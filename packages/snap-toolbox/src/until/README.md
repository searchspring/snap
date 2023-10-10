## until
This utility function resolves the provided parameter when it becomes truthy.

The function takes a single required parameter containing any function, object, or primative you are awaiting to resolve. 

Typical usage may include waiting for a third party function to become available.

```typescript
import { until } from '@searchspring/snap-toolbox';
const result = await until(window.thirdPartyFn);
```

## options

### checkMax
Maximum number of checks to poll for. Default: `20`

```typescript
const result = await until(window.thirdPartyFn, { checkMax: 20 });
```

### checkCount
Starting count of poll counter. Default: `0`

```typescript
const result = await until(window.thirdPartyFn, { checkCount: 0 });
```

### checkTime
Polling interval in milliseconds. Default: `50` (ms)

```typescript
const result = await until(window.thirdPartyFn, { checkTime: 50 });
```

### exponential
Polling interval multiplier to exponentially increase each interval. Default: `1.1`

```typescript
const result = await until(window.thirdPartyFn, { exponential: 1.1 });
```

### defer
By default, if the provided function parameter is already available it will immediately return. To defer this until after the first iteration of polling, set `defer: true`

```typescript
const result = await until(window.thirdPartyFn, { defer: true });
```

### executeFunction
By default, if the provided function parameter is a function it will be invoked without any function parameters before its return value is resolved. To instead return a reference to the function, set `executeFunction: false`

```typescript
const thirdPartyFn = await until(window.thirdPartyFn, { executeFunction: false });
thirdPartyFn();
```
