## getSessionId
An function for setting and getting session ids to session storage or cookies.

```typescript
import { getSessionId } from '@searchspring/snap-toolbox';
```

## Usage

Calling this function will grab the key out of session storage if it exists and return its value. This function takes a key as the first parameter. If you do not pass a key, it will default to "ssSessionIdNamespace". If the key does not exist in session storage, it will create a new object, save it to storage, and return its value. If the storage feature flag is disabled, the function will use cookies instead. 

```typescript
export const PAGELOADID_STORAGE_NAME = 'ssPageLoadIdNamespace';
getSessionId(PAGELOADID_STORAGE_NAME);
```

## `freshStart` boolean
An additional parameter that can be used is the `freshStart` boolean. When passed to the function, this will skip looking for the key in storage or cookies and create a new randomly generated id to save instead. 

```typescript
export const PAGELOADID_STORAGE_NAME = 'ssPageLoadIdNamespace';
getSessionId(PAGELOADID_STORAGE_NAME, true);
```
