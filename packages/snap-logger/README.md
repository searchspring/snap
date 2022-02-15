# Snap Logger

<a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a>

Simple logger for debugging

<img src="https://github.com/searchspring/snap/blob/main/images/logger-example.png?raw=true" />
<br/><br/>
<details>
	<summary>Sample code</summary>
	<br/>

```typescript
logger.image({
	url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
	width: '90px',
	height: '30px'
});

logger.error('error');

logger.warn('warn');

logger.imageText({
	url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
}, 'imageText');

logger.debug('debug');

logger.dev(`%c ${logger.emoji.vortex} %c${logger.prefix}%c${'magical text'}`,
`color: ${logger.colors.blue}; font-weight: bold; font-size: 10px; line-height: 12px;`,
`color: ${logger.colors.bluegreen}; font-weight: normal;`,
`color: ${logger.colors.bluegreen}; font-weight: bold;`);
```
</details>




## Dependency

Snap Logger is a dependency of [@searchspring/snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

## Installation

```bash
npm install --save @searchspring/snap-logger
```



## Import
```typescript
import { Logger } from '@searchspring/snap-logger';
```

## Config
Snap Logger accepts an optional string prefix which when set is prepended to all logs.

```typescript
const prefix = 'Log:';
const logger = new Logger(prefix)
```

## Controller usage
Snap Logger is a dependency of Snap Controller and it is recommended to use logging methods of the controller in place of `console` methods.


## Standalone usage
```typescript
const logger = new Logger();

logger.warn('this is a warning');
```

### `setNamespace` method
Sets prefix instead of defining a prefix in the constructor.
```typescript
const logger = new Logger();

logger.warn('Hello');
// 'Hello'

logger.setNamespace('search');

logger.warn('Hello');
// ' [search] :: Hello'
```

### `setMode` method
The default logging mode is `production`. 

When set to production, logs using `dev` will not be visible. This also includes `image`, `imageText`, `debug`, and `profile`.

When set to `development`, all logging methods will be visible.



```typescript
import { Logger, LogMode } from '@searchspring/snap-logger';

const logger = new Logger();
logger.setMode(LogMode.DEVELOPMENT);
```

```typescript
enum LogMode {
	PRODUCTION = 'production',
	DEVELOPMENT = 'development',
}
```

### `error` method
This method takes any number of parameters and logs them to the console. It is best to use this method for error handling.
```typescript
logger.error('error!!!');
logger.error('text about the error', errorObject, 'more', 'text');
```

### `warn` method
This method takes any number of parameters and logs them to the console. It is best to use this method for displaying warnings.
```typescript
logger.warn('warning!!!');
logger.warn('warning', warningObject, 'more text');
```

### `dev` method
This method takes any number of parameters and logs them to the console. If mode is set to `LogMode.PRODUCTION`, the `dev` logs will not be displayed.

```typescript
logger.dev('dev')
```

### `debug` method
This method takes any number of parameters and logs them to the console. If mode is set to `LogMode.PRODUCTION`, `debug` logs will not be displayed.

```typescript
logger.debug('debug');
```
### `image` method
This method takes any number of parameters and logs them to the console. The first parameter is special and takes properties that specify the image details. If mode is set to `LogMode.PRODUCTION`, `image` logs will not be displayed.

```typescript
logger.image({ 
		url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
		width: '30px', 
		height: '30px'
});
```

### `imageText` method
This method takes any number of parameters and logs them to the console. The first parameter is special and takes properties that specify the image details. If mode is set to `LogMode.PRODUCTION`, `imageText` logs will not be displayed.

```typescript
logger.imageText({
	url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
	text: `imageText`,
	style: `color: #4c3ce2; font-weight: bold;`,
});
```

### `profile` method
This method takes any number of parameters and logs them to the console. The first parameter is special and takes a Snap profile. If mode is set to `LogMode.PRODUCTION`, `profile` logs will not be displayed.

See [@searchspring/snap-profiler](https://github.com/searchspring/snap/tree/main/packages/snap-profiler) <a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a>

```typescript
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

const logger = new Logger();
const profiler = new Profiler();

const searchProfile = profiler.create({ 
	type: 'event', 
	name: 'search', 
	context: {} 
});

searchProfile.start();

// code to profile

searchProfile.stop();

logger.profile(searchProfile)
```

### `emoji` property
The `emoji` property contains various emojis that can be used

The following emojis are available:

<img src="https://github.com/searchspring/snap/blob/main/images/emojis.png?raw=true" />

```typescript
const emoji = {
	bang: String.fromCodePoint(0x203c),
	bright: String.fromCodePoint(0x1f506),
	check: String.fromCodePoint(0x2714),
	clock: String.fromCodePoint(0x1f556),
	cloud: String.fromCodePoint(0x2601),
	dim: String.fromCodePoint(0x1f505),
	gear: String.fromCodePoint(0x2699),
	interobang: String.fromCodePoint(0x2049),
	lightning: String.fromCodePoint(0x26a1),
	magic: String.fromCodePoint(0x2728),
	rocket: String.fromCodePoint(0x1f680),
	search: String.fromCodePoint(0x1f50d),
	snap: String.fromCodePoint(0x1f4a5),
	ufo: String.fromCodePoint(0x1f6f8),
	vortex: String.fromCodePoint(0x1f300),
	warning: String.fromCodePoint(0x26a0),
};
```

### `colors` property
The `colors` property contains various colors that can be used

The following colors are available:

<img src="https://github.com/searchspring/snap/blob/main/images/colors.png?raw=true" />

```typescript
const colors = {
	blue: '#3379c1',
	bluelight: '#688BA3',
	bluedark: '#1B3141',
	bluegreen: '#318495',

	grey: '#61717B',

	green: '#507B43',
	greendark: '#63715F',
	greenblue: '#46927D',

	indigo: '#4c3ce2',

	orange: '#ecaa15',
	orangelight: '#ff6600',
	orangedark: '#c59600',

	red: '#cc1212',
	redlight: '#f30707',
	reddark: '#8E111C',

	yellow: '#d1d432',
};
```