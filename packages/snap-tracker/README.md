# Snap Tracker

<a href="https://www.npmjs.com/package/@searchspring/snap-tracker"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-tracker.svg?style=flat"></a>

The Snap Tracker service is responsible for sending beacon events. Its class directly extends the [beacon.js](https://github.com/searchspring/beacon.js) `Beacon` class, therefore all methods and properties of the Beacon class are available on the Tracker class and are not documented below. 

## Dependencies

Snap Tracker is a dependency of [@searchspring/snap-controller](https://github.com/searchspring/snap/tree/main/packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

## Installation

```bash
npm install --save @searchspring/snap-tracker
```

## Import
```typescript
import { Tracker } from '@searchspring/snap-tracker';
```

## Tracker Config

| option | description | default value | required | 
|---|---|:---:|:---:|
| id | unique identifier for the tracker | track |   |
| framework | unique identifier for the framework utilizing the tracker | snap |   |
| mode | application mode (production, development) | production |   |
| doNotTrack | array of TrackerEvents, used to block specific types of tracking | ➖ |   |
| initiator | unique identifier for the beacon | beaconjs/{version} |   |
| apis | configure various api options |  |   |
| apis.fetch | FetchAPI reference to use | window.fetch |   |
| requesters.personalization.origin | alternative endpoint for personalization preflight api | https://{siteId}.a.searchspring.io |   |
| requesters.beacon.origin | alternative endpoint for beacon api | https://beacon.searchspring.io/beacon/v2 |   |
| href | set href | window.location.href |   |
| userAgent | set userAgent | navigator.userAgent |   |


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
console.log(tracker.track.product.click === window.searchspring.tracker.track.product.click) // true
```

## Snap Integration Usage
See [Integration Tracking](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION_TRACKING.md) for how and where to implement tracking events.


## `events` methods
See [beacon.js Tracking Events](https://github.com/searchspring/beacon.js) for a list of available events.

