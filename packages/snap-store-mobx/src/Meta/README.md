# MetaStore

Each root store constructs a MetaStore to hold meta information about a site. 


## `data` property
The `data` property contains the raw meta API response. 


## `badges` property
The badges property contains a reference to `MetaBadges` class.

# MetaBadges

The `MetaBadges` class constructs data related to overlay badge layouts used in the `OverlayBadge` component.

## `groups` property

The `groups` property is a mapping of overlay groups containing data required to create a CSS `grid-template-areas` and `grid-template-columns` values. It ensures that if a custom locations mapping contains uneven length of locations in each section, the named grid areas can find a common denomination of sliced areas in the grid template.

The default locations contain a single 'overlay' group with 1 location in each section.

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