# StorageStore
An interface for storing data in the browser session storage, local storage, cookies, or memory

```js
import { StorageStore } from '@searchspring/snap-store-mobx';

const config = {
	type: 'session',
	key: 'ss-storage'
}

const storage = new StorageStore(config)

storage.set('path', 'value')
const sessionData = storage.get() 
console.log(sessionData) // { 'ss-storage': { 'path': 'value' } }

storage.get('path') // 'value'
```

## `config` object
If `config` is not provided, storage will be saved to its internal `state` object

`type` - the type of storage to use: `session`, `local`, or `cookie`

`key` - root level key prefix, default is 'ss-storage'

`cookie` - cookie config object, only required if type is `cookie`

`cookie.expiration` - cookie expiration in ms, default is 31536000000 (1 year)

`cookie.sameSite` - cookie sameSite attribute, allows you to declare if cookies should be restricted to a first-party or same-site context, default is undefined

```js
const config = {
	type: 'cookie',
	key: 'ss-storage',
	cookie: {
		expiration: 31536000000,
		sameSite: '',
	},
}	
```

## `set` method
Accepts a path and value to save to storage

```js
storage.set(`facet.values`, facet.values)
```

## `get` method
Retrieves a value by path from storage

```js
storage.get(`facet.values`)
```

It is also possible to retrieve the entire storage without providing a path:

```js
storage.get()
```

## `clear` method
Clears all data from storage

```js
storage.clear()
```

## `state` property
If a config has not been provided, the StorageStore will manage its `state` object instead of using session storage, local storage, or cookies. 

This `state` object can be accessed directly:

```js
storage.state
```

## `type` property
The type of storage that was provided in the `config.type` property

## `key` property
The key prefix that was provided in the `config.key` property

## `expiration` property
The cookie expiration that was provided in the `config.cookie.expiration` property

## `sameSite` property
The cookie sameSite attribute that was provided in the `config.cookie.sameSite` property

