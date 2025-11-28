# AbstractStore

`SearchStore`, `AutocompleteStore`, and `FinderStore` extend `AbstractStore`. Therefore, the following methods and properties are available in all Stores.

## `update` method
Update the store's properties with `data` object that has been retrieved from Searchspring's Search API.

```js
const store = new SearchStore();

store.update(data)
```

## `toJSON` method
Converts store to JSON object for easier debugging.

```js
console.log(store.toJSON())
```

## `custom` property
The `custom` property is an empty object that is not utilized by any core Snap functionality however is available for you to use as a store with data created in [Snap Events](https://github.com/searchspring/snap/tree/main/packages/snap-event-manager). It is suggested to be used for any custom functionality that Snap does not handle natively (ie. keeping track of a list/grid view state)

The `custom` object is an observable property that can be accessed in your components to be rendered, however setting properties directly on the object will not retain its reactivity.

The following example will still have the `view` property available in your components, however will **NOT** yield a component rerender if its data has changed. 

```js
const middleware = (controller) => {
    controller.store.custom.view = {
        value: 'grid',
        toggle: function () {
            if (this.value == 'list') {
                this.value = 'grid';
            } else {
                this.value = 'list';
            }
        },
    };
};
```

In order for properties to be observable, the `custom` object must set directly each time.

```js
const middleware = (controller) => {
    controller.store.custom = {
        view: {
            value: 'grid',
            toggle: function () {
                if (this.value == 'list') {
                    this.value = 'grid';
                } else {
                    this.value = 'list';
                }
            },
        };
    }
};
```

OR defined in advanced:

```js
const middleware = (controller) => {
    controller.store.custom = { view: undefined }
    controller.store.custom.view = {
        value: 'grid',
        toggle: function () {
            if (this.value == 'list') {
                this.value = 'grid';
            } else {
                this.value = 'list';
            }
        },
    }
};
```

If you wish to add additional properties further in your logic, the previous properties can be spread when setting the object.

```js
const middleware = (controller) => {
    controller.store.custom = { ...controller.store.custom, isActive: true }
};
```


## `loaded` property
Boolean that is set to `true` once the store has determined that something of importance has loaded (depends on the specific store).

## `loading` property
Boolean that the controller will set to `true` before an API request is made. Value is updated to `false` after an API request has completed.