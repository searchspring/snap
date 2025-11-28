# Snap MobX Store

Management of Snap state using Mobx.

Although `@searchspring/snap-store-mobx` is published as a standalone package, it is not intended to be used directly. Internally it is a dependency of the `@searchspring/snap-preact` package. 

Each controller will have a store as a property. For example, the `SearchController` will have a `store` property that is an instance of the `SearchStore`.

See more information on the available stores below:
- [AbstractStore](https://searchspring.github.io/snap/reference-store-abstract)
- [SearchStore](https://searchspring.github.io/snap/reference-store-search)
- [AutocompleteStore](https://searchspring.github.io/snap/reference-store-autocomplete)
- [RecommendationStore](https://searchspring.github.io/snap/reference-store-recommendation)
- [FinderStore](https://searchspring.github.io/snap/reference-store-finder)
- [StorageStore](https://searchspring.github.io/snap/reference-store-storage)
- [MetaStore](https://searchspring.github.io/snap/reference-store-meta)
- [CartStore](https://searchspring.github.io/snap/reference-store-cart)