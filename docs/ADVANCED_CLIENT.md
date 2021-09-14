## Snap Client
Next, let's define Snap Client as it is required for all Snap controller instances. Typically the Client is shared across all Snap controllers.

```typescript
const client = new Client(globals);
```

The Snap Client requires `ClientGlobals` for instantiation.

### Global Config
The `ClientGlobals` object can be used to set client search parameters that will apply to all requests made with the client (and subsequently any controllers using the client as a service). Typically only the `siteId` will be set here, but could be used for setting globally utilized background filters and/or sorts as well.

You can find your Searchspring `siteId` in the [Searchspring Management Console](https://manage.searchspring.net) and define it directly:

```typescript
const globals = {
	siteId: 'a1b2c3',
};
```
