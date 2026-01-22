# MetaStore

The `MetaStore` contains the response from the Searchspring meta API which includes information about site configuration and feature settings. A `MetaStore` can be found on each root store's `meta` property. These include: 

- [SearchStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Search)
- [AutocompleteStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Autocomplete)
- [RecommendationStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Recommendation)
- [FinderStore](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Finder)


## `data` property
The `data` property contains the raw meta API response


## `badges` property
The badges property contains a reference to `MetaBadges` class

# MetaBadges

The `MetaBadges` class constructs data related to overlay badge layouts used in the `OverlayBadge` component

## `groups` property

The `groups` property is a mapping of overlay groups used by the `OverlayBadge` component to create CSS `grid-template-areas` and `grid-template-columns` values. It ensures that if a custom location mapping contains uneven length of locations in each section, the named grid areas can find a common denomination of sliced areas in the grid template

If you are not utilizing the `OverlayBadge` component to display [Badges](https://searchspring.github.io/snap/snap-badges) and creating a custom container that also utilizes css grid for overlay locations, this property can be used as a helper as it will handle changes to adding additional badge locations

The default locations contain a single 'overlay' group with 1 location in each section

```json
{
    "overlay": {
        "sections": [
            "left",
            "right"
        ],
        "grid": [
            [
                "left",
                "right"
            ]
        ]
    }
}
```

To create the following overlay grid:

```css
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-areas: "left right";
```