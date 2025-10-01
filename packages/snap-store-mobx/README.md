# Snap MobX Store

Management of Snap state using Mobx.

Although `@searchspring/snap-store-mobx` is published as a standalone package, it is not intended to be used directly. Internally it is a depdancy of the `@searchspring/snap-preact` package. 

Each controller will have a store as a property. For example, the `SearchController` will have a `store` property that is an instance of the `SearchStore`.
