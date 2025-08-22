# Getting Started

First let's figure out how you're going to use Snap.

## Snap Integration

A "Snap Integration" is a project that uses the `Snap` export from the `@searchspring/snap-preact` package to build a storefront integration. It provides the ability to create multiple controllers, custom plugins, and full custom markup to match the storefront markup and inherit styles. It is the most flexible and powerful way to integrate Athos Commerce into your storefront. 

Continue by referencing the [Snap Integration](./SNAP_INTEGRATION.md) section.

<!-- ## Snap Templates Integration

A "Snap Templates Integration" is a project that uses the `SnapTemplates` export from the `@searchspring/snap-preact` package to build a storefront integration. It is an abstraction of the `Snap` integration that limits the available configuration and does not provide access to the entire project markup. 

Instead, it is based on choosing an optimimzed and prebuilt template and theme while only customizing slight layout changes, theme variables, result card markup, and general style declarations. This integration type allows for a rapid integration of Athos Commerce to your storefront.  -->

<!-- Continue by referencing the [Snap Templates Integration](./SNAP_TEMPLATES_INTEGRATION.md) documentation. -->

## API Integration

An "API Integration" is a project that utilizes Athos Commerce's APIs directly to integrate into your custom storefront project. Although not required, we recommend using just the `@searchspring/snap-client` package to fetch data from Athos Commerce's APIs. 

Continue by referencing the [Snap Client](./SNAP_CLIENT.md) documentation.
