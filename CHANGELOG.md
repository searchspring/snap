# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.28.0](https://github.com/searchspring/snap/compare/v0.27.8...v0.28.0) (2022-06-15)


### Bug Fixes

* **autocomplete.tsx:** checking input state to determine visible bool ([1fad14e](https://github.com/searchspring/snap/commit/1fad14e938fb43da77170ccbc0c5e7a0e5657026))
* **client:** fixing deferred resolve ordering when using `options.order` ([d74df0a](https://github.com/searchspring/snap/commit/d74df0a09b51095887460bdf934cce33afa1a3d7))
* load branch override script after branch override component renders ([e8884a9](https://github.com/searchspring/snap/commit/e8884a9f1a10e1a20cdfd86be679eebb27d5efa4))
* **preact-components:** dereferencing breakpoints to prevent multiple carousels from sharing values ([2de6945](https://github.com/searchspring/snap/commit/2de6945e8761b735d038e38bd79a0955ef3d5065))
* remove failing test, assume window.searchspring ([be18438](https://github.com/searchspring/snap/commit/be18438cd64dd1a17aff0f2a16d531c648afc728))


### Features

* **facet:** add searchable prop to facet; Add searchinput component ([b055c32](https://github.com/searchspring/snap/commit/b055c32f91053b241c87a5ffd52fb5138655e0ea))





## [0.27.8](https://github.com/searchspring/snap/compare/v0.27.7...v0.27.8) (2022-06-09)


### Bug Fixes

* **client:** deleting the batch as soon as it begins execution so that new requests don't attach ([35ebeb5](https://github.com/searchspring/snap/commit/35ebeb535e2aba6d4f0bd8cb71e2b5473b2a9dd9))





## [0.27.7](https://github.com/searchspring/snap/compare/v0.27.6...v0.27.7) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap





## [0.27.6](https://github.com/searchspring/snap/compare/v0.27.5...v0.27.6) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap





## [0.27.5](https://github.com/searchspring/snap/compare/v0.27.4...v0.27.5) (2022-05-19)


### Bug Fixes

* **urltranslator:** fixing a bug in the core type that did not allow for proper configuration ([0162342](https://github.com/searchspring/snap/commit/016234246fa19bec4664725346999501008b4571))





## [0.27.4](https://github.com/searchspring/snap/compare/v0.27.3...v0.27.4) (2022-05-09)

**Note:** Version bump only for package @searchspring/snap





## [0.27.3](https://github.com/searchspring/snap/compare/v0.27.2...v0.27.3) (2022-05-09)


### Bug Fixes

* **recommend.ts:** bugfix for batchRecommendations function duplicating params ([f13640c](https://github.com/searchspring/snap/commit/f13640c456d378d30b33843dab66d12611137f6c))





## [0.27.2](https://github.com/searchspring/snap/compare/v0.27.1...v0.27.2) (2022-05-05)


### Bug Fixes

* **searchrequest:** allow queries with leading and trailing spaces ([3cac19d](https://github.com/searchspring/snap/commit/3cac19d8667ff6b1126be6676d10eb4e648c7572))





## [0.27.1](https://github.com/searchspring/snap/compare/v0.27.0...v0.27.1) (2022-05-04)

**Note:** Version bump only for package @searchspring/snap





# [0.27.0](https://github.com/searchspring/snap/compare/v0.26.1...v0.27.0) (2022-05-04)


### Bug Fixes

* **autocompletecontroller:** allow queries with spaces to be submitted ([f3c1c61](https://github.com/searchspring/snap/commit/f3c1c6149dbfde9f9fa68d6eb79ceb17561f96c0))
* **component-branchoverride:** correcting documentation and ensuring 'error' prop takes priority ([1885eb1](https://github.com/searchspring/snap/commit/1885eb19dace0741a68fd07067819aa565a92cd8))
* **recommendationcontroller:** fixing bug which did not allow for instantiator branch param change ([f980cae](https://github.com/searchspring/snap/commit/f980caee18e3625f28b3accfb1dbbe2c18171674))
* **recommendationinstantiator:** changing controller naming structure -  object name to 'controller' ([5a373b9](https://github.com/searchspring/snap/commit/5a373b9975cf0d5a7f6d8a9a2b3f6eda930ec21c))
* **recommendationinstantiator:** remove fallback url when creating recs controller ([533785a](https://github.com/searchspring/snap/commit/533785a63924a6266ff2470414242ac0244c64a8))
* **snap-preact:** changing instantiator name to 'recommendation' from 'recommendations' ([1e48228](https://github.com/searchspring/snap/commit/1e48228560e84df7f0515b0f103bcc07eb1ddc99))
* **snap-preact:** move controller import outside of conditional ([340b1f4](https://github.com/searchspring/snap/commit/340b1f4fd4db15e5d1f6c4d6971dc6fe67dce918))


### Features

* **instantiator-recommendation:** param plugin support, services included or passed in constructor ([4baee3c](https://github.com/searchspring/snap/commit/4baee3cb44bdd3900d73d156f7788212f6377d89))
* **snap-preact:** added services as constructor param, async onTarget and heavily refactored ([b1cd990](https://github.com/searchspring/snap/commit/b1cd99061de3176a3554c0f523098a17a0efdc4a))





## [0.26.1](https://github.com/searchspring/snap/compare/v0.26.0...v0.26.1) (2022-04-21)


### Bug Fixes

* **controller-search:** moving param check to after `beforeSearch` event fire ([1a1be22](https://github.com/searchspring/snap/commit/1a1be22abfe788a2497260ed46f304e8592dbccd))





# [0.26.0](https://github.com/searchspring/snap/compare/v0.25.1...v0.26.0) (2022-04-14)


### Bug Fixes

* add parent traversal for attribute tracking, refactor instantiator services ([dc61f52](https://github.com/searchspring/snap/commit/dc61f5212185b814ba5f8f02840a79d7831062e7))
* convert tickSize to number ([7471841](https://github.com/searchspring/snap/commit/7471841a9f35bb609046f0f96a7f8d03c65f342c))
* **facetslider:** prevent chrome from crashing when tickSize <= 0 ([dfecb49](https://github.com/searchspring/snap/commit/dfecb495c99fe0e4e381b1e2d8ec70d526b6b94f))
* **tracker:** add href attribute to attributeList ([1fec898](https://github.com/searchspring/snap/commit/1fec8986843afbddbd466c91191176924114fd11))


### Features

* **recommendationinstantiator:** add cart param to recs context ([9b3d633](https://github.com/searchspring/snap/commit/9b3d633325020187c1472024ca33b8620ba16ab4))
* **snap.tsx:** adding siteId override for branch switch query param ([58b5b56](https://github.com/searchspring/snap/commit/58b5b5616425f1ee01fed5990309961330f2eb81))





## [0.25.1](https://github.com/searchspring/snap/compare/v0.25.0...v0.25.1) (2022-04-11)


### Bug Fixes

* **recommend.ts:** bugfix for batched recommendations not spreading all params ([7b59ad8](https://github.com/searchspring/snap/commit/7b59ad85c0a7b5721e66e76c4dac4f981c50507f))





# [0.25.0](https://github.com/searchspring/snap/compare/v0.24.0...v0.25.0) (2022-04-07)


### Bug Fixes

* **facetslider.stories.tsx:** adding default value for ticksize prop in facetSlider component story ([dfa2590](https://github.com/searchspring/snap/commit/dfa2590ed8c6fe1934f222c4ca14c26fd2543f33))
* **findercontroller:** log beforeFind middleware error ([b117c52](https://github.com/searchspring/snap/commit/b117c525026eb612b96483c95c3dd19f7c4eefe1))


### Features

* add matchType to QueryStore and supporting client transform ([2f01e81](https://github.com/searchspring/snap/commit/2f01e81c0fdf9a1f6cef7203f07d536ae91c8412))
* **controller-finder:** adding persistence configuration and functionality ([eac3ef4](https://github.com/searchspring/snap/commit/eac3ef40fc19c08a4cede96923efe861ffded8d6))
* **wip:** finder persisting ([3a87f9a](https://github.com/searchspring/snap/commit/3a87f9ad73518ad52f2d6b07443226a5a9c1ffd8))





# [0.24.0](https://github.com/searchspring/snap/compare/v0.23.1...v0.24.0) (2022-03-31)


### Bug Fixes

* **errorhandler.tsx:** bugfix for theme spreading in errorhandler component ([f610a23](https://github.com/searchspring/snap/commit/f610a2356c0f416a82cc6cd0e95e49e6e89d46e3))
* **facet-store:** fixing logic around individual facet settings ([663806d](https://github.com/searchspring/snap/commit/663806d2e5bcb075fd7df57ad5cf5d1529c6cbcf))
* **recommendation:** ensure children length matches results or controller.store.results, update docs ([2a957b8](https://github.com/searchspring/snap/commit/2a957b858d68c9c6862327bdaaf2b1213609a0bc))


### Features

* **facet-store:** adding `storeRange` option and allowing for per-facet configuration ([b67248d](https://github.com/searchspring/snap/commit/b67248da94ffeb8d75763ba2f1c68c9bd84066fb))
* **facet-store:** adding `storeRange` option and allowing for per-facet configuration ([f885286](https://github.com/searchspring/snap/commit/f885286db82844fb03bfed0cea4d5ffed63addfe))
* **recommendations:** add results prop to recommendations component, allows for slicing results ([08b438b](https://github.com/searchspring/snap/commit/08b438b25685a563419919991efeea7f87a21629))





## [0.23.1](https://github.com/searchspring/snap/compare/v0.23.0...v0.23.1) (2022-03-21)


### Bug Fixes

* **event-manager:** making the context optional, adding some types to functions and enhancing remove ([0373bfb](https://github.com/searchspring/snap/commit/0373bfb79d43a565e66170eee9d24a38fef667f6))





# [0.23.0](https://github.com/searchspring/snap/compare/v0.22.0...v0.23.0) (2022-03-15)


### Bug Fixes

* **autocompletecontroller.ts:** after removing a query, trending terms show & auto select 1st term ([b514da4](https://github.com/searchspring/snap/commit/b514da407b49c5391a6e5268d7d21d4f2b32a23c))
* **snap-preact:** fixing config services wiring and config merge issue with non-plain objects ([afab290](https://github.com/searchspring/snap/commit/afab290d971b579a3dccdaace755097c0e191e0f))
* **translators:** adjusting class properties to be protected instead of private and re-order config ([df0166d](https://github.com/searchspring/snap/commit/df0166dd52abb9b6d76b8f49f58dbb29e2e5bff7))


### Features

* **autocomplete-controller:** change the use of `config.action` and utilize UrlManager for URL ([f89c02f](https://github.com/searchspring/snap/commit/f89c02fddfd12bfb9381246f65b107c5958587a5))





# [0.22.0](https://github.com/searchspring/snap/compare/v0.21.1...v0.22.0) (2022-03-09)


### Bug Fixes

* **facetstore:** altering logic to ensure meta and facet details are in agreement ([efd9ceb](https://github.com/searchspring/snap/commit/efd9cebee93ea65b9b218160d23303f0215ab573))


### Features

* **autocomplete:** ac showResults config prop for showing trending term results ([7a1d71e](https://github.com/searchspring/snap/commit/7a1d71e2f15c2beff4c9403cb348a017d41f64a3))
* **client:** adding 'facets.autoDrillDown' request parameter to transformer ([1726235](https://github.com/searchspring/snap/commit/1726235c56ceef0b3bdaa28efe0a0e1fa5229241))
* **findercontroller:** adding default parameters to use 'facets.autoDrillDown' by default ([fa2df7e](https://github.com/searchspring/snap/commit/fa2df7e2639abc3d087b399c80f757a6455e9dbe))





## [0.21.1](https://github.com/searchspring/snap/compare/v0.21.0...v0.21.1) (2022-03-01)


### Bug Fixes

* **autocomplete.tsx:** breakpoints prop should override theme prop ([193f5a8](https://github.com/searchspring/snap/commit/193f5a8bf4ae0742a760217e1039cf18d8d0119d))
* **autocomplete.tsx:** bugfix for autocomplete breakpoints prop not working ([d9472fd](https://github.com/searchspring/snap/commit/d9472fdb53da4b6a16ba559cb02c0a6cfe31bafc))
* **snap.tsx:** use the merged config when creating a recommendationInstantiator ([f14c679](https://github.com/searchspring/snap/commit/f14c6790ddc8386c64ec8e86f2e50b708a657885))





# [0.21.0](https://github.com/searchspring/snap/compare/v0.20.5...v0.21.0) (2022-02-25)


### Bug Fixes

* add limit to RecommendationInstantiatorConfig type ([e5bb19d](https://github.com/searchspring/snap/commit/e5bb19da4ab11003249fd3480f9e515b2e8287d1))
* allow for limits param in recommendations globals or context ([bb09402](https://github.com/searchspring/snap/commit/bb094024c158601d95e979868a33174ab8132783))
* **client:** adding 'deepmerge' as a package dependency ([835802f](https://github.com/searchspring/snap/commit/835802ff31e053a75e66d5cd39953f55658d3531))
* deepmerge recommendations context globals with config and defaults ([ade3377](https://github.com/searchspring/snap/commit/ade337717d6717f96ecdf79b16bcff11f1c6df31))
* **facetstore.ts:** stringify facet value in facet url ([26dc5f8](https://github.com/searchspring/snap/commit/26dc5f818f4d485e617d67c4eeb7d4a0b8a821dd))
* **featureflags:** updating cookie feature flag logic to properly utilize the 'doNotTrack' flag ([96e8603](https://github.com/searchspring/snap/commit/96e8603f4124b9a07af0675241d010656788be75))
* hide carousel prev/next buttons if hideButtons instead of removing ([4a1c41d](https://github.com/searchspring/snap/commit/4a1c41de0a6be783a0b68027a0c20a4f8dbbb470))
* pr feedback - add default limit, update types and docs ([9b9124a](https://github.com/searchspring/snap/commit/9b9124ad3f048f8ca910e53841eb62283bb355c9))
* pr feedback: rename finder id, add config.url assertion on page change ([6c68f8f](https://github.com/searchspring/snap/commit/6c68f8faf1c6f46e795e673b3ecb13a080a4d469))
* **recommendationinstantiator:** fix shopper.id ([1b7715a](https://github.com/searchspring/snap/commit/1b7715a5e71797302af160b5d5aad3bf54e7fccb))
* remove limit, rename limit -> limits in config, refactor batching limits logic ([58b4302](https://github.com/searchspring/snap/commit/58b43026e2f8af7ba262091553dac7dd49af0f9f))
* **result.tsx:** changing from onMouseDown to onClick to fix recommendation onclick prop not working ([fa77195](https://github.com/searchspring/snap/commit/fa771953c4b4d45088991234306b5e17f74e075d))


### Features

* add custom space to recommendations instantiator context variables ([d05d35b](https://github.com/searchspring/snap/commit/d05d35b0bc84ac123ece803d821a96de24a008f2))
* add personalization preflightCache to Tracker, move charsParams to toolbox ([85cc74d](https://github.com/searchspring/snap/commit/85cc74d4a5d3b7ddc36827b7f2c1d9a3f08217a9))
* **carousel.tsx:** breakpoints bugfix, new autoAdjustSlides prop added ([bcd06a2](https://github.com/searchspring/snap/commit/bcd06a23ee522144f3ade7a8e3a94326a6b6c51e))
* **getcontext:** alter getContext to noly pull attributes as requested via 'evaluate' parameter ([9c51dd0](https://github.com/searchspring/snap/commit/9c51dd03eab78ede5757a89cc237f4530429bda6))
* **preact-components:** adding onClick props on organisms to tie into children onClick functions ([69449ae](https://github.com/searchspring/snap/commit/69449ae95031e698e794ee147f257ed29dc1e6ac))





## [0.20.5](https://github.com/searchspring/snap/compare/v0.20.4...v0.20.5) (2022-02-25)

**Note:** Version bump only for package @searchspring/snap





## [0.20.4](https://github.com/searchspring/snap/compare/v0.20.3...v0.20.4) (2022-02-02)


### Bug Fixes

* **tracker:** remove preventDefault from attribute click event listener ([09734c9](https://github.com/searchspring/snap/commit/09734c9252dbaed8d9a453e8de7ed1c0f55accce))





## [0.20.3](https://github.com/searchspring/snap/compare/v0.20.2...v0.20.3) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap





## [0.20.2](https://github.com/searchspring/snap/compare/v0.20.1...v0.20.2) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap





## [0.20.1](https://github.com/searchspring/snap/compare/v0.20.0...v0.20.1) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap





# [0.20.0](https://github.com/searchspring/snap/compare/v0.13.5...v0.20.0) (2022-02-01)


### Bug Fixes

* add promise polyfill ([c698b76](https://github.com/searchspring/snap/commit/c698b76078dd23ad13b528f4da74e28233d0cff3))
* add realtime type to RecommendationInstantiatorConfig ([eee7a1a](https://github.com/searchspring/snap/commit/eee7a1a9c13d270aae7dafa0d35181d8eb75baab))
* **client:** batch recommendations by siteId instead of params ([36d7f84](https://github.com/searchspring/snap/commit/36d7f84f5162b4b9eaade51be92e18d3134dbb9f))
* **controller-finder:** fixing bug with reset and hierarchy types of finders ([cb94ebd](https://github.com/searchspring/snap/commit/cb94ebd42f5481a8108f2d4d1575e5eb679552f8))
* **facetslider:** bugfix for slider that causes it to set lower and upper range to zero ([3a51f5d](https://github.com/searchspring/snap/commit/3a51f5db41a14e76c4d66a62498a46da5718d38a))
* **index.html:** switched to http-server to fix blank storybook bug, attempting to fix iframe render ([e693a3a](https://github.com/searchspring/snap/commit/e693a3a6e1e90803dcc3cf8cf9764d88d9675eb0))
* refactor polyfill to es5 syntax ([5cad0bd](https://github.com/searchspring/snap/commit/5cad0bd2b120aab9adc40d2998a58b292bb6215b))
* remove fetch and core-js from polyfills ([6a371aa](https://github.com/searchspring/snap/commit/6a371aac0a417011b3b76d26a723c66a5b84502a))
* remove unused variable ([9a5b13a](https://github.com/searchspring/snap/commit/9a5b13ad77ba72911dd48a35060a8618e1d5a734))
* **resultstore:** remove mappings from children, refactor Variant to Child ([816dcd3](https://github.com/searchspring/snap/commit/816dcd3d3c6c76b36ba1d0274b01174d7f9ba453))
* **snap-docs:** bugfix for firefox ss logo image sizing in doc app ([f13672c](https://github.com/searchspring/snap/commit/f13672c194aeaa3667afcb6d9789ddf95e51c6c0))
* **tracker.ts:** added config for tracker namespace, force all controllers to use same namespace ([6f8bd2f](https://github.com/searchspring/snap/commit/6f8bd2ff6ca04dabff5aa70f363452f0b287fc07))


### Features

* add batched config and context setting to disable batching ([d4c0ac2](https://github.com/searchspring/snap/commit/d4c0ac28d1bd220df0fac948dbb77b4dc5c4504e))
* add polyfills export to snap preact ([a841f39](https://github.com/searchspring/snap/commit/a841f395997897319fc7827c7241afa4eeb83b2a))
* add realtime config, add cart to context, refactor attribute names ([789dcd3](https://github.com/searchspring/snap/commit/789dcd34cc298340618c3debeb144524d7ff1b66))
* **image:** add onError event, fix onLoad event param ([ce353c5](https://github.com/searchspring/snap/commit/ce353c54245b650dd5e9764b1bc88894a7e1bbd0))
* **networkcache.ts:** added network request caching and support to config ([bc11c14](https://github.com/searchspring/snap/commit/bc11c14e92119f204bbbd1c27f51709e8d49fe92))
* **networkcache:** added memory caching ability to networkcache, removed meta getter, refactoring ([e70744d](https://github.com/searchspring/snap/commit/e70744d4a8749435cff1e0fcc599e5a2d5c30c6c))
* **resultstore:** add children variant support to resultStore ([a911b6f](https://github.com/searchspring/snap/commit/a911b6fe12ef1b2d036b1198aecb502887b54be8))
* **tracker:** finalize attribute tracking for add to cart, remove, clear ([b5bf033](https://github.com/searchspring/snap/commit/b5bf033d6ccf171980bafa1cd9b4b7ba93015ac0))
* **tracker:** wip: add initial cart attribute tracking ([5036896](https://github.com/searchspring/snap/commit/5036896f1022ccd9801946559e0762de36668363))





## [0.13.5](https://github.com/searchspring/snap/compare/v0.13.4...v0.13.5) (2022-01-31)


### Bug Fixes

* **tracker:** use native localStorage for getUserId ([782a285](https://github.com/searchspring/snap/commit/782a285748e8ae7272f1462cfd2ca3f339ea7d0f))





## [0.13.4](https://github.com/searchspring/snap/compare/v0.13.3...v0.13.4) (2022-01-31)


### Bug Fixes

* **tracker:** refactor getSessionId to match is.js native interface instead of StorageStore ([b5224de](https://github.com/searchspring/snap/commit/b5224de77eedc45c204af3e0bf64159c0b7891c6))





## [0.13.3](https://github.com/searchspring/snap/compare/v0.13.2...v0.13.3) (2022-01-07)


### Bug Fixes

* **autocomplete:** pass down banner subProps ([8036a20](https://github.com/searchspring/snap/commit/8036a2092b22c98f34cbfd8d2b7010a3d4241d62))
* **getparams:** added a null check for range filters with null low values ([af1bbf1](https://github.com/searchspring/snap/commit/af1bbf1b765ec278fd49e677bc6a91ab5fcb8408))
* **hybrid.ts:** use suggested query before spell corrected query ([a8792ce](https://github.com/searchspring/snap/commit/a8792cea26b3659654792d19541405e652a7e0e5))





## [0.13.2](https://github.com/searchspring/snap/compare/v0.13.1...v0.13.2) (2021-12-29)


### Bug Fixes

* **autocomplete-controller:** when spell correction is used the controller will wait for response ([0d65093](https://github.com/searchspring/snap/commit/0d650935ac0c310595fcb6d8e1843cb703afbd25))





## [0.13.1](https://github.com/searchspring/snap/compare/v0.13.0...v0.13.1) (2021-12-22)

**Note:** Version bump only for package @searchspring/snap





# [0.13.0](https://github.com/searchspring/snap/compare/v0.12.0...v0.13.0) (2021-12-14)


### Bug Fixes

* **domtargeter.ts:** removing interactive so scripts loaded with defer tag wait for DOMContentLoaded ([10b9ca3](https://github.com/searchspring/snap/commit/10b9ca3ee8a3ad563f01e1b919d433c2f2fb725e))
* **preact-component-image:** changing useRef to have a default empty string value ([e679aed](https://github.com/searchspring/snap/commit/e679aed6461efa7bd7371b44388d10743d28033a))
* **searchrequest:** add missing tracking.domain search request param ([45afe2d](https://github.com/searchspring/snap/commit/45afe2d089b0d172290e36854a89998bb607c019))
* **snap-preact:** fixing issue in getController after making SearchController creation synchronous ([bb25898](https://github.com/searchspring/snap/commit/bb258989ce4e4b0546df4b6169d84bb210b24694))
* **sortingstore:** remove duplicate sort options ([3723b8a](https://github.com/searchspring/snap/commit/3723b8a436e0f9302db822fe64b9ff2fc1bf739e))
* **toolbox-getcontext:** making the function more robust and not requiring innerHTML ([f62a284](https://github.com/searchspring/snap/commit/f62a28416f5abe2daead261d108a8e39c0871b5f))


### Features

* **snap-preact:** adding context to the window global ([1e10921](https://github.com/searchspring/snap/commit/1e109216a1430259690518c14332c333da6fb5b7))
* **snap.tsx:** adding Skeleton template support and examples ([ac426bc](https://github.com/searchspring/snap/commit/ac426bcc7ef2794a747183a21e8e89d70bcf40e1))
* **tracker:** adding ability to track using script tags ([b655062](https://github.com/searchspring/snap/commit/b65506258ebc8845af0fb5c19efbf159e045e60d))





# [0.12.0](https://github.com/searchspring/snap/compare/v0.11.0...v0.12.0) (2021-11-19)


### Bug Fixes

* **facetslider-component:** adding 'type="button"' to slider handles to  prevent form submission ([86f3909](https://github.com/searchspring/snap/commit/86f39094725cd94de25ffb14145fc14ee5af332d))
* **filtersummary.tsx:** onClearAllClick should clear the page by default ([de8f78e](https://github.com/searchspring/snap/commit/de8f78e32d992c83498bb6212059b175f7b78de8))
* **searchcontroller:** search redirect bugfixes when filters are applied ([95c4edb](https://github.com/searchspring/snap/commit/95c4edb2016045d92bfeb84354e34269af05cda8))
* **storagestore:** fallback to empty object when get() does not find anything ([f6e3c13](https://github.com/searchspring/snap/commit/f6e3c131f51398331892da353a27c5e6491ad721))


### Features

* getContext, update tests, refactor components out of branchOverride ([717bd8b](https://github.com/searchspring/snap/commit/717bd8bdaade6c532f02bad376b10b69a0ac445c))
* **result:** added new hideImage prop to result & autocomplete to hide the product image ([c7c2032](https://github.com/searchspring/snap/commit/c7c2032c1000d37651da213be0004757aa2fab72))
* **snap-preact:** updated BranchOverride with dynamic import, themes and display date modified ([2ac155d](https://github.com/searchspring/snap/commit/2ac155d7bf35ac17bb49993e0d2691b7f484a5c2))
* **snap-preact:** work towards making branch bundle switching occur client side (instead of lambda) ([43a9f25](https://github.com/searchspring/snap/commit/43a9f251da4d743168fb0cde0fd8a7517b649798))





# [0.11.0](https://github.com/searchspring/snap/compare/v0.10.0...v0.11.0) (2021-10-29)


### Bug Fixes

* **autocomplete-component:** changing 'facetsToShow' to always be an array ([df3a59f](https://github.com/searchspring/snap/commit/df3a59f4a941f00d74e6aaad155049dd1a681fb1))
* **client:** add retry logic for 429 rate limited requests ([e443efa](https://github.com/searchspring/snap/commit/e443efaca3c5155c60c9c1b0f33c66c21901f2bd))
* **facet:** bugfix for issue [#231](https://github.com/searchspring/snap/issues/231), Issue when switching between slider and list types ([21c97c5](https://github.com/searchspring/snap/commit/21c97c51a6c8b33e0bcbfae0e63e504bfc9623b6))
* **theme:** add message colors to default theme ([782155c](https://github.com/searchspring/snap/commit/782155c2f4068124496b57ab96bb3b8d44e7191c))


### Features

* **errorhandler:** add ErrorHandler Component, updated icons ([6d50f84](https://github.com/searchspring/snap/commit/6d50f84b098f2e3d31b712236d945946828e3443))
* **facet.tsx:** added optionsSlot & fields props to facet component ([09846c0](https://github.com/searchspring/snap/commit/09846c0a87cf422bf83dea4526e06b8e72274071))
* modify retry delay to fibonacci algo, modify error code handling of request failures ([50613da](https://github.com/searchspring/snap/commit/50613da92db014552f3ff6a529fb742b4559cc02))





# [0.10.0](https://github.com/searchspring/snap/compare/v0.9.7...v0.10.0) (2021-10-15)


### Bug Fixes

* **autocomplete:** add theme prop deepmerge to results subprop ([ac21190](https://github.com/searchspring/snap/commit/ac21190aa3fbc9f6bbc18a191d9e8cda40547fd1))
* **autocomplete:** deepmerge default subprop with theme props ([616aaba](https://github.com/searchspring/snap/commit/616aabad4d5dbc0904938891750cc82f4ca9f056))
* **autocomplete:** deepmerge prop theme with breakpoint theme ([ae0717f](https://github.com/searchspring/snap/commit/ae0717f96f15e722b0bb34df30d0f1ac54dcb10f))
* **querystore:** fixing 'rq' and 'oq' bug where they were only using the first letter of value ([2d5faec](https://github.com/searchspring/snap/commit/2d5faecb76dac3b0ad2cda3b557eba902036bcb3))
* remove duplicate subprop class ss__autocomplete__facets ([0ba88b5](https://github.com/searchspring/snap/commit/0ba88b5163996cfb2351d00bdd3f4d0267b2bfad))
* remove redundant globals, update docs with link to api docs ([b679a3a](https://github.com/searchspring/snap/commit/b679a3aa53c730a3caf96b22af2ab4badf69d4e4))


### Features

* add personalization params and transforms to search and autocomplete request params ([05c709d](https://github.com/searchspring/snap/commit/05c709dc0d11e145cf3837d76414c0efe0423286))
* **autocomplete:** add linkSlot & hideLink props, update docs, add props to facetsSlot & termsSlot ([81547f0](https://github.com/searchspring/snap/commit/81547f013eb1e68671653ebc19efa5711ecc65dc))
* **facets:** add limit prop to Facets component, refact Autocomplete to use Facets ([de36bcc](https://github.com/searchspring/snap/commit/de36bcc76a65f4993321b536133281d6ee02edba))





## [0.9.7](https://github.com/searchspring/snap/compare/v0.9.6...v0.9.7) (2021-10-08)


### Bug Fixes

* **autocomplete-controller:** added a timeout to ensurethe focus event occurs after click event ([1a23f23](https://github.com/searchspring/snap/commit/1a23f23abca4e4fe8bd7b95973fd1abd4c2ff813))
* **autocomplete-controller:** removing console logs ([3c73561](https://github.com/searchspring/snap/commit/3c735616314202c44ca9ebeea3a505c48b095518))
* **snap-preact:** preventing multiple bindings ([d25c4c4](https://github.com/searchspring/snap/commit/d25c4c464cca582aedc7d769a68cf6a741ff9478))





## [0.9.6](https://github.com/searchspring/snap/compare/v0.9.5...v0.9.6) (2021-10-07)

**Note:** Version bump only for package @searchspring/snap





## [0.9.5](https://github.com/searchspring/snap/compare/v0.9.4...v0.9.5) (2021-10-06)

**Note:** Version bump only for package @searchspring/snap





## [0.9.4](https://github.com/searchspring/snap/compare/v0.9.3...v0.9.4) (2021-10-05)


### Bug Fixes

* **autocomplete-component:** adding missing 'valueProps' prop to facetsSlot ([60ea6f8](https://github.com/searchspring/snap/commit/60ea6f8027268efe25ff5a359b12b2103c417693))
* **facet-component:** adding overflow slot ([0dd2b69](https://github.com/searchspring/snap/commit/0dd2b69885e4cca9b80bff61cda698b38663f60f))
* **facet-component:** removing 'hideIcon' prop and renaming the overflow icons ([0279f6e](https://github.com/searchspring/snap/commit/0279f6ef156d635338c74d0c59286f0c4c9a80f3))





## [0.9.3](https://github.com/searchspring/snap/compare/v0.9.2...v0.9.3) (2021-10-01)


### Bug Fixes

* **dev-cookie:** dev cookie name did not conform to other cookie names 'ssXxx' ([0addc52](https://github.com/searchspring/snap/commit/0addc52b2c72c09a017e573d5685881ebf634e91))
* **paginationstore:** adding support for totalPages in the pagination store ([a867ea4](https://github.com/searchspring/snap/commit/a867ea4e6cc02b2360f281247c5c18c738cc1070))
* **recommendation-controller:** removing duplicated config.globals merge on params ([2782025](https://github.com/searchspring/snap/commit/2782025b4f2023bb69bfb8cb28cf244065687b76))
* **snap-preact:** unifying interface to get recommendations instantiator ([14f4c01](https://github.com/searchspring/snap/commit/14f4c0122349c8d1aca258ad2eebd2f85107b246))
* **urltranslator:** remove core parameters that have empty values ([d48211a](https://github.com/searchspring/snap/commit/d48211a935d82bc89ac3c33ac37bbabe606832f1))





## [0.9.2](https://github.com/searchspring/snap/compare/v0.9.1...v0.9.2) (2021-09-29)


### Bug Fixes

* **snap-preact:** adding controller to onTarget; fixing url params in createController ([c9e65e5](https://github.com/searchspring/snap/commit/c9e65e56acc11ab9b51c9d58725dde63f9bc97b2))





## [0.9.1](https://github.com/searchspring/snap/compare/v0.9.0...v0.9.1) (2021-09-29)


### Bug Fixes

* **client-recs-api:** enabling POST/GET change based on payload size ([0126736](https://github.com/searchspring/snap/commit/0126736c0b8121d5edd5a3a2e3145ae0eeb5c9c3))
* **recommendation-instantiator:** instantiator template component, add selector and allowing '-' ids ([50b3e34](https://github.com/searchspring/snap/commit/50b3e3441ffb67edf3db281b9e9552c9bb339d10))





# [0.9.0](https://github.com/searchspring/snap/compare/v0.8.0...v0.9.0) (2021-09-28)


### Features

* code splitting work in progress, add finder to demostore ([15c55a9](https://github.com/searchspring/snap/commit/15c55a9a72d9c497b66fc6a2c1744bb318236aa8))





# [0.8.0](https://github.com/searchspring/snap/compare/v0.7.3...v0.8.0) (2021-09-17)


### Bug Fixes

* rename handleTextColor to valueTextColor and apply to non-sticky handles also ([33d3370](https://github.com/searchspring/snap/commit/33d3370a81ff2aaca0c81e51b410bf959111bfd4))


### Features

* **dynamic-import:** change to snap config for components utilizing return from function ([83929ee](https://github.com/searchspring/snap/commit/83929eea52324e5ca197dbf9ac6bac208d06fc59))


### Performance Improvements

* work in progress for getting dynamic importing ([93d095b](https://github.com/searchspring/snap/commit/93d095b5e56bb72438b73ac1a4b8087c3da6e46c))





## [0.7.3](https://github.com/searchspring/snap/compare/v0.7.2...v0.7.3) (2021-09-15)


### Bug Fixes

* **facet-hierarchy-options-component:** fixing typo with theme props ([fae326c](https://github.com/searchspring/snap/commit/fae326cf370381af60dd90ce9af43ba45b787a22))





## [0.7.2](https://github.com/searchspring/snap/compare/v0.7.1...v0.7.2) (2021-09-13)


### Bug Fixes

* **package-lock.json:** fixing some tests and errors related to package updates ([55ade00](https://github.com/searchspring/snap/commit/55ade000ac02e0a712b1d34486f885b975de7ba8))





## [0.7.1](https://github.com/searchspring/snap/compare/v0.7.0...v0.7.1) (2021-09-10)


### Bug Fixes

* **facet-component:** using handleize filter for classname of palette option ([b694cf9](https://github.com/searchspring/snap/commit/b694cf9cc85d4e86f1eb2ca0ee24319c438710d1))
* **snap-client:** client support for siteId swap (using proper subdomain) for meta ([7607072](https://github.com/searchspring/snap/commit/7607072f4d0fc4f4d4c9b4bc102628ae2338aa3e))





# [0.7.0](https://github.com/searchspring/snap/compare/v0.6.2...v0.7.0) (2021-09-09)


### Bug Fixes

* **(carousel/recommendation)-component:** adding support for vertical pagination ([eb24284](https://github.com/searchspring/snap/commit/eb24284a0ea79a1bd9fa325f6a054e05f26eaefb))
* **facet-slider-component:** adjust margin to prevent overflow scroll ([d6a89dd](https://github.com/searchspring/snap/commit/d6a89dd1ff4d4329818bd33284349b6034e1a929))
* **facet-slider-component:** handling overflow with all prop options ([952b261](https://github.com/searchspring/snap/commit/952b2610bff32bde966214f8b69ebc95396ded68))
* **facet-slider-component:** small change to remove min-height ([2fe3ed8](https://github.com/searchspring/snap/commit/2fe3ed81435240d625345218babb9aa32ae16383))
* **facetslider.tsx:** bugfix for slider handle labels overflowing when handle is at the ends of rail ([3c43b4c](https://github.com/searchspring/snap/commit/3c43b4c94d4497b27eb10428d3bccc01924947b5))
* **facetslider:** increase label spacing if showTicks enabled ([ef0be4f](https://github.com/searchspring/snap/commit/ef0be4f42f3958f5f22a644ee44a01ffeab328d0))
* **pagination-store:** fix to setPageSize method to remove the current page ([4996d66](https://github.com/searchspring/snap/commit/4996d6657f31cda1102de2c1df7edde19d4e1b5c))
* **recommendation.tsx:** recommendation component was not using the global theme ([ce5da93](https://github.com/searchspring/snap/commit/ce5da938d4f112909e7947c69ced024f51aedcf8))
* **search-request:** add siteId to search request params ([af68f5a](https://github.com/searchspring/snap/commit/af68f5a61bd259bf1ee5244573edc55f710462b7))
* **select.tsx:** add support for native styling ([81228fb](https://github.com/searchspring/snap/commit/81228fbd8aae41485b7a445531ce4c8b5019d46d))


### Features

* **carousel.tsx:** new feature to support vertical carousels ([466d211](https://github.com/searchspring/snap/commit/466d21147b4ded1d5c4061e12305f6f326b590fe))
* **facetslider.tsx:** prop for sticky handle labels ([c6974f0](https://github.com/searchspring/snap/commit/c6974f0446d177a39e8586c74a99e6ac1232ee0a))
* **theme prop:** theme prop refactor ([641fc44](https://github.com/searchspring/snap/commit/641fc44d2df1efd8353e541bb880b08cb21c2a2e))
* **url-translator:** changes to translator - urlRoot params, value-less params and settings changes ([0022ff0](https://github.com/searchspring/snap/commit/0022ff03b0ce3f64b7971c559fb0020e17b6a891))
* **url-translator:** making urlTranslator fully customizable via name and type for all parameters ([f5194f5](https://github.com/searchspring/snap/commit/f5194f53b6d678ef4df1300ff5dab93fda206634))





## [0.6.2](https://github.com/searchspring/snap/compare/v0.6.1...v0.6.2) (2021-09-03)


### Bug Fixes

* **client-translator:** preventing NaN on price core fields when undefined ([f5ece91](https://github.com/searchspring/snap/commit/f5ece9195affedf565452f46ee3b0e9660a646f3))
* **formatnumber:** fixing case of NaN and no longer returning input when not a number ([9e68eff](https://github.com/searchspring/snap/commit/9e68eff2af7e7e393f11c02556d0a1f0bd0b42ee))
* **infinite:** fixing inline banner support of infinite scroll in search controller and store ([62dc80b](https://github.com/searchspring/snap/commit/62dc80b0e36a3c65165a41c48035e87f9f211bc8))
* **inlinebanner:** removing unnecessary max-width from styles ([d23e81d](https://github.com/searchspring/snap/commit/d23e81d761c734ff9cfacbe8744115dc4318dcc6))





## [0.6.1](https://github.com/searchspring/snap/compare/v0.6.0...v0.6.1) (2021-09-02)


### Bug Fixes

* **search-controller:** fixing lastParam not being set all the time ([84476a2](https://github.com/searchspring/snap/commit/84476a246f74e9a7c6ebf45653f196e1a48798b7))





# [0.6.0](https://github.com/searchspring/snap/compare/v0.5.6...v0.6.0) (2021-09-01)


### Bug Fixes

* **autocomplete-component:** moving facetSlot out of facetsToShow logic ([27ce891](https://github.com/searchspring/snap/commit/27ce891d00af2c971d0934d215937b2bae167443))
* **carousel-component:** restoring 'additionalProps' that was removed previously for swiper props ([2d25032](https://github.com/searchspring/snap/commit/2d2503263ce7ec575d91a52d00bb9998dc35e036))
* **controller:** controller package.json was missing toolbox dependency ([82047bc](https://github.com/searchspring/snap/commit/82047bcc697b53191292ffcfbdc3148a93f4f91b))
* moving loading completion to 'afterStore' ([c062dfc](https://github.com/searchspring/snap/commit/c062dfc8288445ffe4a1c6923dcf5b552c963595))
* **querystore:** change to make QueryStore Query url preserve non result limiting urls ([3266bcb](https://github.com/searchspring/snap/commit/3266bcbea9e6b8389249a69b0f3b20c2a964d748))
* **search-controller:** preventing search when no params changed since last search ([7f7c606](https://github.com/searchspring/snap/commit/7f7c60610a68941056066da91b46e1f3e28ac22e))
* **urltranslator:** removing console.log ([90e22f4](https://github.com/searchspring/snap/commit/90e22f413ae56e3c3f26a12e9dc2971a84f9d425))


### Features

* **abstract-controller:** adding ability to pass parameters to plugins ([6411ece](https://github.com/searchspring/snap/commit/6411ece8b0f3261a4dc2945d9cb2db3b67809ba8))
* **abstract:** adding id to abstract controller and renaming attachment 'on' -> 'middleware' ([8ff6134](https://github.com/searchspring/snap/commit/8ff613429719ca60d966e752a9c958b463a0a865))
* **autocomplete-component:** adding resultsSlot and noResultsSlot - fixing bug with dupe terms elem ([47aff58](https://github.com/searchspring/snap/commit/47aff58aa75f8c27db9c8ab38dde55c3159885c6))
* **autocomplete-controller:** adding 'beforeSubmit' event ([697b474](https://github.com/searchspring/snap/commit/697b474c2bf7cc555fafbb948377d8a9f23dd9b8))
* **autocomplete-controller:** adding escKey event handler and refactoring for tabbing support ([23771a7](https://github.com/searchspring/snap/commit/23771a7f505a166a307efeb8f6f6d6af44c0856b))
* **carousel:** refactor of carousel and recommendations components with test and doc updates ([2718f57](https://github.com/searchspring/snap/commit/2718f572a109339e36d59b2bea8ce233e09c2abb))
* **urlmanager:** adding global state to allow parameters to always be generated ([e5067e2](https://github.com/searchspring/snap/commit/e5067e29a9bb5e3c9edad5867d20e14373c6e7bc))
* **urltranslator:** adding to snap-preact and urlTranslator the ability to customize parameters ([028929c](https://github.com/searchspring/snap/commit/028929c136ca95e0c55c03319cde64199a97788f))


### Reverts

* **gitignore:** removing the ignore of package docs to ensure docs branch has files ([13fa1aa](https://github.com/searchspring/snap/commit/13fa1aa9adc6ae18777c2c058d97223603fb493b))





## [0.5.6](https://github.com/searchspring/snap/compare/v0.5.5...v0.5.6) (2021-08-31)


### Bug Fixes

* **slideout-component:** adding --active modifier class to ss__slideout when active ([b2bb8fa](https://github.com/searchspring/snap/commit/b2bb8fa184c25335752d97deaa7a6b91e056e754))





## [0.5.5](https://github.com/searchspring/snap/compare/v0.5.4...v0.5.5) (2021-08-25)

**Note:** Version bump only for package @searchspring/snap





## [0.5.4](https://github.com/searchspring/snap/compare/v0.5.3...v0.5.4) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap





## [0.5.3](https://github.com/searchspring/snap/compare/v0.5.2...v0.5.3) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap





## [0.5.2](https://github.com/searchspring/snap/compare/v0.5.1...v0.5.2) (2021-08-24)


### Bug Fixes

* **autocomplete-controller:** fixing issue with spell correct input value not using string ([6d62d99](https://github.com/searchspring/snap/commit/6d62d999ae371d8026fed5374915bae40525b3c6))





## [0.5.1](https://github.com/searchspring/snap/compare/v0.5.0...v0.5.1) (2021-08-24)


### Bug Fixes

* **autocompletecomponent:** styling changes to make facets appear correctly in ac component ([7dcb600](https://github.com/searchspring/snap/commit/7dcb600de8a4353f6acd545b866d767cf789831c))
* **facetheirarchyoptions:** adding ability to preview this type of facet for autocomplete component ([ec9014b](https://github.com/searchspring/snap/commit/ec9014befb22a16c7e05a89c6ce7c6e7fded16f6))





# [0.5.0](https://github.com/searchspring/snap/compare/v0.4.0...v0.5.0) (2021-08-23)


### Bug Fixes

* **autocomplete:** add flex basis to facets, remove demo store autocomplete theme.results duplicate ([0b79a73](https://github.com/searchspring/snap/commit/0b79a739f1cdf86dda7e871ca3bd0f2881569c0f))
* **autocomplete:** additional styling improvements, disable badges, hide section props, title props ([c8392d2](https://github.com/searchspring/snap/commit/c8392d21187ea0b77dfba6b062cc8f6346c68aca))
* **autocomplete:** terms flex shrink, set input spellcheck and autocomplete attrs, slot wrappers ([949887f](https://github.com/searchspring/snap/commit/949887ffaba666864cf9e9a325ac29210044cafa))
* **autocomplete:** wrapper should not exist if empty div ([aa60b2e](https://github.com/searchspring/snap/commit/aa60b2e871472fea95e184132fc6fb0209da935f))
* **banner:** add additional styles to images within banner component ([568366a](https://github.com/searchspring/snap/commit/568366a33c74749ae458f8b13d84cea2396da318))
* **facet:** adjust classnames of facet component to include display on root ([4cef5ce](https://github.com/searchspring/snap/commit/4cef5ced72b244abcc04a2cdf311188563ff957e))
* **facets.tsx:** fixing facet subprop theme ([5a32e6a](https://github.com/searchspring/snap/commit/5a32e6a107f1bf03dbf2a92bf495cc151ccf45e3))
* **result:** swap msrp and reg price in price component ([f47cede](https://github.com/searchspring/snap/commit/f47cedee21b667c2623cab06a8afa04e6c33e295))


### Features

* **autocomplete:** add horizontalTerms, vertical props, improve autocomplete styling and dom ([6fcd661](https://github.com/searchspring/snap/commit/6fcd66105287af8a75bf46ab511a1b17b3bca467))
* **autocomplete:** further styling improvements & add termsSlot, facetsSlot, contentSlot ([9043447](https://github.com/searchspring/snap/commit/90434470287ce6b0ded940241cdc671b76104b23))
* **image:** add maxHeight prop to Image component, update tests ([e6d742a](https://github.com/searchspring/snap/commit/e6d742a54d06a8748084a058bb54e0603264ca35))





# [0.4.0](https://github.com/searchspring/snap/compare/v0.3.47...v0.4.0) (2021-08-23)


### Bug Fixes

* **dropdown.tsx:** bugfix for dropdowns passing multiple children ([3c5cbdc](https://github.com/searchspring/snap/commit/3c5cbdc15735538911dd37557ffdbb8089147b20))


### Features

* **dropdown.tsx:** 'open' prop should be passed into dropdown content and button slots ([9b44559](https://github.com/searchspring/snap/commit/9b445590b37c3ac3f6d62a803fba70905061b15e))





## [0.3.47](https://github.com/searchspring/snap/compare/v0.3.46...v0.3.47) (2021-08-23)


### Bug Fixes

* fix github action to checkout all tags ([e9e2f73](https://github.com/searchspring/snap/commit/e9e2f7393e1b765c26882715f7ffaa8a50b7fb6f))





## 0.3.46 (2021-08-21)

**Note:** Version bump only for package @searchspring/snap





## 0.3.45 (2021-08-20)

**Note:** Version bump only for package @searchspring/snap





## 0.3.44 (2021-08-19)

**Note:** Version bump only for package @searchspring/snap





## 0.3.43 (2021-08-19)

**Note:** Version bump only for package @searchspring/snap





## 0.3.42 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.41 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.40 (2021-08-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.39 (2021-08-17)

**Note:** Version bump only for package @searchspring/snap





## 0.3.38 (2021-08-17)

**Note:** Version bump only for package @searchspring/snap





## 0.3.37 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap





## 0.3.36 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap





## 0.3.35 (2021-08-16)

**Note:** Version bump only for package @searchspring/snap





## 0.3.34 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap





## 0.3.33 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap





## 0.3.32 (2021-08-13)

**Note:** Version bump only for package @searchspring/snap





## 0.3.31 (2021-08-11)

**Note:** Version bump only for package @searchspring/snap





## 0.3.30 (2021-08-10)

**Note:** Version bump only for package @searchspring/snap





## 0.3.29 (2021-08-07)

**Note:** Version bump only for package @searchspring/snap





## 0.3.28 (2021-08-07)


### Bug Fixes

* **github-pages:** disable jekyll ([8976091](https://github.com/searchspring/snap/commit/8976091670f96f31ac4ba9c980c134ef39b79361))





## 0.3.27 (2021-08-07)

**Note:** Version bump only for package @searchspring/snap





## 0.3.26 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap





## 0.3.25 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap





## 0.3.24 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap





## 0.3.23 (2021-08-06)

**Note:** Version bump only for package @searchspring/snap





## 0.3.22 (2021-08-05)

**Note:** Version bump only for package @searchspring/snap





## 0.3.21 (2021-08-04)

**Note:** Version bump only for package @searchspring/snap





## 0.3.20 (2021-08-04)

**Note:** Version bump only for package @searchspring/snap





## 0.3.19 (2021-08-03)

**Note:** Version bump only for package @searchspring/snap





## 0.3.18 (2021-08-03)

**Note:** Version bump only for package @searchspring/snap





## 0.3.17 (2021-07-30)

**Note:** Version bump only for package @searchspring/snap





## 0.3.16 (2021-07-28)

**Note:** Version bump only for package @searchspring/snap





## 0.3.15 (2021-07-28)

**Note:** Version bump only for package @searchspring/snap





## 0.3.14 (2021-07-27)

**Note:** Version bump only for package @searchspring/snap





## 0.3.13 (2021-07-27)

**Note:** Version bump only for package @searchspring/snap





## 0.3.12 (2021-07-23)

**Note:** Version bump only for package @searchspring/snap





## 0.3.11 (2021-07-21)

**Note:** Version bump only for package @searchspring/snap





## 0.3.10 (2021-07-21)

**Note:** Version bump only for package @searchspring/snap





## 0.3.9 (2021-07-20)

**Note:** Version bump only for package @searchspring/snap





## 0.3.8 (2021-07-17)

**Note:** Version bump only for package @searchspring/snap





## 0.3.7 (2021-07-16)


### Bug Fixes

* update gh action to include version before publish ([2527f8f](https://github.com/searchspring/snap/commit/2527f8f42dc515e53639c6579c8c743ea3809eb6))





## 0.3.6 (2021-07-02)

**Note:** Version bump only for package @searchspring/snap





## 0.3.5 (2021-06-21)

**Note:** Version bump only for package @searchspring/snap





## 0.3.4 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.3 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.2 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap





## 0.3.1 (2021-06-18)

**Note:** Version bump only for package @searchspring/snap





# 0.3.0 (2021-06-17)


### Features

* **slideout.tsx:** slideout slide direction ([#45](https://github.com/searchspring/snap/issues/45)) ([55b6544](https://github.com/searchspring/snap/commit/55b654489d66c48cea1fe4aa6769c14fcd779a4f))





## 0.2.1 (2021-06-15)

**Note:** Version bump only for package @searchspring/snap





# 0.2.0 (2021-05-20)


### Features

* **domtargeter.ts:** default 'replace' action that replaces target elem ([#40](https://github.com/searchspring/snap/issues/40)) ([82f2435](https://github.com/searchspring/snap/commit/82f24359136cf92e5993f535f35593c344e65095))





## 0.1.14 (2021-05-18)

**Note:** Version bump only for package @searchspring/snap





## 0.1.13 (2021-05-12)

**Note:** Version bump only for package @searchspring/snap





## 0.1.12 (2021-05-11)


### Bug Fixes

* **select.tsx:** fixing disableclickoutside bug. Adding an additional… ([#39](https://github.com/searchspring/snap/issues/39)) ([5e51c5e](https://github.com/searchspring/snap/commit/5e51c5ef4eaab24b86f0c363f9c66424ba71cfd1))





## 0.1.11 (2021-05-11)


### Bug Fixes

* **facet.tsx:** disableCollapse prop forces Dropdown to be open ([#37](https://github.com/searchspring/snap/issues/37)) ([d64b48b](https://github.com/searchspring/snap/commit/d64b48bddfe40017e2cf051325037b4743a1e002))





## 0.1.10 (2021-05-07)

**Note:** Version bump only for package @searchspring/snap





## 0.1.9 (2021-05-06)

**Note:** Version bump only for package @searchspring/snap





## 0.1.8 (2021-05-05)

**Note:** Version bump only for package @searchspring/snap





## 0.1.7 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap





## 0.1.6 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap





## 0.1.5 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap





## 0.1.4 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap





## 0.1.3 (2021-04-30)

**Note:** Version bump only for package @searchspring/snap





## 0.1.2 (2021-04-29)


### Bug Fixes

* commit docs ([#29](https://github.com/searchspring/snap/issues/29)) ([dd69d05](https://github.com/searchspring/snap/commit/dd69d0548465672eb58ab720884ce2d8190a0677))





## [0.1.1](https://github.com/searchspring/snap/compare/v0.1.0...v0.1.1) (2021-04-29)


### Bug Fixes

* remove test code ([e005ebd](https://github.com/searchspring/snap/commit/e005ebdf3395acca43469aa4ad8d18842b491f2f))





# 0.1.0 (2021-04-29)


### Bug Fixes

* fix lerna version to be new starting package version ([b58d42b](https://github.com/searchspring/snap/commit/b58d42b1ae3e532ae01cdc44fa7a492086f72ef3))
* fix translator configs and hybrid range ([#9](https://github.com/searchspring/snap/issues/9)) ([ac43573](https://github.com/searchspring/snap/commit/ac43573266c63592d6f83ccb08f9860cd59c4cca))
* icon gallery hiding controls ([#19](https://github.com/searchspring/snap/issues/19)) ([20a9d24](https://github.com/searchspring/snap/commit/20a9d246408a404fcfe2ca7b27541a8215e60f79))
* remove version from root package.json ([03a1aa0](https://github.com/searchspring/snap/commit/03a1aa0aa0128076a8a6f126fb610c0b6b2e2913))
* **husky:** migrate v4 to v6 ([#15](https://github.com/searchspring/snap/issues/15)) ([1d15c8f](https://github.com/searchspring/snap/commit/1d15c8f24467bc91b28039db51c35c02199c0774))
* **package-lock:** removing snapp stuff from package-lock... derp ([7a72eae](https://github.com/searchspring/snap/commit/7a72eae82a59e366aec813a7d374508be2165559))


### Features

* hide control column of ArgsTable on docs tab using css ([#16](https://github.com/searchspring/snap/issues/16)) ([63f0194](https://github.com/searchspring/snap/commit/63f0194a8aa2aebc4cbb6af235e85dfb47ee7e68))


### Reverts

* revert removing version from each package.json ([a0471de](https://github.com/searchspring/snap/commit/a0471dee9794c7044bd0231d645de3a831983a52))
