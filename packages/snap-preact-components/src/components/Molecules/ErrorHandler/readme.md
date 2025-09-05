# ErrorHandler

Renders error messages.

## Sub-components
- Icon
- Button

## Usage
```jsx
import { ErrorHandler } from '@searchspring/snap-preact-components';
```

### controller
The `controller` prop specifies a reference to a Snap controller. This is the standard usage.

```jsx
<ErrorHandler controller={controller} />
```

### error
The `error` prop provides an alternative means of utilizing the component to display errors messages.

```jsx
import { ErrorType } from '@searchspring/snap-store-mobx';
const errorObject = {
	code: 500,
	type: ErrorType.ERROR,
	message: 'Invalid Search Request or Service Unavailable',
}

<ErrorHandler error={errorObject} />
```

### onRetryClick
When a request has been rate limited, a 'warning' error with code `429` will be generated. For this error the component will render a 'retry' button to try the request again. By default the retry button will run the provided controller's `search` method unless the `onRetryClick` prop is provided.

```jsx
<ErrorHandler controller={controller} onRetryClick={(e) => {
    // do something
    controller.search();
}}/>
```

```jsx
import { ErrorType } from '@searchspring/snap-store-mobx';
const errorObject = {
	code: 429,
	type: ErrorType.WARNING,
	message: 'Too many requests try again later',
}

<ErrorHandler error={errorObject} onRetryClick={(e) => {
    // do something
}}/>
```


## ErrorHandle Types

```typescript
import { ErrorType } from '@searchspring/snap-store-mobx';

export enum ErrorType {
	WARNING = 'warning',
	INFO = 'info',
	ERROR = 'error',
}
```