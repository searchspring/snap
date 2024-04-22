# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.53.4](https://github.com/searchspring/snap/compare/v0.53.3...v0.53.4) (2024-04-22)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.53.3](https://github.com/searchspring/snap/compare/v0.53.2...v0.53.3) (2024-04-10)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.53.2](https://github.com/searchspring/snap/compare/v0.53.1...v0.53.2) (2024-04-08)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.53.1](https://github.com/searchspring/snap/compare/v0.53.0...v0.53.1) (2024-04-02)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.53.0](https://github.com/searchspring/snap/compare/v0.52.2...v0.53.0) (2024-04-01)

### Bug Fixes

- **controller/recommendation:** fixing issue with types affecting build ([9a2007a](https://github.com/searchspring/snap/commit/9a2007afeca1656c39dbb3447649d98d93355b6b))

## [0.52.2](https://github.com/searchspring/snap/compare/v0.52.1...v0.52.2) (2024-03-18)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.52.1](https://github.com/searchspring/snap/compare/v0.52.0...v0.52.1) (2024-03-08)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.52.0](https://github.com/searchspring/snap/compare/v0.51.2...v0.52.0) (2024-03-06)

### Features

- **preact-components-bundlerecommendations:** new component for upcoming bundlerecs feature ([5547094](https://github.com/searchspring/snap/commit/554709406640e6232e525367f1776fd03979fd44))

## [0.51.2](https://github.com/searchspring/snap/compare/v0.51.1...v0.51.2) (2024-02-12)

### Bug Fixes

- **controller/search:** modifying logic for infinite backfill to optimize cache ([f6fa5d6](https://github.com/searchspring/snap/commit/f6fa5d6e8d74a472906d642f0f36bed82bd87b6f))

## [0.51.1](https://github.com/searchspring/snap/compare/v0.51.0...v0.51.1) (2024-02-09)

### Bug Fixes

- **controller/search:** altering backfill algorithm to use per page value instead of maximum rpp ([fc1bee1](https://github.com/searchspring/snap/commit/fc1bee1887ed2ded9010dfe681b15469759c5d42))

# [0.51.0](https://github.com/searchspring/snap/compare/v0.50.0...v0.51.0) (2024-01-22)

### Bug Fixes

- **controller/autocomplete:** reverting the default setting for redirect on single result from AC ([8cd9a1e](https://github.com/searchspring/snap/commit/8cd9a1ee0894b57addcd3782d8bdb52c869dd8bb))

### Features

- **client/recommend:** adding support for `products` and `blockedItems` parameters ([f71859e](https://github.com/searchspring/snap/commit/f71859e0cc942f58121e3e3e2ea05fb2cc5fcd90))

# [0.50.0](https://github.com/searchspring/snap/compare/v0.49.1...v0.50.0) (2024-01-04)

### Bug Fixes

- **controller/search:** addressing PR feedback to correct potential error ([33b917f](https://github.com/searchspring/snap/commit/33b917f506bfdb16dfcbca33db4c05d12aef4e52))
- **controller/search:** fixing eventListener typo from 'remove' -> 'add' ([c66ae1d](https://github.com/searchspring/snap/commit/c66ae1db0a47bfb89e482d4669ed097f4197a4fb))

### Features

- **controller/search:** adding ability to fire 'restorePosition' event and 'pageshow' setting ([aa3d447](https://github.com/searchspring/snap/commit/aa3d4477c14aa07ae8d4abc5eea11f4c4ee05a71))

## [0.49.1](https://github.com/searchspring/snap/compare/v0.49.0...v0.49.1) (2023-11-03)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.49.0](https://github.com/searchspring/snap/compare/v0.48.0...v0.49.0) (2023-10-19)

### Bug Fixes

- add options.brands to recommendation instantiator context ([afb6c4d](https://github.com/searchspring/snap/commit/afb6c4d19730fc3e120cc3c9e941a3d223373da8))

### Features

- **client-recommend:** adding filtering to recommendations ([d711f7b](https://github.com/searchspring/snap/commit/d711f7b79237132ec89dfc33c18c2fe3242a1503))

# [0.48.0](https://github.com/searchspring/snap/compare/v0.47.0...v0.48.0) (2023-10-11)

### Bug Fixes

- **controller/finder:** altering the beforeFind middleware to ensure redirection is blocked ([936e184](https://github.com/searchspring/snap/commit/936e184ba932fce75b379eeb6e197af0648aac68))

### Features

- add autocomplete settings.redirects.singleResult config ([e620701](https://github.com/searchspring/snap/commit/e620701cb7d528ea4d3fe823bd0104e1bdd73a31))

# [0.47.0](https://github.com/searchspring/snap/compare/v0.46.0...v0.47.0) (2023-09-15)

### Features

- **controller/autocomplete:** changing keyup event to input for better support of copy/paste ([4a95251](https://github.com/searchspring/snap/commit/4a9525117af6bd376da952e0986ccf6efaaad4ce))

# [0.46.0](https://github.com/searchspring/snap/compare/v0.45.1...v0.46.0) (2023-07-24)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.45.1](https://github.com/searchspring/snap/compare/v0.45.0...v0.45.1) (2023-06-22)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.45.0](https://github.com/searchspring/snap/compare/v0.44.3...v0.45.0) (2023-06-01)

### Bug Fixes

- **controller/search:** modifying the restorePosition functionality to support more use cases ([5d6478c](https://github.com/searchspring/snap/commit/5d6478ca9d7647740939da0ac6cda0b940ab7aec))

## [0.44.3](https://github.com/searchspring/snap/compare/v0.44.2...v0.44.3) (2023-05-08)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.44.2](https://github.com/searchspring/snap/compare/v0.44.1...v0.44.2) (2023-05-08)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.44.1](https://github.com/searchspring/snap/compare/v0.44.0...v0.44.1) (2023-05-05)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.44.0](https://github.com/searchspring/snap/compare/v0.43.1...v0.44.0) (2023-05-05)

### Bug Fixes

- **controller-search:** fully escaping CSS selectors in restorePosition and adjusting maxCheck ([0b31fe8](https://github.com/searchspring/snap/commit/0b31fe87ab2634cd13bd6144e29ad6cf570c854b))
- **recommendationinstantiator:** bugfix for improper err logging when rec api call fails ([961ba75](https://github.com/searchspring/snap/commit/961ba75696ff29d77309b3ca7701fe46b664d401))

### Features

- **controller-search:** modifying href selector generation to account for extra spaces and colons ([87bbd8b](https://github.com/searchspring/snap/commit/87bbd8b13720c55dcb551bca14d34873790b7872))
- **searchpaginationstore:** adding configuration for pagination pageSizeOptions ([9937548](https://github.com/searchspring/snap/commit/9937548e24904a825e8d3655890a4d51c3461717))

## [0.43.1](https://github.com/searchspring/snap/compare/v0.43.0...v0.43.1) (2023-04-13)

### Bug Fixes

- **controller-autocomplete:** fixing bugs around autocomplete terms ([a0d6b02](https://github.com/searchspring/snap/commit/a0d6b021073be4b4f3d769d33d8bc55bac2c2f39))

# [0.43.0](https://github.com/searchspring/snap/compare/v0.42.3...v0.43.0) (2023-04-11)

### Bug Fixes

- **autcompletecontroller:** cant call go and preview at the same time ([841db30](https://github.com/searchspring/snap/commit/841db3097c1aeee12ee73e36fcf2628696038fee))

## [0.42.3](https://github.com/searchspring/snap/compare/v0.42.2...v0.42.3) (2023-03-28)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.42.2](https://github.com/searchspring/snap/compare/v0.42.1...v0.42.2) (2023-03-24)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.42.1](https://github.com/searchspring/snap/compare/v0.42.0...v0.42.1) (2023-03-07)

### Bug Fixes

- **controller-autocomplete:** adding input attributes to disable 'autocorrect' and 'autocapitalize' ([eaef3cc](https://github.com/searchspring/snap/commit/eaef3ccadf9bc7c6f2fce5842f76bb541663d7eb))
- **controller-autocomplete:** preventing duplicate hidden form fields from being created ([cfd5e68](https://github.com/searchspring/snap/commit/cfd5e688ed8f2c64f63d368444153d9c7d38c9b0))
- **controller-search:** adjusting generateHrefSelector logic to ensure classList value ([3ed5890](https://github.com/searchspring/snap/commit/3ed58903ad6119a64e72d52d964e956c8aed822e))

# [0.42.0](https://github.com/searchspring/snap/compare/v0.41.2...v0.42.0) (2023-03-03)

### Bug Fixes

- **controller-search:** fixing issue where 'restorePosition' would fire returning to previous search ([86a5ca7](https://github.com/searchspring/snap/commit/86a5ca787788c480d649eef6037e52304d2eee50))

### Features

- **controller-search:** adding 'restorePosition' setting with offset option ([016586c](https://github.com/searchspring/snap/commit/016586ce826908fe8e8c3f34183edab8378390a2))
- **controller-search:** adding `restorePosition` event and refactoring restoration code ([cf57606](https://github.com/searchspring/snap/commit/cf57606322103cdf7d3884127ea272111c8a1644))

## [0.41.2](https://github.com/searchspring/snap/compare/v0.41.1...v0.41.2) (2023-02-20)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.41.1](https://github.com/searchspring/snap/compare/v0.41.0...v0.41.1) (2023-02-18)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.41.0](https://github.com/searchspring/snap/compare/v0.40.0...v0.41.0) (2023-02-17)

### Features

- **recommendationtracking:** components for recommendation beacon tracking profile and results ([9fc8d18](https://github.com/searchspring/snap/commit/9fc8d18a6d0baad6f918bcf4f145b94d507b2617))

# [0.40.0](https://github.com/searchspring/snap/compare/v0.39.3...v0.40.0) (2023-02-01)

### Bug Fixes

- **controller-search:** fixing bug with infinite scroll duplicating results with over 500 backfilled ([3453117](https://github.com/searchspring/snap/commit/345311741b2b548e7fb74f9a9e5f448de89fb67b))
- **searchcontroller:** fix for redirects on single results after clearing filters ([f2f9aee](https://github.com/searchspring/snap/commit/f2f9aee078fad6c5a17b35c81d5a1c905b47b88a))
- **tracker:** adding seed for recommendation beacon events in `profile` and `product` event data ([52e31e3](https://github.com/searchspring/snap/commit/52e31e32bf42cc1ed51941bd99e2a151ff2df4b8))

### Features

- **autocompletehistory:** autocomplete history terms feature ([503790c](https://github.com/searchspring/snap/commit/503790c64181bbed591e77990999fa2b6110f1a1))

## [0.39.3](https://github.com/searchspring/snap/compare/v0.39.2...v0.39.3) (2023-01-31)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.39.2](https://github.com/searchspring/snap/compare/v0.39.1...v0.39.2) (2022-12-29)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.39.1](https://github.com/searchspring/snap/compare/v0.39.0...v0.39.1) (2022-12-27)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.39.0](https://github.com/searchspring/snap/compare/v0.38.1...v0.39.0) (2022-12-14)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.38.1](https://github.com/searchspring/snap/compare/v0.38.0...v0.38.1) (2022-11-16)

### Bug Fixes

- **searchcontroller:** backfill page size bugfix ([17fa02a](https://github.com/searchspring/snap/commit/17fa02a7f43b0d83b8dabf403248688088e2be05))
- **searchcontroller:** pre-fetch meta if backfill is set and we dont have the defaultpagesize ([01f8ff4](https://github.com/searchspring/snap/commit/01f8ff4b7c6f36f6869297ae1df678fc1c3e15b9))

# [0.38.0](https://github.com/searchspring/snap/compare/v0.37.1...v0.38.0) (2022-10-28)

### Features

- **searchfacetstore:** adding a new config param to disable auto facet collapse handling ([697dd9f](https://github.com/searchspring/snap/commit/697dd9f7ae5a93e261380864e083f96b5e2e583e))

## [0.37.1](https://github.com/searchspring/snap/compare/v0.37.0...v0.37.1) (2022-09-30)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.37.0](https://github.com/searchspring/snap/compare/v0.36.0...v0.37.0) (2022-09-26)

### Features

- **spell-correct:** initial commit of integrated spell correct feature (missing some testing) ([b4b265f](https://github.com/searchspring/snap/commit/b4b265f31728ca90bc26048b2ba8d458b5a85660))

# [0.36.0](https://github.com/searchspring/snap/compare/v0.35.0...v0.36.0) (2022-09-19)

### Bug Fixes

- **recommendationcontroller.ts:** recommendations personalization for other siteIds ([c6be636](https://github.com/searchspring/snap/commit/c6be6367dc2e76b9fddfa86bda8040f8eb72e5e1))

# [0.35.0](https://github.com/searchspring/snap/compare/v0.34.7...v0.35.0) (2022-09-01)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.7](https://github.com/searchspring/snap/compare/v0.34.6...v0.34.7) (2022-08-19)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.6](https://github.com/searchspring/snap/compare/v0.34.5...v0.34.6) (2022-08-19)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.5](https://github.com/searchspring/snap/compare/v0.34.4...v0.34.5) (2022-08-19)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.4](https://github.com/searchspring/snap/compare/v0.34.3...v0.34.4) (2022-08-08)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.3](https://github.com/searchspring/snap/compare/v0.34.2...v0.34.3) (2022-08-05)

### Bug Fixes

- **controller-search:** removing scrollRestoration='manual' for better cross browser support ([4f4aab6](https://github.com/searchspring/snap/commit/4f4aab635a882c8c22e83ad59cb5c5d0b1b2cc9d))

## [0.34.2](https://github.com/searchspring/snap/compare/v0.34.1...v0.34.2) (2022-08-04)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.34.1](https://github.com/searchspring/snap/compare/v0.34.0...v0.34.1) (2022-08-04)

### Bug Fixes

- **controllers-search:** combining logic for scroll position storage and restoration ([ec2eb23](https://github.com/searchspring/snap/commit/ec2eb238e98caf0b49bef57c8df56e5e838499b4))

# [0.34.0](https://github.com/searchspring/snap/compare/v0.33.0...v0.34.0) (2022-08-03)

### Features

- **tracker:** preventing error beacon events in development mode and in certain cases ([51049a9](https://github.com/searchspring/snap/commit/51049a958833caea90d81794af677862c8377a37))
- **tracking:** adding sessionId and pageLoadId to search request params ([e380f27](https://github.com/searchspring/snap/commit/e380f2768ac1071b510ea4a24335b2acd96cb8c4))

# [0.33.0](https://github.com/searchspring/snap/compare/v0.32.0...v0.33.0) (2022-07-22)

### Bug Fixes

- **searchcontroller:** use previous response over store.results to not overwrite inline banners ([00cc651](https://github.com/searchspring/snap/commit/00cc651af9434781cb8bcf984a91d344fd572e18))

### Features

- **controller-autocomplete:** adding `serializeForm` setting for picking up additional form params ([3095bb9](https://github.com/searchspring/snap/commit/3095bb939758a97d79457e69741d3a3c1b80458e))
- send beacon error events from middleware errors ([daeba21](https://github.com/searchspring/snap/commit/daeba214facd250505c1bf89ae18588a709244b7))

# [0.32.0](https://github.com/searchspring/snap/compare/v0.31.0...v0.32.0) (2022-07-19)

### Bug Fixes

- remove empty search object from stringyParams key ([439d7ff](https://github.com/searchspring/snap/commit/439d7ffa0fb0c18658b467cf1eaf19e60c671212))

# [0.31.0](https://github.com/searchspring/snap/compare/v0.30.2...v0.31.0) (2022-07-13)

### Features

- add restorePosition to infinite config ([4e822cc](https://github.com/searchspring/snap/commit/4e822cce5e164faddb0f283f345e50b20fcfb9ac))

## [0.30.2](https://github.com/searchspring/snap/compare/v0.30.1...v0.30.2) (2022-07-06)

### Bug Fixes

- fix lastStringyParams logic ([9cab5cb](https://github.com/searchspring/snap/commit/9cab5cbbc16529928ae6f55e80a315ad82bbe04d))
- **searchcontroller:** remove search.redirectResponse and personalization when comparing params ([93b40a2](https://github.com/searchspring/snap/commit/93b40a2f9b0c43fe4aefb6ccb5a9cb9c74b76d9d))

## [0.30.1](https://github.com/searchspring/snap/compare/v0.30.0...v0.30.1) (2022-07-02)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.30.0](https://github.com/searchspring/snap/compare/v0.29.0...v0.30.0) (2022-07-01)

### Features

- **snap:** adding mode switching to snap-preact and controller - removing controller window access ([99a8f21](https://github.com/searchspring/snap/commit/99a8f2176ad803af451e4317e5d98f38303cef1e))

# [0.29.0](https://github.com/searchspring/snap/compare/v0.28.0...v0.29.0) (2022-06-28)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.28.0](https://github.com/searchspring/snap/compare/v0.27.8...v0.28.0) (2022-06-15)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.8](https://github.com/searchspring/snap/compare/v0.27.7...v0.27.8) (2022-06-09)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.7](https://github.com/searchspring/snap/compare/v0.27.6...v0.27.7) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.6](https://github.com/searchspring/snap/compare/v0.27.5...v0.27.6) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.5](https://github.com/searchspring/snap/compare/v0.27.4...v0.27.5) (2022-05-19)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.4](https://github.com/searchspring/snap/compare/v0.27.3...v0.27.4) (2022-05-09)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.3](https://github.com/searchspring/snap/compare/v0.27.2...v0.27.3) (2022-05-09)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.2](https://github.com/searchspring/snap/compare/v0.27.1...v0.27.2) (2022-05-05)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.27.1](https://github.com/searchspring/snap/compare/v0.27.0...v0.27.1) (2022-05-04)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.27.0](https://github.com/searchspring/snap/compare/v0.26.1...v0.27.0) (2022-05-04)

### Bug Fixes

- **autocompletecontroller:** allow queries with spaces to be submitted ([f3c1c61](https://github.com/searchspring/snap/commit/f3c1c6149dbfde9f9fa68d6eb79ceb17561f96c0))
- **recommendationcontroller:** fixing bug which did not allow for instantiator branch param change ([f980cae](https://github.com/searchspring/snap/commit/f980caee18e3625f28b3accfb1dbbe2c18171674))

## [0.26.1](https://github.com/searchspring/snap/compare/v0.26.0...v0.26.1) (2022-04-21)

### Bug Fixes

- **controller-search:** moving param check to after `beforeSearch` event fire ([1a1be22](https://github.com/searchspring/snap/commit/1a1be22abfe788a2497260ed46f304e8592dbccd))

# [0.26.0](https://github.com/searchspring/snap/compare/v0.25.1...v0.26.0) (2022-04-14)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.25.1](https://github.com/searchspring/snap/compare/v0.25.0...v0.25.1) (2022-04-11)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.25.0](https://github.com/searchspring/snap/compare/v0.24.0...v0.25.0) (2022-04-07)

### Bug Fixes

- **findercontroller:** log beforeFind middleware error ([b117c52](https://github.com/searchspring/snap/commit/b117c525026eb612b96483c95c3dd19f7c4eefe1))

### Features

- **controller-finder:** adding persistence configuration and functionality ([eac3ef4](https://github.com/searchspring/snap/commit/eac3ef40fc19c08a4cede96923efe861ffded8d6))
- **wip:** finder persisting ([3a87f9a](https://github.com/searchspring/snap/commit/3a87f9ad73518ad52f2d6b07443226a5a9c1ffd8))

# [0.24.0](https://github.com/searchspring/snap/compare/v0.23.1...v0.24.0) (2022-03-31)

### Features

- **facet-store:** adding `storeRange` option and allowing for per-facet configuration ([b67248d](https://github.com/searchspring/snap/commit/b67248da94ffeb8d75763ba2f1c68c9bd84066fb))

## [0.23.1](https://github.com/searchspring/snap/compare/v0.23.0...v0.23.1) (2022-03-21)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.23.0](https://github.com/searchspring/snap/compare/v0.22.0...v0.23.0) (2022-03-15)

### Bug Fixes

- **autocompletecontroller.ts:** after removing a query, trending terms show & auto select 1st term ([b514da4](https://github.com/searchspring/snap/commit/b514da407b49c5391a6e5268d7d21d4f2b32a23c))

### Features

- **autocomplete-controller:** change the use of `config.action` and utilize UrlManager for URL ([f89c02f](https://github.com/searchspring/snap/commit/f89c02fddfd12bfb9381246f65b107c5958587a5))

# [0.22.0](https://github.com/searchspring/snap/compare/v0.21.1...v0.22.0) (2022-03-09)

### Features

- **autocomplete:** ac showResults config prop for showing trending term results ([7a1d71e](https://github.com/searchspring/snap/commit/7a1d71e2f15c2beff4c9403cb348a017d41f64a3))
- **findercontroller:** adding default parameters to use 'facets.autoDrillDown' by default ([fa2df7e](https://github.com/searchspring/snap/commit/fa2df7e2639abc3d087b399c80f757a6455e9dbe))

## [0.21.1](https://github.com/searchspring/snap/compare/v0.21.0...v0.21.1) (2022-03-01)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.21.0](https://github.com/searchspring/snap/compare/v0.20.5...v0.21.0) (2022-02-25)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.20.5](https://github.com/searchspring/snap/compare/v0.20.4...v0.20.5) (2022-02-25)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.20.4](https://github.com/searchspring/snap/compare/v0.20.3...v0.20.4) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.20.3](https://github.com/searchspring/snap/compare/v0.20.2...v0.20.3) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.20.2](https://github.com/searchspring/snap/compare/v0.20.1...v0.20.2) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.20.1](https://github.com/searchspring/snap/compare/v0.20.0...v0.20.1) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.20.0](https://github.com/searchspring/snap/compare/v0.13.5...v0.20.0) (2022-02-01)

### Bug Fixes

- **controller-finder:** fixing bug with reset and hierarchy types of finders ([cb94ebd](https://github.com/searchspring/snap/commit/cb94ebd42f5481a8108f2d4d1575e5eb679552f8))
- **tracker.ts:** added config for tracker namespace, force all controllers to use same namespace ([6f8bd2f](https://github.com/searchspring/snap/commit/6f8bd2ff6ca04dabff5aa70f363452f0b287fc07))

### Features

- add batched config and context setting to disable batching ([d4c0ac2](https://github.com/searchspring/snap/commit/d4c0ac28d1bd220df0fac948dbb77b4dc5c4504e))
- add realtime config, add cart to context, refactor attribute names ([789dcd3](https://github.com/searchspring/snap/commit/789dcd34cc298340618c3debeb144524d7ff1b66))
- **networkcache:** added memory caching ability to networkcache, removed meta getter, refactoring ([e70744d](https://github.com/searchspring/snap/commit/e70744d4a8749435cff1e0fcc599e5a2d5c30c6c))

## [0.13.5](https://github.com/searchspring/snap/compare/v0.13.4...v0.13.5) (2022-01-31)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.13.4](https://github.com/searchspring/snap/compare/v0.13.3...v0.13.4) (2022-01-31)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.13.3](https://github.com/searchspring/snap/compare/v0.13.2...v0.13.3) (2022-01-07)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.13.2](https://github.com/searchspring/snap/compare/v0.13.1...v0.13.2) (2021-12-29)

### Bug Fixes

- **autocomplete-controller:** when spell correction is used the controller will wait for response ([0d65093](https://github.com/searchspring/snap/commit/0d650935ac0c310595fcb6d8e1843cb703afbd25))

## [0.13.1](https://github.com/searchspring/snap/compare/v0.13.0...v0.13.1) (2021-12-22)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.13.0](https://github.com/searchspring/snap/compare/v0.12.0...v0.13.0) (2021-12-14)

### Bug Fixes

- **searchrequest:** add missing tracking.domain search request param ([45afe2d](https://github.com/searchspring/snap/commit/45afe2d089b0d172290e36854a89998bb607c019))

# [0.12.0](https://github.com/searchspring/snap/compare/v0.11.0...v0.12.0) (2021-11-19)

### Bug Fixes

- **searchcontroller:** search redirect bugfixes when filters are applied ([95c4edb](https://github.com/searchspring/snap/commit/95c4edb2016045d92bfeb84354e34269af05cda8))

# [0.11.0](https://github.com/searchspring/snap/compare/v0.10.0...v0.11.0) (2021-10-29)

### Features

- modify retry delay to fibonacci algo, modify error code handling of request failures ([50613da](https://github.com/searchspring/snap/commit/50613da92db014552f3ff6a529fb742b4559cc02))

# [0.10.0](https://github.com/searchspring/snap/compare/v0.9.7...v0.10.0) (2021-10-15)

### Bug Fixes

- **querystore:** fixing 'rq' and 'oq' bug where they were only using the first letter of value ([2d5faec](https://github.com/searchspring/snap/commit/2d5faecb76dac3b0ad2cda3b557eba902036bcb3))
- remove redundant globals, update docs with link to api docs ([b679a3a](https://github.com/searchspring/snap/commit/b679a3aa53c730a3caf96b22af2ab4badf69d4e4))

### Features

- add personalization params and transforms to search and autocomplete request params ([05c709d](https://github.com/searchspring/snap/commit/05c709dc0d11e145cf3837d76414c0efe0423286))

## [0.9.7](https://github.com/searchspring/snap/compare/v0.9.6...v0.9.7) (2021-10-08)

### Bug Fixes

- **autocomplete-controller:** added a timeout to ensurethe focus event occurs after click event ([1a23f23](https://github.com/searchspring/snap/commit/1a23f23abca4e4fe8bd7b95973fd1abd4c2ff813))
- **autocomplete-controller:** removing console logs ([3c73561](https://github.com/searchspring/snap/commit/3c735616314202c44ca9ebeea3a505c48b095518))

## [0.9.6](https://github.com/searchspring/snap/compare/v0.9.5...v0.9.6) (2021-10-07)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.9.5](https://github.com/searchspring/snap/compare/v0.9.4...v0.9.5) (2021-10-06)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.9.4](https://github.com/searchspring/snap/compare/v0.9.3...v0.9.4) (2021-10-05)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.9.3](https://github.com/searchspring/snap/compare/v0.9.2...v0.9.3) (2021-10-01)

### Bug Fixes

- **dev-cookie:** dev cookie name did not conform to other cookie names 'ssXxx' ([0addc52](https://github.com/searchspring/snap/commit/0addc52b2c72c09a017e573d5685881ebf634e91))
- **recommendation-controller:** removing duplicated config.globals merge on params ([2782025](https://github.com/searchspring/snap/commit/2782025b4f2023bb69bfb8cb28cf244065687b76))

## [0.9.2](https://github.com/searchspring/snap/compare/v0.9.1...v0.9.2) (2021-09-29)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.9.1](https://github.com/searchspring/snap/compare/v0.9.0...v0.9.1) (2021-09-29)

### Bug Fixes

- **recommendation-instantiator:** instantiator template component, add selector and allowing '-' ids ([50b3e34](https://github.com/searchspring/snap/commit/50b3e3441ffb67edf3db281b9e9552c9bb339d10))

# [0.9.0](https://github.com/searchspring/snap/compare/v0.8.0...v0.9.0) (2021-09-28)

### Features

- code splitting work in progress, add finder to demostore ([15c55a9](https://github.com/searchspring/snap/commit/15c55a9a72d9c497b66fc6a2c1744bb318236aa8))

# [0.8.0](https://github.com/searchspring/snap/compare/v0.7.3...v0.8.0) (2021-09-17)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.7.3](https://github.com/searchspring/snap/compare/v0.7.2...v0.7.3) (2021-09-15)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.7.2](https://github.com/searchspring/snap/compare/v0.7.1...v0.7.2) (2021-09-13)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.7.1](https://github.com/searchspring/snap/compare/v0.7.0...v0.7.1) (2021-09-10)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.7.0](https://github.com/searchspring/snap/compare/v0.6.2...v0.7.0) (2021-09-09)

### Bug Fixes

- **search-request:** add siteId to search request params ([af68f5a](https://github.com/searchspring/snap/commit/af68f5a61bd259bf1ee5244573edc55f710462b7))

## [0.6.2](https://github.com/searchspring/snap/compare/v0.6.1...v0.6.2) (2021-09-03)

### Bug Fixes

- **infinite:** fixing inline banner support of infinite scroll in search controller and store ([62dc80b](https://github.com/searchspring/snap/commit/62dc80b0e36a3c65165a41c48035e87f9f211bc8))

## [0.6.1](https://github.com/searchspring/snap/compare/v0.6.0...v0.6.1) (2021-09-02)

### Bug Fixes

- **search-controller:** fixing lastParam not being set all the time ([84476a2](https://github.com/searchspring/snap/commit/84476a246f74e9a7c6ebf45653f196e1a48798b7))

# [0.6.0](https://github.com/searchspring/snap/compare/v0.5.6...v0.6.0) (2021-09-01)

### Bug Fixes

- **controller:** controller package.json was missing toolbox dependency ([82047bc](https://github.com/searchspring/snap/commit/82047bcc697b53191292ffcfbdc3148a93f4f91b))
- moving loading completion to 'afterStore' ([c062dfc](https://github.com/searchspring/snap/commit/c062dfc8288445ffe4a1c6923dcf5b552c963595))
- **search-controller:** preventing search when no params changed since last search ([7f7c606](https://github.com/searchspring/snap/commit/7f7c60610a68941056066da91b46e1f3e28ac22e))

### Features

- **abstract-controller:** adding ability to pass parameters to plugins ([6411ece](https://github.com/searchspring/snap/commit/6411ece8b0f3261a4dc2945d9cb2db3b67809ba8))
- **abstract:** adding id to abstract controller and renaming attachment 'on' -> 'middleware' ([8ff6134](https://github.com/searchspring/snap/commit/8ff613429719ca60d966e752a9c958b463a0a865))
- **autocomplete-controller:** adding 'beforeSubmit' event ([697b474](https://github.com/searchspring/snap/commit/697b474c2bf7cc555fafbb948377d8a9f23dd9b8))
- **autocomplete-controller:** adding escKey event handler and refactoring for tabbing support ([23771a7](https://github.com/searchspring/snap/commit/23771a7f505a166a307efeb8f6f6d6af44c0856b))

## [0.5.6](https://github.com/searchspring/snap/compare/v0.5.5...v0.5.6) (2021-08-31)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.5.5](https://github.com/searchspring/snap/compare/v0.5.4...v0.5.5) (2021-08-25)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.5.4](https://github.com/searchspring/snap/compare/v0.5.3...v0.5.4) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.5.3](https://github.com/searchspring/snap/compare/v0.5.2...v0.5.3) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.5.2](https://github.com/searchspring/snap/compare/v0.5.1...v0.5.2) (2021-08-24)

### Bug Fixes

- **autocomplete-controller:** fixing issue with spell correct input value not using string ([6d62d99](https://github.com/searchspring/snap/commit/6d62d999ae371d8026fed5374915bae40525b3c6))

# [0.5.0](https://github.com/searchspring/snap/compare/v0.4.0...v0.5.0) (2021-08-23)

**Note:** Version bump only for package @searchspring/snap-controller

# [0.4.0](https://github.com/searchspring/snap/compare/v0.3.47...v0.4.0) (2021-08-23)

**Note:** Version bump only for package @searchspring/snap-controller

## [0.3.47](https://github.com/searchspring/snap/compare/v0.3.46...v0.3.47) (2021-08-23)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.46 (2021-08-21)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.45 (2021-08-20)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.44 (2021-08-19)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.43 (2021-08-19)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.42 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.41 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.40 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.39 (2021-08-17)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.38 (2021-08-17)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.37 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.36 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.35 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.34 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.33 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.32 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.31 (2021-08-11)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.30 (2021-08-10)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.29 (2021-08-07)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.28 (2021-08-07)

### Bug Fixes

- **github-pages:** disable jekyll ([8976091](https://github.com/searchspring/snap/commit/8976091670f96f31ac4ba9c980c134ef39b79361))

## 0.3.27 (2021-08-07)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.26 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.25 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.24 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.23 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.22 (2021-08-05)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.21 (2021-08-04)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.20 (2021-08-04)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.19 (2021-08-03)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.18 (2021-08-03)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.17 (2021-07-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.16 (2021-07-28)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.15 (2021-07-28)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.14 (2021-07-27)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.13 (2021-07-27)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.12 (2021-07-23)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.11 (2021-07-21)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.10 (2021-07-21)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.9 (2021-07-20)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.8 (2021-07-17)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.7 (2021-07-16)

### Bug Fixes

- update gh action to include version before publish ([2527f8f](https://github.com/searchspring/snap/commit/2527f8f42dc515e53639c6579c8c743ea3809eb6))

## 0.3.6 (2021-07-02)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.5 (2021-06-21)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.4 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.3 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.2 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.3.1 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap-controller

# 0.3.0 (2021-06-17)

### Features

- **slideout.tsx:** slideout slide direction ([#45](https://github.com/searchspring/snap/issues/45)) ([55b6544](https://github.com/searchspring/snap/commit/55b654489d66c48cea1fe4aa6769c14fcd779a4f))

## 0.2.1 (2021-06-15)

**Note:** Version bump only for package @searchspring/snap-controller

# 0.2.0 (2021-05-20)

### Features

- **domtargeter.ts:** default 'replace' action that replaces target elem ([#40](https://github.com/searchspring/snap/issues/40)) ([82f2435](https://github.com/searchspring/snap/commit/82f24359136cf92e5993f535f35593c344e65095))

## 0.1.14 (2021-05-18)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.13 (2021-05-12)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.12 (2021-05-11)

### Bug Fixes

- **select.tsx:** fixing disableclickoutside bug. Adding an additional… ([#39](https://github.com/searchspring/snap/issues/39)) ([5e51c5e](https://github.com/searchspring/snap/commit/5e51c5ef4eaab24b86f0c363f9c66424ba71cfd1))

## 0.1.11 (2021-05-11)

### Bug Fixes

- **facet.tsx:** disableCollapse prop forces Dropdown to be open ([#37](https://github.com/searchspring/snap/issues/37)) ([d64b48b](https://github.com/searchspring/snap/commit/d64b48bddfe40017e2cf051325037b4743a1e002))

## 0.1.10 (2021-05-07)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.9 (2021-05-06)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.8 (2021-05-05)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.7 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.6 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.5 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.4 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.3 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.1.2 (2021-04-29)

### Bug Fixes

- commit docs ([#29](https://github.com/searchspring/snap/issues/29)) ([dd69d05](https://github.com/searchspring/snap/commit/dd69d0548465672eb58ab720884ce2d8190a0677))

## [0.1.1](https://github.com/searchspring/snap/compare/v0.1.0...v0.1.1) (2021-04-29)

### Bug Fixes

- remove test code ([e005ebd](https://github.com/searchspring/snap/commit/e005ebdf3395acca43469aa4ad8d18842b491f2f))

# 0.1.0 (2021-04-29)

### Bug Fixes

- fix translator configs and hybrid range ([#9](https://github.com/searchspring/snap/issues/9)) ([ac43573](https://github.com/searchspring/snap/commit/ac43573266c63592d6f83ccb08f9860cd59c4cca))

### Reverts

- revert removing version from each package.json ([a0471de](https://github.com/searchspring/snap/commit/a0471dee9794c7044bd0231d645de3a831983a52))

## 0.0.20 (2021-04-28)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.19 (2021-04-28)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.18 (2021-04-27)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.17 (2021-04-26)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.16 (2021-04-23)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.15 (2021-04-23)

### Bug Fixes

- icon gallery hiding controls ([#19](https://github.com/searchspring/snap/issues/19)) ([20a9d24](https://github.com/searchspring/snap/commit/20a9d246408a404fcfe2ca7b27541a8215e60f79))

## 0.0.14 (2021-04-23)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.13 (2021-04-23)

### Bug Fixes

- **husky:** migrate v4 to v6 ([#15](https://github.com/searchspring/snap/issues/15)) ([1d15c8f](https://github.com/searchspring/snap/commit/1d15c8f24467bc91b28039db51c35c02199c0774))

## 0.0.12 (2021-04-22)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.11 (2021-04-21)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.10 (2021-04-15)

### Bug Fixes

- **package-lock:** removing snapp stuff from package-lock... derp ([7a72eae](https://github.com/searchspring/snap/commit/7a72eae82a59e366aec813a7d374508be2165559))

## 0.0.9 (2021-04-08)

**Note:** Version bump only for package @searchspring/snap-controller

## 0.0.8 (2021-04-06)

### Bug Fixes

- case sensitive export path fix when ran on non-mac ([936b91d](https://github.com/searchspring/snap/commit/936b91d2e2c8f8ab872b98b0a52e1788bf52a3e0))

## 0.0.7 (2021-04-06)

**Note:** Version bump only for package @searchspring/snap-controller

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.5 (2021-03-09)

### 0.0.4 (2021-03-09)

### 0.0.3 (2021-03-09)

### Features

- **controllers:** modified abstract controller logging and added environment - also fixed events ([#2](https://github.com/searchspring/snap-controller/issues/2)) ([9443704](https://github.com/searchspring/snap-controller/commit/94437040736ece8da0ead9db296e8813a363fc9d))

### 0.0.2 (2021-03-04)

### Features

- add search controller config for redirects to product page on single result ([#1](https://github.com/searchspring/snap-controller/issues/1)) ([84e10e4](https://github.com/searchspring/snap-controller/commit/84e10e4dc0d10c66cea7fd1e00f985b965907ecf))

### 0.0.1 (2021-03-04)

### Features

- initial commit of merging all snap controllers ([b4adcd1](https://github.com/searchspring/snap-controller/commit/b4adcd10c3dc1874a137964eca8484edfd54836d))
