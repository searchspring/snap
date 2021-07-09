# AbstractStore

`SearchStore`, `AutocompleteStore`, and `FinderStore` extend `AbstractStore`. Therefore, the following methods and properties are available in all Stores.

## `update` method
Update the store's properties with `data` object that has been retrieved from Searchspring's Search API.

```typescript
const store = new SearchStore();

store.update(data)
```

## `toJSON` method
Converts store to JSON object for easier debugging.

```typescript
console.log(store.toJSON())
```

## `custom` property
This is an empty object that is automatically watched for reactivity. When used with a Snap Controller, the controller event system (middleware) is then used to modify the object.

## `loaded` property
Boolean that is set to `true` once the store has determined that something of importance has loaded (depends on the specific store).

## `loading` property
Boolean that the controller will set to `true` before an API request is made. Value is updated to `false` after an API request has completed.