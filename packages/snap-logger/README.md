# Snap Logger

Snap Logger is available on each controller via `controller.log`. Controller logs are prefixed with the controller's id and it is recommended to use logging methods of the controller in place of `window.console` methods.

```js
controller.log.image({
	url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
	width: '90px',
	height: '30px'
});

controller.log.error('error');

controller.log.warn('warn');

controller.log.imageText({
	url: 'https://searchspring.com/wp-content/themes/SearchSpring-Theme/dist/images/favicons/favicon.svg',
}, 'imageText');

controller.log.debug('debug');

controller.log.dev(`%c ${controller.log.emoji.vortex} %c${controller.log.prefix}%c${'magical text'}`,
`color: ${controller.log.colors.blue}; font-weight: bold; font-size: 10px; line-height: 12px;`,
`color: ${controller.log.colors.bluegreen}; font-weight: normal;`,
`color: ${controller.log.colors.bluegreen}; font-weight: bold;`);
```

## `setMode` method
The default logging mode is `production`. (Set by Snap config)

When set to production, logs using `dev` will not be visible. This also includes `image`, `imageText`, `debug`, and `profile`.

When set to `development`, all logging methods will be visible.


## `error` method
This method takes any number of parameters and logs them to the console. It is best to use this method for error handling.
```js
controller.log.error('error!!!');
controller.log.error('text about the error', errorObject, 'more', 'text');
```

## `warn` method
This method takes any number of parameters and logs them to the console. It is best to use this method for displaying warnings.
```js
controller.log.warn('warning!!!');
controller.log.warn('warning', warningObject, 'more text');
```

## `dev` method
This method takes any number of parameters and logs them to the console. If mode is set to `LogMode.PRODUCTION`, the `dev` logs will not be displayed.

```js
controller.log.dev('dev')
```

## `debug` method
This method takes any number of parameters and logs them to the console. If mode is set to `LogMode.PRODUCTION`, `debug` logs will not be displayed.

```js
controller.log.debug('debug');
```
## `image` method
This method takes any number of parameters and logs them to the console. The first parameter is special and takes properties that specify the image details. If mode is set to `LogMode.PRODUCTION`, `image` logs will not be displayed.

```js
controller.log.image({ 
		url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
		width: '30px', 
		height: '30px'
});
```

## `imageText` method
This method takes any number of parameters and logs them to the console. The first parameter is special and takes properties that specify the image details. If mode is set to `LogMode.PRODUCTION`, `imageText` logs will not be displayed.

```js
controller.log.imageText({
	url: 'https://searchspring.com/wp-content/uploads/2020/01/SearchSpring-Primary-FullColor-800-1-1-640x208.png',
	text: `imageText`,
	style: `color: #4c3ce2; font-weight: bold;`,
});
```

## `profile` method

This method takes any number of parameters and logs them to the console. The first parameter is special and takes a [Snap profile](https://searchspring.github.io/snap/reference-profiler). If mode is set to `LogMode.PRODUCTION`, `profile` logs will not be displayed.
```js
const searchProfile = controller.profiler.create({ 
	type: 'event', 
	name: 'search', 
	context: {} 
});

searchProfile.start();

// code to profile

searchProfile.stop();

controller.log.profile(searchProfile)
```

## `emoji` property
The `emoji` property contains various emojis that can be used

The following emojis are available:

<img src="https://github.com/searchspring/snap/blob/main/images/emojis.png?raw=true" />

```js
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

## `colors` property
The `colors` property contains various colors that can be used

The following colors are available:

<img src="https://github.com/searchspring/snap/blob/main/images/colors.png?raw=true" />

```js
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