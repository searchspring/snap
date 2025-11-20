# Cookies
An interface for setting and getting cookies.

```typescript
import { cookies } from '@searchspring/snap-toolbox';
```

## `set` function
Set a cookie.

```typescript
const name = 'myCookie';
const value = 'Hello World!!';
const sameSite = 'Lax';
const expires = 31536000000; // 1 year
const cookieDomain = '.' + window.location.hostname.replace(/^www\./, '');

cookies.set(name, value, sameSite, expires, cookieDomain)
```

## `get` function
Get a cookie.

```typescript
const name = 'myCookie';

cookies.get(name)
```

## `unset` function
Remove a cookie.

```typescript
const name = 'myCookie';

cookies.unset(name)
```
