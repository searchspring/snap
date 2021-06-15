# Snap Tracker

<a href="https://www.npmjs.com/package/@searchspring/snap-tracker"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-tracker.svg?style=flat"></a>

The Snap Tracker service is responsible for sending beacon events. 

---

# Dependencies

Snap Tracker is a dependency of [@searchspring/snap-controller](../snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

<details>
	<summary>Package dependencies hierarchy</summary>
	<br/>
	<img src="../../images/snap-dependencies.jpg"/>
</details>
<br>

# Installation

```bash
npm install --save @searchspring/snap-tracker
```

# Usage
## Import
```typescript
import { Tracker } from '@searchspring/snap-tracker';
```
## Controller usage
Snap Tracker is a dependency of Snap Controller and Tracker events can be invoked via the `tracker` reference of any Snap Controller. 

```typescript
const globals = { siteId: 'abc123' };
const tracker = new Tracker(globals);
const controller = new SearchController(config, {
    ...
    tracker,
    ...
});

console.log(tracker.track.product.click === controller.tracker.track.product.click) // true
console.log(tracker.track.product.click === window.track.product.click) // true
```

## Standalone usage
Snap Tracker can also be used without a Snap Controller. Typically used to send events before an integration has gone live. 

```typescript
const tracker = new Tracker();
const payload = {
    type: BeaconType.CLICK,
    category: BeaconCategory.INTERACTION, 
    event: {
        intellisuggestData: '37d5578e1d1646ac97701a063ba84777',
        intellisuggestSignature: '5739a2596d3b4161b041ce1764ffa04d',
        href: '/product123'
    }
};
window.searchspring.track.event(payload)
```

# Tracker 

## `track` methods
The Tracker contains various tracking methods available on the `track` object. This object is exposed to the browser's `window` via the first Snap Controller that has been instantiated. This will use the `siteId` that has been provided to the Snap Tracker instance of the respective Controller Services.

```typescript
window.searchspring.track
```

Each tracking method expects an object. This object must contain a `data` key and an object containing the tracking data. 

```typescript
window.searchspring.track.product.view({
    data: {
        sku: 'product123',
        childSku: 'product123_a',
    }
})
```

If a bundle is using multiple Snap Controllers with different `siteId`, an optional `siteId` parameter can be specified to overwrite any event `siteId`

```typescript
window.searchspring.track.product.view({
    data: {
        sku: 'product123',
        childSku: 'product123_a',
    },
    siteId: 'abc123'
})
```

### Generic Event `track.event`
Creates and sends a generic beacon event. Parameter expects an Event Payload object. 
If a `type` or `category` is not provided, a value of `'custom'` will be used. 

```typescript
const payload = {
    type: BeaconType.CLICK,
    category: BeaconCategory.INTERACTION, 
    event: {
        intellisuggestData: '37d5578e1d1646ac97701a063ba84777',
        intellisuggestSignature: '5739a2596d3b4161b041ce1764ffa04d',
        href: '/product123'
    }
};
window.searchspring.track.event(payload)
```

#### Event Payload

A beacon event payload object provided to the `track.event` method may contain the following:

`type` -  BeaconType enum value or custom event type value. If not specified, `'custom'` will be used.

`category` - BeaconCategory enum value or custom event type value. If not specified, `'custom'` will be used.

`event` - object containing event data

`context.website.trackingCode` - optional `context` object that will be merged with constructed context object. Can be used to specify a different `siteId` value.

```typescript
const payload = {
    type: BeaconType.CLICK,
    category: BeaconCategory.INTERACTION,
    event: {
        intellisuggestData: '37d5578e1d1646ac97701a063ba84777',
        intellisuggestSignature: '5739a2596d3b4161b041ce1764ffa04d',
        href: '/product123',
    },
    context: {
        website: {
            trackingCode: 'abc123',
        },
    },
};

```

### Product Click `track.product.click`
Tracks product click events. It is reccomended to invoke on each product `onmousedown` event via the `result.track.click()` method - available on each `result` store object. 

```jsx
searchController.store.results.map(result)=>{(
    <a href={core.url} onMouseDown={(e)=>{result.track.click(e)}}>
)}
```

If invoking directly, the `intellisuggestData` and `intellisuggestSignature` values are returned from SearchSpring's Search API on each `result.attributes` object. An optional `href` value can also be provided. 

```typescript
import { SearchController } from '@searchspring/snap-controller';
import { Tracker } from '@searchspring/snap-tracker';
const searchController = new SearchController({
    ...
    tracker: new Tracker(),
    ...
}):

window.searchspring.track.product.click({
    data: {
        intellisuggestData: '37d5578e1d1646ac97701a063ba84777',
        intellisuggestSignature: '5739a2596d3b4161b041ce1764ffa04d',
        href: '/product123',
    }
})
```

### Product View `track.product.view`
Tracks product page views. Should be invoked from a product detail page. A `sku` and/or `childSku` are required.

```typescript
window.searchspring.track.product.view({
    data: {
        sku: 'product123',
        childSku: 'product123_a',
    }
})
```

### Shopper Login `track.shopper.login`
Tracks user login and sets `context.shopperId` value. Should be invoked when a user has logged into their account.

```typescript
const shopperId = "123456"
window.searchspring.track.shopper.login({
    data: {
        id: shopperId
    }
})
```

### Cart View `track.cart.view`
Tracks cart contents. Should be invoked from a cart page. Each item object must contain a `qty`, `price`, (`sku` and/or `childSku`)

```typescript
window.searchspring.track.cart.view({
    data: {
        items: [
            {
                sku: 'product123',
                childSku: 'product123_a',
                qty: '1',
                priice: `9.99`,
            },
            {
                sku: 'product456',
                childSku: 'product456_a',
                qty: '2',
                priice: `10.99`,
            },
        ]
    }
})
```

### Order Transaction `track.order.transaction`
Tracks order transaction. Should be invoked from an order confirmation page. Expects an object with the following:

`orderId` - (optional) order id

`total` - (optional) sub total of all items

`city` - (optional) city name

`state` - (optional) 2 digit state abbreviation (US only)

`country` - (optional) 2 digit country abbreviation	(ie. 'US', 'CA', 'MX', 'PL', 'JP')

`items` - required array of items - same object provided to `track.cart.view` event

```typescript
window.searchspring.track.order.transaction({
    data: {
        orderId: '123456',
        total: '31.97',
        city: 'Los Angeles',
        state: 'CA',
        country: 'US',
        items: [
            {
                sku: 'product123',
                childSku: 'product123_a',
                qty: '1',
                priice: `9.99`
            },
            {
                sku: 'product456',
                childSku: 'product456_a',
                qty: '2',
                priice: `10.99`
            },
        ]
    }
})
```

## Tracker properties

### `globals` property
When constructing an instance of `Tracker`, a globals object is required to be constructed. This object contains a `siteId` key and value. 

```typescript
const globals = { siteId: 'abc123' };
const tracker = new Tracker(globals);
console.log(tracker.globals === globals) // true
```

### `localStorage` property
A reference to the StorageStore object for accessing local storage

```typescript
const tracker = new Tracker();
tracker.localStorage.set('key', 'value')
tracker.localStorage.get('key') // 'value'
```

### `sessionStorage` property
A reference to the StorageStore object for accessing session storage

```typescript
const tracker = new Tracker();
tracker.sessionStorage.set('key', 'value')
tracker.sessionStorage.get('key') // 'value'
```

### `context` property
The `context` property is generated at the time of instantiating Tracker. It is part of each event payload and provides context of the event.

`userId` - unique ID to identify the user, persisted in a cookie/local storage fallback

`pageLoadId` - unique ID generated at the time of instantiating Tracker

`sessionId` - unique ID generated at the start of a new browser session, persisted in session storage/cookie fallback

`shopperId` - unique ID provided set via the SearchController `SearchController.tracker.track.shopper.login` event and then persisted in a cookie

`website.trackingCode` - the `siteId` specified in the globals object

```typescript
context: {
    userId: '0560d7e7-148a-4b1d-b12c-924f164d3d00',
    pageLoadId: 'cfb75606-c15b-4f25-a711-9de2c5d22660',
    sessionId: 'f4b25c96-9ca1-4ac6-ad04-f5ce933f8b61',
    shopperId: 'shopper0001',
    website: {
        trackingCode: 'abc123',
    },
}
```

### `isSending` property
The `isSending` property contains the return value from `setTimeout` and when defined, signifys that an event is being sent to the beacon endpoint. If subsequent events are invoked and `isSending` is still defined, the incoming event will be added to the event queue. 

### `namespace` property
The `namespace` property contains the Tracker namespace. Invoking this method is only required if a bundle contains multiple Tracker instances. 

### `track` property
The `track` property contains various tracking events. See `track` methods section above. 

### `getUserId` method
Returns an object containing the `userId` stored in the `ssUserId` cookie (with a fallback to localstorage.) If key doesn't exist, a new ID will be generated, saved to cookie/localstorage, and returned. 

```typescript
const tracker = new Tracker();

console.log(tracker.getUserId()) 
// { userId: '0560d7e7-148a-4b1d-b12c-924f164d3d00' }
```

### `getSessionId` method
Returns an object containing the `sessionId` stored in the `ssSessionIdNamespace` session storage (with a fallback to cookies.) If key doesn't exist, a new ID will be generated, saved to session storage/cookie, and returned. 

```typescript
const tracker = new Tracker();

console.log(tracker.getSessionId()) 
// { sessionId: 'f4b25c96-9ca1-4ac6-ad04-f5ce933f8b61' }
```

### `getShopperId` method
Returns an object containing the `shopperId` stored in the `ssShopperId` cookie. This value is set via the SearchController `SearchController.tracker.track.shopper.login` event

```typescript
const tracker = new Tracker();

console.log(tracker.getShopperId()) 
// { shopperId: 'shopper0001' }
```


### `sendEvents` method
Sends event(s) to beacon (and various legacy) endpoint(s). 

```typescript
const tracker = new Tracker();
const event1 = new BeaconEvent();
const event2 = new BeaconEvent();
tracker.sendEvents([event1, event2])
```

