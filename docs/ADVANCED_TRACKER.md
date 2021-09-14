## Snap Tracker
The Snap Tracker, like the Client, is required for all Snap controller instances and is shared across all Snap controllers.

```typescript
const tracker = new Tracker(globals);
```

The Snap Tracker requires `TrackerGlobals` for instantiation.

### Global Config
The `globals` object requires only a `siteId`.

You can find your Searchspring `siteId` in the [Searchspring Management Console](https://manage.searchspring.net) and define it directly:

```typescript
const globals = {
	siteId: 'a1b2c3',
};
```