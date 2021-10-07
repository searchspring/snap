# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
