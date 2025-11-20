# Snap Documentation

Snap is not an acronym! Snap is an open source SDK for building e-commerce experiences powered by Searchspring.

The SDK includes multiple core packages published to npm that in combination with each other, provide the complete front-end tooling for building e-commerce experiences with Searchspring. However to simplify usage, the `@searchspring/snap-preact` package is an abstraction that combines all core packages into a single dependency in combination with Preact to render the UI. This documentation is primarily focused on the usage of this package.

## Getting Started

This documentation is organized into two sections: Snap Integration and API Integration. Depending on how you're going to integrate Snap, you'll want to reference the correct section to get started. 

<!-- This documentation is organized into three sections: Snap Integration, Snap Templates Integration, and API Integration.  -->

Additionally, the Reference section contains the most comprehensive and technical material that is common between all integration types and is linked to from other sections.

### Snap Integration

A "Snap Integration" is a project that uses the `Snap` export from the `@searchspring/snap-preact` package to build a storefront integration. It provides the ability to create multiple controllers, custom plugins, and full custom markup to match the storefront markup and inherit styles. It is the most flexible and powerful way to integrate Searchspring into your storefront. 

An example Snap Integration project can be found [here](https://github.com/searchspring-implementations/demo.shopify).

Continue by referencing the [Snap Setup](https://searchspring.github.io/snap/snap-setup) section.

<!-- ### Snap Templates Integration

A "Snap Templates Integration" is a project that uses the `SnapTemplates` export from the `@searchspring/snap-preact` package to build a storefront integration. It is an abstraction of the `Snap` integration that limits the available configuration and does not provide access to the entire project markup. 

Instead, it is based on choosing an optimimzed and prebuilt template and theme while only customizing slight layout changes, theme variables, result card markup, and general style declarations. This integration type allows for a rapid integration of Searchspring to your storefront.  -->

<!-- Continue by referencing the [Snap Templates Integration](https://searchspring.github.io/snap/snap-templates-overview) documentation. -->

### API Integration

An "API Integration" is a project that utilizes the Searchspring APIs directly to integrate into your custom storefront project. Although not required, we recommend using just the `@searchspring/snap-client` package to fetch data from Searchspring APIs. 

Continue by referencing the [API Integration](https://searchspring.github.io/snap/snap-client) section.


## Contributing

Snap is open source! The repository can be found on [Github](https://github.com/searchspring/snap).

We invite your participation through Github issues, discussions and pull requests! 

Please reference Searchspring's [Community Contribution Guidelines](https://github.com/searchspring/community/blob/main/CONTRIBUTING.md) before contributing.
