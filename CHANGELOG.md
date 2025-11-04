# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.69.2](https://github.com/searchspring/snap/compare/v0.69.1...v0.69.2) (2025-11-04)

**Note:** Version bump only for package @searchspring/snap

## [0.69.1](https://github.com/searchspring/snap/compare/v0.69.0...v0.69.1) (2025-10-23)

**Note:** Version bump only for package @searchspring/snap

# [0.69.0](https://github.com/searchspring/snap/compare/v0.68.0...v0.69.0) (2025-10-16)

### Bug Fixes

- **controller/search:** adding 'brand' and 'manufacturer' to the list of known background filters ([273e5e4](https://github.com/searchspring/snap/commit/273e5e482078a75796ac430e87b9aa30a83c1d9a))
- **snap-preact:** adding additional checks around all cookie/storage usage to ensure things work ([0f6d8e7](https://github.com/searchspring/snap/commit/0f6d8e735c3d3c7eea7cfba6cf59509fafb819bb))
- **toolbox/domtargeter:** error handling was supressing errors due to await outside of async ([340f8c2](https://github.com/searchspring/snap/commit/340f8c2c97f625a3784eeea58b59ff23d11864cc))
- **toolbox/domtargeter:** switching to for..of loop ([dac4096](https://github.com/searchspring/snap/commit/dac40968b36b1d69210842a2811448b660f5dba0))

### Features

- **searchcontroller:** adding the ability to show hierarchy filters in the filterSummary ([43c3890](https://github.com/searchspring/snap/commit/43c3890db4f6e6b2ec5edc7f45fe2069a6f4ce20))

# [0.68.0](https://github.com/searchspring/snap/compare/v0.67.5...v0.68.0) (2025-08-18)

### Bug Fixes

- add noBeacon param to recommend api, update beacon and snapi-types version ([89e185c](https://github.com/searchspring/snap/commit/89e185c1b06a49274103c50d3bf410e2effa1e3a))
- fix inline banners in last position and index matches totalResults ([c2da409](https://github.com/searchspring/snap/commit/c2da4095721a5be8cb4467542c5579a0dce2ac95))

### Features

- **preact/components/variantselection:** adding new onSelect prop to variantSelection ([8bf77c7](https://github.com/searchspring/snap/commit/8bf77c7b898c6f6d8e2addcd3b5f6d053841170d))

## [0.67.5](https://github.com/searchspring/snap/compare/v0.67.4...v0.67.5) (2025-08-11)

**Note:** Version bump only for package @searchspring/snap

## [0.67.4](https://github.com/searchspring/snap/compare/v0.67.3...v0.67.4) (2025-07-29)

### Bug Fixes

- **controller/autocomplete:** adding a routine to ensure we do not submit incorrect redirection ([6053233](https://github.com/searchspring/snap/commit/6053233c630a29f1b71249399875947a63e0af33))
- **controller/autocomplete:** adjusting logic around redirect to prevent issues with "showResults" ([416ce9d](https://github.com/searchspring/snap/commit/416ce9da1220111f1e00bb351c1589b7847cfdf6))

## [0.67.3](https://github.com/searchspring/snap/compare/v0.67.2...v0.67.3) (2025-07-24)

### Bug Fixes

- add rq to beacon payload ([234d9b9](https://github.com/searchspring/snap/commit/234d9b9fd4a6bf134a7d8d80a3c52f3e74c62942))

## [0.67.2](https://github.com/searchspring/snap/compare/v0.67.1...v0.67.2) (2025-07-15)

**Note:** Version bump only for package @searchspring/snap

## [0.67.1](https://github.com/searchspring/snap/compare/v0.67.0...v0.67.1) (2025-07-15)

**Note:** Version bump only for package @searchspring/snap

# [0.67.0](https://github.com/searchspring/snap/compare/v0.66.4...v0.67.0) (2025-07-15)

### Bug Fixes

- catch QuotaExceededError errors when setting local or session storage ([6048727](https://github.com/searchspring/snap/commit/60487278409133c5744885af9121bbac55f8cba8))
- **client/recommend:** fixing regression in order option when using legacy script blocks ([b1ca0eb](https://github.com/searchspring/snap/commit/b1ca0eba4affb038ca61b569585f33e80d4e676c))
- range checking incorrect property ([273062d](https://github.com/searchspring/snap/commit/273062d0f307cf17b1cf01e6087b62cfae3e01ac))
- **store-mobx/searchresultstore:** fixing issue when no options are present (defensive) ([744b9f5](https://github.com/searchspring/snap/commit/744b9f586f990a9ff6ea52bb2032f537faf425c9))

### Features

- **searchresultstore:** adding support for api variants ([f2a9c26](https://github.com/searchspring/snap/commit/f2a9c2624c06c895eb2864a409072f612bae1641))

## [0.66.4](https://github.com/searchspring/snap/compare/v0.66.3...v0.66.4) (2025-06-30)

### Bug Fixes

- **client/cache:** adjust logic for cached flag ([07122cb](https://github.com/searchspring/snap/commit/07122cb967a006009703cc1314b6b1aa0de75b1d))
- **client/cache:** updating logic for array response of recommendation API for \_cached flag ([b6d454b](https://github.com/searchspring/snap/commit/b6d454bbde4fff68378662ac4a67af6243fcf2fb))

## [0.66.3](https://github.com/searchspring/snap/compare/v0.66.2...v0.66.3) (2025-06-27)

### Bug Fixes

- prevent beacon render events upon cached api response ([cca9a83](https://github.com/searchspring/snap/commit/cca9a83b6772548ac5b213ccbbaa666d4284a8dd))
- **searchresultstore.ts:** bugfix for realtime variant selections and case sensitivity ([6641e8c](https://github.com/searchspring/snap/commit/6641e8c1293fb9335d7ded8f543c6d0bbb411c76))

## [0.66.2](https://github.com/searchspring/snap/compare/v0.66.1...v0.66.2) (2025-06-11)

### Bug Fixes

- beacon impression tracking when interacting ([b092b31](https://github.com/searchspring/snap/commit/b092b318ccfa951995225e2aebdbe9d7335fcf41))

## [0.66.1](https://github.com/searchspring/snap/compare/v0.66.0...v0.66.1) (2025-06-10)

### Bug Fixes

- **controller/search:** adjusting code that checks product URL to ensure we check multiple values ([adb5137](https://github.com/searchspring/snap/commit/adb5137040c23bc2315fccc7e9d6779484be9317))
- no results beacon render event ([1925c5f](https://github.com/searchspring/snap/commit/1925c5fdd5a8789702bae3a173ef329cb0bc9012))

# [0.66.0](https://github.com/searchspring/snap/compare/v0.65.2...v0.66.0) (2025-06-09)

### Bug Fixes

- beacon improvements - fix position, refactor closest click, improve ac impressions ([3966c8b](https://github.com/searchspring/snap/commit/3966c8b8cb70506682cf4c92e07c8f02a28169c9))
- infinite scrolling tracking to use correct beacon schema data ([25c13f2](https://github.com/searchspring/snap/commit/25c13f2a97c17734f5d3ca79e02350653952485f))

### Features

- add cart infering, update tracking documentation ([6bdef42](https://github.com/searchspring/snap/commit/6bdef423746486179bb079d78c0776ffedf79875))
- add Swiper scrollbar support to Recommendations component ([00800a1](https://github.com/searchspring/snap/commit/00800a193cb88d65a36c93cc023ed03f360b8d9e))
- add withTracking and useTracking, post beacon launch fixes ([84bab28](https://github.com/searchspring/snap/commit/84bab28c3edf0b1c632226dcb316f6132bf3f56b))
- **preact/components/icon:** adding title to icon component ([a4c620c](https://github.com/searchspring/snap/commit/a4c620cb2497c1b8dd5e6685649c81c6d2bc04c3))

## [0.65.2](https://github.com/searchspring/snap/compare/v0.65.1...v0.65.2) (2025-04-08)

### Bug Fixes

- cypress test - mock beacon response ([3789c21](https://github.com/searchspring/snap/commit/3789c2189c1e99aa214346246aa5e41bac3fb992))
- track tests, refactors ([2b522ee](https://github.com/searchspring/snap/commit/2b522ee256afd624095ab1f200108be8f1324473))

## [0.65.1](https://github.com/searchspring/snap/compare/v0.65.0...v0.65.1) (2025-03-26)

### Bug Fixes

- **tracking:** fixes around beaconjs integration - infinite renders/impressions, q, corrected q ([6a63aa5](https://github.com/searchspring/snap/commit/6a63aa5c23221bb3c7c493bda95bb787b2b827e4))

# [0.65.0](https://github.com/searchspring/snap/compare/v0.64.0...v0.65.0) (2025-03-26)

### Bug Fixes

- remove attribution from Snap.tsx, update integration tests ([ac58a02](https://github.com/searchspring/snap/commit/ac58a0228e87c89f5173d7ae1f2411140c9a14d9))

### Features

- **preact-components:** creating new universal ResultTracker - functionally disabled for now ([dedca16](https://github.com/searchspring/snap/commit/dedca16c5192b8f9e4287201cfa9987c1c276340))

# [0.64.0](https://github.com/searchspring/snap/compare/v0.63.5...v0.64.0) (2025-03-07)

### Bug Fixes

- **controller/search:** altering logic to always store previous results for cases where needed ([d498dee](https://github.com/searchspring/snap/commit/d498dee07919acab21147b6a240608764448f7e9))
- **preact-components/overlaybadge:** adding commonly used styles ([fe8bcd6](https://github.com/searchspring/snap/commit/fe8bcd6b6b8598e3fc13ea26c5f4f2d360e97117))
- **searchcontroller.ts:** bugfix for infinite rerenders and researches when redirecting ([2a4d214](https://github.com/searchspring/snap/commit/2a4d2143d3c73774354bc4386e7ee6c9e9e32c66))

### Features

- **preact-components/dropdown:** adding hover featureset to dropdown component ([20c847b](https://github.com/searchspring/snap/commit/20c847b1ee1100c1a71892e16d22c89c632fbac8))

## [0.63.5](https://github.com/searchspring/snap/compare/v0.63.4...v0.63.5) (2025-02-21)

### Bug Fixes

- **preact:** actually removing use of proxies ([662ad93](https://github.com/searchspring/snap/commit/662ad93082be73a89a6d1fa3bf93e37d7c2b6c01))

## [0.63.4](https://github.com/searchspring/snap/compare/v0.63.3...v0.63.4) (2025-02-20)

### Bug Fixes

- **preact:** reverting mobx proxy change - affected too many sites using custom code ([708adb0](https://github.com/searchspring/snap/commit/708adb0055d63db866da4829effa3efa760f4a25))

## [0.63.3](https://github.com/searchspring/snap/compare/v0.63.2...v0.63.3) (2025-02-14)

### Reverts

- **controller/search:** reverting change for infinite scroll and search due to breaking change ([e27a55d](https://github.com/searchspring/snap/commit/e27a55d8e84e4568b703844fb7a783a8f52d488d))

## [0.63.2](https://github.com/searchspring/snap/compare/v0.63.1...v0.63.2) (2025-02-10)

### Bug Fixes

- **autocompletecontroller.test:** bugfix for autocomplete singleResult redirects w/ inline banners ([dcf8133](https://github.com/searchspring/snap/commit/dcf8133b0de3cfa889f427b6b0dfcf2854696b67))
- **bundleselector.tsx:** change checkbox size from number to px ([fc071fc](https://github.com/searchspring/snap/commit/fc071fc1d7ab10269802e0489185f0b0fb794057))
- **checkbox.tsx:** small refactor to checkbox icon size translating ([d5192bc](https://github.com/searchspring/snap/commit/d5192bc82b12ef4e0dc0e190d33b3cab4ed273f3))

## [0.63.1](https://github.com/searchspring/snap/compare/v0.63.0...v0.63.1) (2025-01-09)

### Bug Fixes

- **store-mobx/recommendationstore:** adjusting config so that `searchOnPageShow` is optional ([1cd4c7c](https://github.com/searchspring/snap/commit/1cd4c7c275b2749d51049f06126c31b2226b94a6))
- **store-mobx/searchresultstore:** fixing issue with inline banners ([836d916](https://github.com/searchspring/snap/commit/836d9162f6679934621df01ac5c8b16f70a995eb))
- **toolbox/getcontext:** adding resiliency to getContext to prevent keyword usage errors ([b3cf7ce](https://github.com/searchspring/snap/commit/b3cf7ce6ba51e6d35b55d466d5fcc0a3367b6976))

# [0.63.0](https://github.com/searchspring/snap/compare/v0.62.0...v0.63.0) (2024-12-19)

### Bug Fixes

- **searchresponse.ts:** bugfix in transformSearchResponse transforming badge fields ([4231094](https://github.com/searchspring/snap/commit/4231094a19932fd920f107286f40a61281d27944))

### Features

- **configuremobx:** auto determine if mobx should useProxies based on webpack build type ([dbef10a](https://github.com/searchspring/snap/commit/dbef10a8727b21d638509b2c0799712b6c1d71e6))
- **preact:** renaming the branch override parameter to `searchspring-preview` ([eee80a0](https://github.com/searchspring/snap/commit/eee80a02608cf4947a562134cf7f5633b07b8624))

# [0.62.0](https://github.com/searchspring/snap/compare/v0.61.5...v0.62.0) (2024-12-10)

### Bug Fixes

- **autocomplete:** merchandising redirect race condition ([65ab3e7](https://github.com/searchspring/snap/commit/65ab3e71630c30a45b4c35a0191e36f97a3dcbfa))
- **controller:** bugfix for controller store loading / loaded states ([a342cd1](https://github.com/searchspring/snap/commit/a342cd1e84c03f9b660a533b327a2f1c12682121))
- **recommendationcontroller:** recommendation backforward cache pageshow event listener ([ca12fd5](https://github.com/searchspring/snap/commit/ca12fd5b3dc0140037701d4d263c626562bdb651))
- **searchresponse.ts:** dont pull out badges with typeof array ([d3b95f5](https://github.com/searchspring/snap/commit/d3b95f5b0a33d97d7bfaad3edfe5bba842dc2764))
- **toolbox/getcontext:** auto-detect variables for evaluation list ([e293acc](https://github.com/searchspring/snap/commit/e293accd91dc72623847ef1fe710290803c6d536))
- **tracker:** correcting issue with `ssViewedProducts` cookie storage ([15655f6](https://github.com/searchspring/snap/commit/15655f6c05bd286d296f3f983a827c46ff976335))
- **urltranslator.ts:** gracefully catch malformed uri errors ([e32f45d](https://github.com/searchspring/snap/commit/e32f45d1a31b3ea3abc544182768e34ae33a9bdb))
- **urltranslator.ts:** pop dont join in parseHashString ([02ea149](https://github.com/searchspring/snap/commit/02ea1497c9d0b4868e872941337445435aeeeec0))

### Features

- **controller:** adding setting in autocomplete to opt out of input and submit binding' ([6980fce](https://github.com/searchspring/snap/commit/6980fcee30220714fd5837770eae725355f81dcf))

## [0.61.5](https://github.com/searchspring/snap/compare/v0.61.4...v0.61.5) (2024-11-13)

### Bug Fixes

- **preact/recommendationinstantiator:** fixing regression of batching in legacy script blocks ([85e339f](https://github.com/searchspring/snap/commit/85e339f6ddff7e0d7aa60360635fe1d7ed0b6122))
- **recommendationcontroller:** send core result data and not active display data in beacon tracking ([1c1754a](https://github.com/searchspring/snap/commit/1c1754a21a365064240cfb7c2433bab2a9b8d52a))

## [0.61.4](https://github.com/searchspring/snap/compare/v0.61.3...v0.61.4) (2024-11-06)

### Bug Fixes

- **controller/search:** fixing typo in warning log ([8b5a2e1](https://github.com/searchspring/snap/commit/8b5a2e1b5c26045930a661d4a76245bbd4f3ee64))
- **controller/search:** modifying logic to prevent warning when the lastRequest is not defined ([5606a22](https://github.com/searchspring/snap/commit/5606a22c6309f4f64c22726f637bddd3f19c9002))
- **preact/recommendationinstantiator:** allowing for invalid shopper integration with legacy script ([66302ef](https://github.com/searchspring/snap/commit/66302ef7d3968a8dec47755cc42ca8c595a8cf52))

## [0.61.3](https://github.com/searchspring/snap/compare/v0.61.2...v0.61.3) (2024-10-31)

### Bug Fixes

- **preact/recommendationinstantiator:** adding back support for legacy usage of seed and product ([93788d4](https://github.com/searchspring/snap/commit/93788d422510adc15840fac987631efe67f76d2e))

## [0.61.2](https://github.com/searchspring/snap/compare/v0.61.1...v0.61.2) (2024-10-28)

### Bug Fixes

- **preact/recommendationinstantiator:** fixing error when globals was undefined ([0f479df](https://github.com/searchspring/snap/commit/0f479dfbd1a98e3668545d22c7e59a90e8f17492))

## [0.61.1](https://github.com/searchspring/snap/compare/v0.61.0...v0.61.1) (2024-10-25)

### Bug Fixes

- **preact/recommendationinstantiator:** legacy script blocks were not merging the context ([0076a0c](https://github.com/searchspring/snap/commit/0076a0cf58a98ae74826feea1e3608dae4fd8af6))

# [0.61.0](https://github.com/searchspring/snap/compare/v0.60.4...v0.61.0) (2024-10-25)

### Bug Fixes

- **preact/instantiator:** adding support for both 'tag' and 'profile' keys ([eaaf668](https://github.com/searchspring/snap/commit/eaaf668973407db1d9c3b781c0f5a3f1fcf58832))

### Features

- **controller/autocomplete:** adding new setting that prevents binding the document click event ([7aaa6ee](https://github.com/searchspring/snap/commit/7aaa6ee4fee39ae7b1a05334270b76d052ce39ca))

## [0.60.4](https://github.com/searchspring/snap/compare/v0.60.3...v0.60.4) (2024-09-25)

**Note:** Version bump only for package @searchspring/snap

## [0.60.3](https://github.com/searchspring/snap/compare/v0.60.2...v0.60.3) (2024-09-25)

**Note:** Version bump only for package @searchspring/snap

## [0.60.2](https://github.com/searchspring/snap/compare/v0.60.1...v0.60.2) (2024-09-24)

### Bug Fixes

- **client/recommend:** adjusting recommend request to merge and de-dupe global parameters ([9e919ab](https://github.com/searchspring/snap/commit/9e919ab8cc73f48276755131541f889be078e186))
- **tracker:** adding stringification prior to trim to prevent error when numbers are provided ([6787188](https://github.com/searchspring/snap/commit/67871881028d92b8097eb9ce764ee1120ca953bf))

## [0.60.1](https://github.com/searchspring/snap/compare/v0.60.0...v0.60.1) (2024-09-12)

### Bug Fixes

- **client/recommend:** adjusting request batching to ensure undefined entries do not overwrite ([5b2e460](https://github.com/searchspring/snap/commit/5b2e4607d3a286bd508c265e782cbc76f92114f7))
- **preact-components/recommendation:** adjusting logic to prevent rendering title with zero results ([bb0212a](https://github.com/searchspring/snap/commit/bb0212a8412ed5337a50be83a95ce3fb24c3bb8d))
- **preact/instantiator/recommendation:** adding fallback selector to support email recs imager ([0201f9d](https://github.com/searchspring/snap/commit/0201f9d7ef4149dce64701e20c2aa145240578f7))

# [0.60.0](https://github.com/searchspring/snap/compare/v0.59.0...v0.60.0) (2024-09-11)

### Features

- **client:** adding support for wildcard cache entries - to be used by email image generator only ([9f59823](https://github.com/searchspring/snap/commit/9f59823e9586235b53315021ab7440d3b309ea3f))
- **recommendationapi:** new Recommendation API Profile Specific Parameters ([0ca961b](https://github.com/searchspring/snap/commit/0ca961bbb1873e8bba26280cddb0c30c4177cfe0))

# [0.59.0](https://github.com/searchspring/snap/compare/v0.58.3...v0.59.0) (2024-08-22)

### Bug Fixes

- **eslint:** fix eslint to allow commits to implementations from monorepo ([c700cbd](https://github.com/searchspring/snap/commit/c700cbd21591533613704898655cdca4b01ec693))

### Features

- **preact-components/recommendation:** adding new lazyRender prop to help improve performance score ([f81e7cb](https://github.com/searchspring/snap/commit/f81e7cbd273650f23d45a60e2e81375656cfe1b5))
- **targeter:** unset of min-height for domTargeter and option to wait for search to render in Snap ([e029b67](https://github.com/searchspring/snap/commit/e029b678c6be946550a9f49bba546d914b3fce07))

## [0.58.3](https://github.com/searchspring/snap/compare/v0.58.2...v0.58.3) (2024-07-31)

### Bug Fixes

- **cartstore:** bugfix for cartstore handling floating 0s for pricing ([9c31166](https://github.com/searchspring/snap/commit/9c311669f0875af758c3a0aba25ce654886e4b96))
- **cartstore:** handle floating 0s in cartstore pricing ([b34e004](https://github.com/searchspring/snap/commit/b34e004a83ff24d0b00e715e4b2177830825d611))
- **preact-components-recommendationbundle:** adding hideSeed prop ([44ab1d6](https://github.com/searchspring/snap/commit/44ab1d622fddb153f97c6f2358bd20b8fe048eff))

### Reverts

- **cartstore:** reverting previous commit that was directly to develop ([5eef09a](https://github.com/searchspring/snap/commit/5eef09a306fd650cc08844ce580d7c02c283451a))

## [0.58.2](https://github.com/searchspring/snap/compare/v0.58.1...v0.58.2) (2024-07-08)

**Note:** Version bump only for package @searchspring/snap

## [0.58.1](https://github.com/searchspring/snap/compare/v0.58.0...v0.58.1) (2024-07-03)

### Bug Fixes

- **cookies:** updating cookies to use domain when calling `unset` function ([b5315c1](https://github.com/searchspring/snap/commit/b5315c128fb77c6cad810f5793dbecf681e85337))

# [0.58.0](https://github.com/searchspring/snap/compare/v0.57.0...v0.58.0) (2024-07-02)

### Bug Fixes

- **checkbox:** checkbox size prop now accepts both string and number ([911cffb](https://github.com/searchspring/snap/commit/911cffbd6dbc1aeb15ec6f2707ecb0ec0226588a))
- **preact-components-carousel:** dont pass breakpoints to swiper ([344e3b8](https://github.com/searchspring/snap/commit/344e3b83c2cdeef84ab973cb1d7b4dce4c62f1d7))

### Features

- **preact-components:** adding ability to have "stacked" badges to overlay and callout badges ([1fd1767](https://github.com/searchspring/snap/commit/1fd1767109cb536c4ceb48273cba1042954dae49))

# [0.57.0](https://github.com/searchspring/snap/compare/v0.56.6...v0.57.0) (2024-06-26)

### Bug Fixes

- **preact-components-carousel:** call updae slide classes onResize to update disabled classnames ([8f80ea2](https://github.com/searchspring/snap/commit/8f80ea224c45c8c0245320d7c906e013309c9a68))

### Features

- **cookies:** add subdomain support ([b907206](https://github.com/searchspring/snap/commit/b9072063374138361123cf8a0f375db93fecb172))
- **tracker:** add currency context, add transactionTotal to order transaction payload ([998bf8e](https://github.com/searchspring/snap/commit/998bf8e8f77ee6667bb680cfd7e6769ec72189fe))

## [0.56.6](https://github.com/searchspring/snap/compare/v0.56.5...v0.56.6) (2024-06-07)

### Bug Fixes

- **platforms/bigcommerce/addtocart:** updating function to work with attributes in new groovy script ([f116681](https://github.com/searchspring/snap/commit/f1166815a6fc94b7d3f4c4cb6637469987012583))
- **store-mobx/searchresultstore:** normalizing variant price data to ensure they are numbers ([09fd97e](https://github.com/searchspring/snap/commit/09fd97ea43d235ed75eef439b676abf1e4f65e17))

## [0.56.5](https://github.com/searchspring/snap/compare/v0.56.4...v0.56.5) (2024-06-03)

### Bug Fixes

- **searchresultstore:** filter out unavailable variants at contruction ([e03b8b1](https://github.com/searchspring/snap/commit/e03b8b19cfe69a5ec3c7939a9591ec2e2c11631d))
- **searchresultstore:** needed to filter out unavailable options even if there are no selections ([207fa48](https://github.com/searchspring/snap/commit/207fa48fdfe38340bcdb6e7901106e4daefdeaff))

## [0.56.4](https://github.com/searchspring/snap/compare/v0.56.3...v0.56.4) (2024-05-28)

### Bug Fixes

- change observer import to mobx-react ([38beec4](https://github.com/searchspring/snap/commit/38beec425bed16d198adfc7ef58ab07c4baf319e))
- **store-mobx/searchresultstore:** adding background property to variant options data ([0d3779c](https://github.com/searchspring/snap/commit/0d3779cafe8829739b04c79348f22725d9b30878))
- **store-mobx/searchresultstore:** adding variant option for backgroundImageUrl ([c6f96e3](https://github.com/searchspring/snap/commit/c6f96e37dfb1c1d7671fc30afa78d30c494810b1))

## [0.56.3](https://github.com/searchspring/snap/compare/v0.56.2...v0.56.3) (2024-05-23)

### Bug Fixes

- **preact-components/overlaybadge:** adjusting styling for better default with custom locations ([208a072](https://github.com/searchspring/snap/commit/208a07228023ff5e5b6892f6b476361a9b99f389))

## [0.56.2](https://github.com/searchspring/snap/compare/v0.56.1...v0.56.2) (2024-05-23)

**Note:** Version bump only for package @searchspring/snap

## [0.56.1](https://github.com/searchspring/snap/compare/v0.56.0...v0.56.1) (2024-05-23)

**Note:** Version bump only for package @searchspring/snap

# [0.56.0](https://github.com/searchspring/snap/compare/v0.55.0...v0.56.0) (2024-05-23)

### Bug Fixes

- **preact/createrecommendationcontroller:** fixing test after typing change ([2bda50b](https://github.com/searchspring/snap/commit/2bda50bfb06477bc90d7f79040005aa94c599efa))
- **store-mobx/cart:** typecasting price and MSRP in cart for edge cases where values are strings ([1627d90](https://github.com/searchspring/snap/commit/1627d90039514e5b5a38b8ed8766d08ee58ad824))
- **store-mobx/searchresultstore:** adding an optional chain for cases when the config is undefined ([b847c18](https://github.com/searchspring/snap/commit/b847c1847c39e040ae619a98d68b71558cf6a6d6))

### Features

- **preact-components-variantselection:** variantSelection & supporting components & option mappings ([f4a4001](https://github.com/searchspring/snap/commit/f4a4001cef1b63c351f3c8f1e8b7ab79242dc4b0))
- **snap-platforms:** snap-platforms added for shopify, bigc, & magento2 ([3fbd797](https://github.com/searchspring/snap/commit/3fbd797a149e08beec5da21407d233c90326350e))

# [0.55.0](https://github.com/searchspring/snap/compare/v0.54.0...v0.55.0) (2024-05-16)

### Bug Fixes

- add right css property to OverlayBadge ([30b4f5a](https://github.com/searchspring/snap/commit/30b4f5a5dd86cd0f397906c0817925e664505524))
- only lift badges if an object ([9db11fb](https://github.com/searchspring/snap/commit/9db11fb9d44798019c7589f3f7be2d66a9522e85))
- pr feedback ([c977223](https://github.com/searchspring/snap/commit/c977223ccfc6c9be649d05028981c2f189b811d6))
- **preact-components-badges:** some small bugfixes to new badge components ([3ba9fd9](https://github.com/searchspring/snap/commit/3ba9fd944cf8e966a7bc7a3f9c42f2dc84d691e6))
- **preact-components/overlaybadge:** restoring lost positioning of the 'right' section (align right) ([fc72bbc](https://github.com/searchspring/snap/commit/fc72bbc2698868f86a3f515a7417f49b3da82eab))
- remove getTag helper ([9cc4a72](https://github.com/searchspring/snap/commit/9cc4a72d96247357a5114adb771b370f5d7fd109))
- remove opacity from BadgePill and BadgeRectangle color default ([0daf2d8](https://github.com/searchspring/snap/commit/0daf2d892fe36c8d3d292b76055815bc85e624ed))
- update badges to latest meta changes ([c06ec17](https://github.com/searchspring/snap/commit/c06ec17e3ef934cb4813b27959c8411b9f9e2bd8))

### Features

- add BadgePill and BadgeRectangle components ([6ffb28b](https://github.com/searchspring/snap/commit/6ffb28b29584f6bd5a5af1755279a0cbfcf03c27))
- badge component cleanup, add tests, storybook files, docs ([fa9c638](https://github.com/searchspring/snap/commit/fa9c6382012188761b5530f59931a60a9073711f))
- initial badge component ([a8aaad9](https://github.com/searchspring/snap/commit/a8aaad91496d7b4808973612fdf818d8db7e10e2))

# [0.54.0](https://github.com/searchspring/snap/compare/v0.53.4...v0.54.0) (2024-05-06)

### Bug Fixes

- **client:** add window checks to NetworkCache ([2c44dc9](https://github.com/searchspring/snap/commit/2c44dc9af5a9425021b9d34c1cc5a88dba23f05b))
- **controller/autocomplete:** fixing issue where searches were being duplicated initially ([595d5c1](https://github.com/searchspring/snap/commit/595d5c14eb877c497c8fa5da3690d6cd2b9f006c))
- **preact-components-carousel:** add backwards compatible classnames on each rerender of carousel ([240d9bf](https://github.com/searchspring/snap/commit/240d9bfee9de5230a48792bee56563328cbfae5b))

### Features

- **client:** adding 'fetchApi' configuration and fallback for windowless environments ([c88da99](https://github.com/searchspring/snap/commit/c88da990c00fcfb223ac10ada387f1e2467addf6))
- **resultstore:** adding setVariants function to give a way to set variant data after initializatio ([5c0c0fb](https://github.com/searchspring/snap/commit/5c0c0fbab2e47c9dfd9f416bb6986cd991b7c809))
- **searchresultstore:** adding ability to pre select variant options ([551055a](https://github.com/searchspring/snap/commit/551055ada41ec6d23930afeb7fd9dacd2fbba272))
- **variants:** adding preselected variants to config. & adding eventManager to Snap Preact ([acac381](https://github.com/searchspring/snap/commit/acac3812771b6e66f89472e65357eeff4a3cb8c1))

## [0.53.4](https://github.com/searchspring/snap/compare/v0.53.3...v0.53.4) (2024-04-22)

### Bug Fixes

- **preact-components-carousel:** bugfix for backwards compatible classnames on carousel re-renders ([0fbbf29](https://github.com/searchspring/snap/commit/0fbbf29134dfedb35bf1327b47673a7e91e9fd36))

## [0.53.3](https://github.com/searchspring/snap/compare/v0.53.2...v0.53.3) (2024-04-10)

### Bug Fixes

- **preact-components-carousel:** changing the default value for autoAdjustSlides to false ([1abe427](https://github.com/searchspring/snap/commit/1abe42754debfacb584a3c4b3650f4de24473faa))

## [0.53.2](https://github.com/searchspring/snap/compare/v0.53.1...v0.53.2) (2024-04-08)

### Bug Fixes

- **preact-components-swiper:** downgrade swiper version to 11.0.7 ([4777277](https://github.com/searchspring/snap/commit/47772770f25a80c0bc5ff4bcd7769ba9ebd44c61))

## [0.53.1](https://github.com/searchspring/snap/compare/v0.53.0...v0.53.1) (2024-04-02)

### Bug Fixes

- **preact-componenbts/carousel:** updating swiper patch version and perview props and classnames ([defe16b](https://github.com/searchspring/snap/commit/defe16bc526fe59d9510c70f84261b821cae7e76))

# [0.53.0](https://github.com/searchspring/snap/compare/v0.52.2...v0.53.0) (2024-04-01)

### Bug Fixes

- **controller/recommendation:** fixing issue with types affecting build ([9a2007a](https://github.com/searchspring/snap/commit/9a2007afeca1656c39dbb3447649d98d93355b6b))
- **preact-components/facetoptions:** modifying facet options components to utilize refinedValues ([9002d17](https://github.com/searchspring/snap/commit/9002d17c72b059fe9c3ab1d32a537b43b39b5c05))
- **store-mobx/storagestore:** fix on localstorage state persistence ([2ae98e6](https://github.com/searchspring/snap/commit/2ae98e6e2c08b1ebfb43bcb905d27fdb20c42e72))
- **toolbox/featureflags:** removing the doNotTrack navigator check due to deprecation ([16bb191](https://github.com/searchspring/snap/commit/16bb19162a407a5ccf103c02f443c53acbcce918))

### Features

- **tracker:** add doNotTrack config options to allow certains events to be excluded ([f9114b0](https://github.com/searchspring/snap/commit/f9114b0b651578543112759573ed8719c7326579))

## [0.52.2](https://github.com/searchspring/snap/compare/v0.52.1...v0.52.2) (2024-03-18)

### Bug Fixes

- **store-mobx/resultstore:** modifying display to leverage mask - adding variant and middleware test ([0eaffd8](https://github.com/searchspring/snap/commit/0eaffd8a6435c71c16e816c5682b20eac0125739))

## [0.52.1](https://github.com/searchspring/snap/compare/v0.52.0...v0.52.1) (2024-03-08)

**Note:** Version bump only for package @searchspring/snap

# [0.52.0](https://github.com/searchspring/snap/compare/v0.51.2...v0.52.0) (2024-03-06)

### Bug Fixes

- **bundledrecommendation:** bugfixes around seedincarousel ([881ad04](https://github.com/searchspring/snap/commit/881ad04ab3e3c5ac77a9d6809a20525c796472cb))
- **preact-components-carousel:** custom swiper navigation support, bc for default nav containers ([abdc4eb](https://github.com/searchspring/snap/commit/abdc4ebab5c0c85c730c7d0ced8226bcc5db39c3))
- **preact-components-carousel:** monkey patching navigation.onprev and onnext functions for swiper ([355b5c0](https://github.com/searchspring/snap/commit/355b5c0073844fd2385b8bd4411025bad31eb0bf))

### Features

- **preact-components-bundlerecommendations:** new component for upcoming bundlerecs feature ([5547094](https://github.com/searchspring/snap/commit/554709406640e6232e525367f1776fd03979fd44))
- **preact-components/carousel:** updating to swiper v11 ([6a7a761](https://github.com/searchspring/snap/commit/6a7a761ce2dda5acd9ca2bef803a87dd6e003e33))
- **product-variants:** adding initial product variants code to the result store ([15208ed](https://github.com/searchspring/snap/commit/15208ed652a73d177618d9c62cfb146f1dcbf173))

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
- **preact-demo:** adding support for all lowercase `siteid` parameter ([71a8574](https://github.com/searchspring/snap/commit/71a8574d94eefdd6d5953f81c734598e632f7e2a))
- **preact-demo:** adding support for all lowercase `siteid` parameter ([d1a49da](https://github.com/searchspring/snap/commit/d1a49da025970b45f526e89b0555f1a5f3d09f8c))

### Features

- **controller/search:** adding ability to fire 'restorePosition' event and 'pageshow' setting ([aa3d447](https://github.com/searchspring/snap/commit/aa3d4477c14aa07ae8d4abc5eea11f4c4ee05a71))

## [0.49.1](https://github.com/searchspring/snap/compare/v0.49.0...v0.49.1) (2023-11-03)

**Note:** Version bump only for package @searchspring/snap

# [0.49.0](https://github.com/searchspring/snap/compare/v0.48.0...v0.49.0) (2023-10-19)

### Bug Fixes

- add options.brands to recommendation instantiator context ([afb6c4d](https://github.com/searchspring/snap/commit/afb6c4d19730fc3e120cc3c9e941a3d223373da8))

### Features

- **client-recommend:** adding filtering to recommendations ([d711f7b](https://github.com/searchspring/snap/commit/d711f7b79237132ec89dfc33c18c2fe3242a1503))
- **recommend:** add recommendation request parameter - options.brands ([a83460e](https://github.com/searchspring/snap/commit/a83460e8101a6700a3a46033770dc30a96ca695c))

# [0.48.0](https://github.com/searchspring/snap/compare/v0.47.0...v0.48.0) (2023-10-11)

### Bug Fixes

- **controller/finder:** altering the beforeFind middleware to ensure redirection is blocked ([936e184](https://github.com/searchspring/snap/commit/936e184ba932fce75b379eeb6e197af0648aac68))

### Features

- add autocomplete settings.redirects.singleResult config ([e620701](https://github.com/searchspring/snap/commit/e620701cb7d528ea4d3fe823bd0104e1bdd73a31))
- icon component path element array, children support ([c8a6c44](https://github.com/searchspring/snap/commit/c8a6c4411636021f49da85c8eeb3e40528998f14))
- move until utility function to toolbox ([d9d4eb3](https://github.com/searchspring/snap/commit/d9d4eb3d4994c30850e5829f1e609755112f5b06))

# [0.47.0](https://github.com/searchspring/snap/compare/v0.46.0...v0.47.0) (2023-09-15)

### Features

- add facet filteredCount getter ([fb507b1](https://github.com/searchspring/snap/commit/fb507b11cdd6d1a825754094d184b289566e7c17))
- add facet globals - limit and valueLimit to search response transform ([f86e04f](https://github.com/searchspring/snap/commit/f86e04f4b6367c4487c1e276fa2cfc002c7d56b9))
- **controller/autocomplete:** changing keyup event to input for better support of copy/paste ([4a95251](https://github.com/searchspring/snap/commit/4a9525117af6bd376da952e0986ccf6efaaad4ce))

# [0.46.0](https://github.com/searchspring/snap/compare/v0.45.1...v0.46.0) (2023-07-24)

### Features

- **client/apis/hybrid:** modifying behavior when ISC is enabled ([86472d5](https://github.com/searchspring/snap/commit/86472d580f3ee94584948ae78efc34dc81c7bb24))
- **store-mobx/autocomplete:** modifying the term store behavior when using ISC ([baf2f71](https://github.com/searchspring/snap/commit/baf2f71f325a3924eadf110b1da23a2d45db61e0))

## [0.45.1](https://github.com/searchspring/snap/compare/v0.45.0...v0.45.1) (2023-06-22)

### Bug Fixes

- allow slideout contents width greater than 90% ([b24ec6a](https://github.com/searchspring/snap/commit/b24ec6ae4aa8bac3c2e1870371137931b8c21ad5))
- slideout component adding overflow preventing scrolling on docs tab ([30da03f](https://github.com/searchspring/snap/commit/30da03fa3628f9d12065389e20edbcca3035baa4))

# [0.45.0](https://github.com/searchspring/snap/compare/v0.44.3...v0.45.0) (2023-06-01)

### Bug Fixes

- **client:** adjusting configuration types which fixes the sub-requester issue for autocomplete ([e3a099c](https://github.com/searchspring/snap/commit/e3a099c1cb48aa3ab09d34c72b3556d5eb2c1f23))
- **controller/search:** modifying the restorePosition functionality to support more use cases ([5d6478c](https://github.com/searchspring/snap/commit/5d6478ca9d7647740939da0ac6cda0b940ab7aec))
- **preact-components/utilities/clonewithprops:** adding optional observability ([450b101](https://github.com/searchspring/snap/commit/450b10173dfc34dbdca8284dd2b136baad9f2dfb))
- **preact-components/utilities/clonewithprops:** reverting to pre 0.43.0 code - no need for observer ([2437be2](https://github.com/searchspring/snap/commit/2437be204e955f0bc17a12fd480288b9b34e3db5))

### Features

- **setinitialurlstate:** new feature to manually set foreground filters in search controller ([bd0588a](https://github.com/searchspring/snap/commit/bd0588aef6ff1093f9b68c3c2122eb5c538157a5))
- **tracker:** adding ability to configur tracker requesters ([b1c3039](https://github.com/searchspring/snap/commit/b1c303955e956be22b8db94067020d75f7ae1162))

## [0.44.3](https://github.com/searchspring/snap/compare/v0.44.2...v0.44.3) (2023-05-08)

### Bug Fixes

- **store-mobx/search/pagination:** removing `pageSizeOptions` from being observed for compatibility ([63ace50](https://github.com/searchspring/snap/commit/63ace50416e787d56a70081b10dc05ea29bb4b71))

## [0.44.2](https://github.com/searchspring/snap/compare/v0.44.1...v0.44.2) (2023-05-08)

### Bug Fixes

- **preact-components-facetslider:** bugfix for slider handle hanging after clear all facets reset ([93c5d6d](https://github.com/searchspring/snap/commit/93c5d6df608a43ecc8b34d5c5baa47b83ae40d49))

## [0.44.1](https://github.com/searchspring/snap/compare/v0.44.0...v0.44.1) (2023-05-05)

**Note:** Version bump only for package @searchspring/snap

# [0.44.0](https://github.com/searchspring/snap/compare/v0.43.1...v0.44.0) (2023-05-05)

### Bug Fixes

- **autocomplete.tsx:** bugfix for emify function when match was at start of term ([8430c5c](https://github.com/searchspring/snap/commit/8430c5c69198359f8397cf25ba0df555e4fe9bbf))
- **controller-search:** fully escaping CSS selectors in restorePosition and adjusting maxCheck ([0b31fe8](https://github.com/searchspring/snap/commit/0b31fe87ab2634cd13bd6144e29ad6cf570c854b))
- **preact-components-autocomplete:** adjusting theme deepmerge to ensure arrays are replaced ([56b57ad](https://github.com/searchspring/snap/commit/56b57adb92689e792c0f0ba728cfaf5e0df61af8))
- **preact-components:** changing the way that theme display settings are merged for breakpoints ([cb660ef](https://github.com/searchspring/snap/commit/cb660ef3cd58e1bd151c5401a17806668d848f15))
- **recommendationinstantiator:** bugfix for improper err logging when rec api call fails ([961ba75](https://github.com/searchspring/snap/commit/961ba75696ff29d77309b3ca7701fe46b664d401))
- **usedisplaysettings.tsx:** fix for useDisplaySettings hook not updating computed breakpoints value ([389bd30](https://github.com/searchspring/snap/commit/389bd30e041ab6969c495e7ee5aec26b8fa2d253))

### Features

- **controller-search:** modifying href selector generation to account for extra spaces and colons ([87bbd8b](https://github.com/searchspring/snap/commit/87bbd8b13720c55dcb551bca14d34873790b7872))
- **searchpaginationstore:** adding configuration for pagination pageSizeOptions ([9937548](https://github.com/searchspring/snap/commit/9937548e24904a825e8d3655890a4d51c3461717))

## [0.43.1](https://github.com/searchspring/snap/compare/v0.43.0...v0.43.1) (2023-04-13)

### Bug Fixes

- **controller-autocomplete:** fixing bugs around autocomplete terms ([a0d6b02](https://github.com/searchspring/snap/commit/a0d6b021073be4b4f3d769d33d8bc55bac2c2f39))

# [0.43.0](https://github.com/searchspring/snap/compare/v0.42.3...v0.43.0) (2023-04-11)

### Bug Fixes

- **autcompletecontroller:** cant call go and preview at the same time ([841db30](https://github.com/searchspring/snap/commit/841db3097c1aeee12ee73e36fcf2628696038fee))
- **preact-components-hook-usedisplaysettings:** allow for computed values in origBreakpoints ([fb03dd3](https://github.com/searchspring/snap/commit/fb03dd327eba03658286208d23467e0e49c2f160))
- **preact-components-results:** fixing theme usage to allow merging theme with breakpoints ([74e6a4a](https://github.com/searchspring/snap/commit/74e6a4ae0f64cb7a3da3299b02b753d0a6c79e17))
- **preact-components:** removing console.log from createHoverProps ([cb56776](https://github.com/searchspring/snap/commit/cb5677698a449b0e46b1ed2674cf7e4f62d2be92))
- **preact-components:** updating cloneWithProps to use observer for reactivity ([d7bb56d](https://github.com/searchspring/snap/commit/d7bb56dd4ac32df92ad0bd413941607ccbc0a746))

### Features

- **preact-components-hooks:** adding new hook 'useDeepCompareEffect' - using in useDisplaySettings ([0eba325](https://github.com/searchspring/snap/commit/0eba325286fc87f154ae05018a71aae416fd9a6a))
- **preact-components-toolbox:** adding 'createHoverProps' a helper function for delayed hover props ([0243e7e](https://github.com/searchspring/snap/commit/0243e7eb64b4dcfa9e11d6f4208e6ef38c0cec35))
- **preact-components:** refactoring to use `previwOnHover` in facet option components and ac ([c82664d](https://github.com/searchspring/snap/commit/c82664d09053e7ad29086c84cae7f9579418c531))

## [0.42.3](https://github.com/searchspring/snap/compare/v0.42.2...v0.42.3) (2023-03-28)

### Bug Fixes

- **autocompletestore:** re-init ac history when setService urlManager is called ([0ff3114](https://github.com/searchspring/snap/commit/0ff311447f13b75240ca3d7e34e616c4eba52b00))
- **store-search-result-store:** adjusting logic for inline banner injection and adding a test ([4ebd069](https://github.com/searchspring/snap/commit/4ebd069198f00059dfc834fef0a5a440f470ca9c))
- **urlmanager-linker-react:** adjusting code so that if an event is not passed it will not error out ([e4a4b62](https://github.com/searchspring/snap/commit/e4a4b6235d5f6b4719b3bddf0a57e1bea118fc0d))

## [0.42.2](https://github.com/searchspring/snap/compare/v0.42.1...v0.42.2) (2023-03-24)

### Bug Fixes

- **store-mobx-finder:** fixing issue where selected persisted data was not being stored properly ([f05730a](https://github.com/searchspring/snap/commit/f05730ac5279050ec8fa236fa364c6ab5e04c878))

## [0.42.1](https://github.com/searchspring/snap/compare/v0.42.0...v0.42.1) (2023-03-07)

### Bug Fixes

- **controller-autocomplete:** adding input attributes to disable 'autocorrect' and 'autocapitalize' ([eaef3cc](https://github.com/searchspring/snap/commit/eaef3ccadf9bc7c6f2fce5842f76bb541663d7eb))
- **controller-autocomplete:** preventing duplicate hidden form fields from being created ([cfd5e68](https://github.com/searchspring/snap/commit/cfd5e688ed8f2c64f63d368444153d9c7d38c9b0))
- **controller-search:** adjusting generateHrefSelector logic to ensure classList value ([3ed5890](https://github.com/searchspring/snap/commit/3ed58903ad6119a64e72d52d964e956c8aed822e))

# [0.42.0](https://github.com/searchspring/snap/compare/v0.41.2...v0.42.0) (2023-03-03)

### Bug Fixes

- **controller-search:** fixing issue where 'restorePosition' would fire returning to previous search ([86a5ca7](https://github.com/searchspring/snap/commit/86a5ca787788c480d649eef6037e52304d2eee50))
- **urltranslator:** url range filters bug fix when using tab manager ([4194261](https://github.com/searchspring/snap/commit/41942616f59428c5935f45175ac048a6244413ca))

### Features

- **a11y hook:** adding new a11y hook to easily add requirements for keyboard nav for ada on element ([9f21708](https://github.com/searchspring/snap/commit/9f21708f8ec7fdb4aca484ba8e9dbffe39e83a94))
- **controller-search:** adding 'restorePosition' setting with offset option ([016586c](https://github.com/searchspring/snap/commit/016586ce826908fe8e8c3f34183edab8378390a2))
- **controller-search:** adding `restorePosition` event and refactoring restoration code ([cf57606](https://github.com/searchspring/snap/commit/cf57606322103cdf7d3884127ea272111c8a1644))

## [0.41.2](https://github.com/searchspring/snap/compare/v0.41.1...v0.41.2) (2023-02-20)

**Note:** Version bump only for package @searchspring/snap

## [0.41.1](https://github.com/searchspring/snap/compare/v0.41.0...v0.41.1) (2023-02-18)

**Note:** Version bump only for package @searchspring/snap

# [0.41.0](https://github.com/searchspring/snap/compare/v0.40.0...v0.41.0) (2023-02-17)

### Bug Fixes

- **autocomplete.tsx:** bugfix for ac history only terms display ([cba01a2](https://github.com/searchspring/snap/commit/cba01a2f1749a4d51cca62efad5d1fc136f156eb))
- **preact-components-autocomplete:** adding logic to close ac when clicking terms, facets, see more ([41d32ac](https://github.com/searchspring/snap/commit/41d32ac54cc07f78d776f53110192d7931e593af))
- **store-mobx-history:** fixing max configuration so that it disables when zero / trims when lowered ([32f8428](https://github.com/searchspring/snap/commit/32f84281710ee0239b73158178c8e879ca7410aa))

### Features

- **recommendationtracking:** components for recommendation beacon tracking profile and results ([9fc8d18](https://github.com/searchspring/snap/commit/9fc8d18a6d0baad6f918bcf4f145b94d507b2617))
- **snap-preact:** adding support for stylesheet removal on branch override ([778f0b6](https://github.com/searchspring/snap/commit/778f0b6d5fcdfd77beba5b668cb3f43d44fa205e))

# [0.40.0](https://github.com/searchspring/snap/compare/v0.39.3...v0.40.0) (2023-02-01)

### Bug Fixes

- **controller-search:** fixing bug with infinite scroll duplicating results with over 500 backfilled ([3453117](https://github.com/searchspring/snap/commit/345311741b2b548e7fb74f9a9e5f448de89fb67b))
- **searchcontroller:** fix for redirects on single results after clearing filters ([f2f9aee](https://github.com/searchspring/snap/commit/f2f9aee078fad6c5a17b35c81d5a1c905b47b88a))
- **tracker:** adding seed for recommendation beacon events in `profile` and `product` event data ([52e31e3](https://github.com/searchspring/snap/commit/52e31e32bf42cc1ed51941bd99e2a151ff2df4b8))

### Features

- **autocompletehistory:** autocomplete history terms feature ([503790c](https://github.com/searchspring/snap/commit/503790c64181bbed591e77990999fa2b6110f1a1))
- **preact-component-slideout:** reverting to old functionality and adding prop `noButtonWrapper` ([56d653d](https://github.com/searchspring/snap/commit/56d653dbb5274ae3162490003eb1ff848e090aff))

## [0.39.3](https://github.com/searchspring/snap/compare/v0.39.2...v0.39.3) (2023-01-31)

### Bug Fixes

- **client:** dereferencing the memory cache so that the cache is not modified by mobx ([4a08102](https://github.com/searchspring/snap/commit/4a08102c76665630656f1024458a0b7f7b6da96a))

## [0.39.2](https://github.com/searchspring/snap/compare/v0.39.1...v0.39.2) (2022-12-29)

### Bug Fixes

- **finder:** allowing persisted data to be reloaded even after the controller has loaded ([45ed052](https://github.com/searchspring/snap/commit/45ed0525cff35cb6c3448c4b1105256922b92d21))

## [0.39.1](https://github.com/searchspring/snap/compare/v0.39.0...v0.39.1) (2022-12-27)

### Bug Fixes

- **finder-store:** adjusting logic to ensure that middleware and plugin changes do not reset persist ([8eb13a1](https://github.com/searchspring/snap/commit/8eb13a1ebc6eac4fff7957c3cdcbdfd7927e78bb))

# [0.39.0](https://github.com/searchspring/snap/compare/v0.38.1...v0.39.0) (2022-12-14)

### Bug Fixes

- **carousel.tsx:** bugfix for carousel when passing pagination prop via breakpoints ([4651269](https://github.com/searchspring/snap/commit/46512695a25774da3f1a9bd9e1d26f22f0e130ff))
- **domtargeter:** adding 'interactive' to document.readyState check ([2826872](https://github.com/searchspring/snap/commit/2826872dbd33249f4a289cfceb7d8f40dc421eac))
- **snap-preact:** adjusting getBundleDetails to allow for local testing of branch override function ([e3d9840](https://github.com/searchspring/snap/commit/e3d9840a53de94619fdc09c3f066044cf4b2362c))
- **snap-preact:** now throwing an error when branch override occurs to prevent instantiation of Snap ([33477fc](https://github.com/searchspring/snap/commit/33477fcbcdd10c933179282f897588595bead8ad))

### Features

- **domtargeter:** adding `clickRetarget` option to allow for automatic retargeting on click event ([c43b966](https://github.com/searchspring/snap/commit/c43b966c6b1240253ec6558b7f2c74b89be98fef))

## [0.38.1](https://github.com/searchspring/snap/compare/v0.38.0...v0.38.1) (2022-11-16)

### Bug Fixes

- **merchandising-docs:** refactoring merchandising component structure to fix docs search 4 readme ([d828100](https://github.com/searchspring/snap/commit/d8281008675370b7a6c40e3e7194c0eee76b9a05))
- **searchcontroller:** backfill page size bugfix ([17fa02a](https://github.com/searchspring/snap/commit/17fa02a7f43b0d83b8dabf403248688088e2be05))
- **searchcontroller:** pre-fetch meta if backfill is set and we dont have the defaultpagesize ([01f8ff4](https://github.com/searchspring/snap/commit/01f8ff4b7c6f36f6869297ae1df678fc1c3e15b9))
- **tracker:** altering beacon login event to send shopperId and userId in event payload ([2ead2bc](https://github.com/searchspring/snap/commit/2ead2bcf6ba9463e78f057b2524eae6d83a9404c))

# [0.38.0](https://github.com/searchspring/snap/compare/v0.37.1...v0.38.0) (2022-10-28)

### Bug Fixes

- **client:** recommendation batching was using param hash forcing batching of unbatched same recs ([39a4754](https://github.com/searchspring/snap/commit/39a47545fa1caee8d82eb20bd3611725390ed6b2))
- **instantiator:** fixing log mode for instantiator created controllers ([d1fe780](https://github.com/searchspring/snap/commit/d1fe780d268e0febc3a4257675e5139c924f5e55))
- **instantiator:** preventing re-instantiation of identically configured controllers when targeting ([7cd9363](https://github.com/searchspring/snap/commit/7cd936397591535cee980ec27afd35c72fbc8b5c))
- **storybook:** stories cant use shared mock data ([0e39f69](https://github.com/searchspring/snap/commit/0e39f696fef6b42511f48e019485ff84097c2f2e))

### Features

- **searchfacetstore:** adding a new config param to disable auto facet collapse handling ([697dd9f](https://github.com/searchspring/snap/commit/697dd9f7ae5a93e261380864e083f96b5e2e583e))

## [0.37.1](https://github.com/searchspring/snap/compare/v0.37.0...v0.37.1) (2022-09-30)

### Bug Fixes

- **autocomplete.tsx:** bugfix for autocomplete border showing before it was done loading ([a5bd682](https://github.com/searchspring/snap/commit/a5bd682d333971d8edc7be099614ef536cbec512))

# [0.37.0](https://github.com/searchspring/snap/compare/v0.36.0...v0.37.0) (2022-09-26)

### Features

- **spell-correct:** initial commit of integrated spell correct feature (missing some testing) ([b4b265f](https://github.com/searchspring/snap/commit/b4b265f31728ca90bc26048b2ba8d458b5a85660))

# [0.36.0](https://github.com/searchspring/snap/compare/v0.35.0...v0.36.0) (2022-09-19)

### Bug Fixes

- **preact-create-autocomplete:** fixing reversion bug that broke initializeFromUrl setting ([fda9884](https://github.com/searchspring/snap/commit/fda98842ff8b3ccde9318f26d4623abf77a0da49))
- **recommendationcontroller.ts:** recommendations personalization for other siteIds ([c6be636](https://github.com/searchspring/snap/commit/c6be6367dc2e76b9fddfa86bda8040f8eb72e5e1))

### Features

- **searchrequest.ts:** adding the ability to disableInlineBanners ([5868195](https://github.com/searchspring/snap/commit/586819543455f384af0fb32b3a8765cf8ba2355e))

# [0.35.0](https://github.com/searchspring/snap/compare/v0.34.7...v0.35.0) (2022-09-01)

### Features

- **getcontext.ts:** grab and return the siteId from the script context or src ([4830560](https://github.com/searchspring/snap/commit/4830560d1522b035d62ab5d4e3534e0371b30ac9))
- **preact-components:** adding new hook 'useConstructor' for easy constructor like behavior ([a249f6a](https://github.com/searchspring/snap/commit/a249f6abb6c0ebca730563af05d9c344e1ae1071))
- **searchstore:** add landingPage to the searchstore ([a7d2c4f](https://github.com/searchspring/snap/commit/a7d2c4fe2740168e436ed865e1a8b85120154691))

## [0.34.7](https://github.com/searchspring/snap/compare/v0.34.6...v0.34.7) (2022-08-19)

**Note:** Version bump only for package @searchspring/snap

## [0.34.6](https://github.com/searchspring/snap/compare/v0.34.5...v0.34.6) (2022-08-19)

**Note:** Version bump only for package @searchspring/snap

## [0.34.5](https://github.com/searchspring/snap/compare/v0.34.4...v0.34.5) (2022-08-19)

### Bug Fixes

- **preact:** fixing an error preventing branch override from functioning ([cdecc76](https://github.com/searchspring/snap/commit/cdecc76fc63ea887f7167cef119a412917802f7c))
- **recommendation.tsx:** bugfix for impression tracking when loop = false ([618357c](https://github.com/searchspring/snap/commit/618357cd7fc7a9b786d3c00aaf56b0a6cd6ec80c))

## [0.34.4](https://github.com/searchspring/snap/compare/v0.34.3...v0.34.4) (2022-08-08)

**Note:** Version bump only for package @searchspring/snap

## [0.34.3](https://github.com/searchspring/snap/compare/v0.34.2...v0.34.3) (2022-08-05)

### Bug Fixes

- **controller-search:** removing scrollRestoration='manual' for better cross browser support ([4f4aab6](https://github.com/searchspring/snap/commit/4f4aab635a882c8c22e83ad59cb5c5d0b1b2cc9d))

## [0.34.2](https://github.com/searchspring/snap/compare/v0.34.1...v0.34.2) (2022-08-04)

**Note:** Version bump only for package @searchspring/snap

## [0.34.1](https://github.com/searchspring/snap/compare/v0.34.0...v0.34.1) (2022-08-04)

### Bug Fixes

- **controllers-search:** combining logic for scroll position storage and restoration ([ec2eb23](https://github.com/searchspring/snap/commit/ec2eb238e98caf0b49bef57c8df56e5e838499b4))

# [0.34.0](https://github.com/searchspring/snap/compare/v0.33.0...v0.34.0) (2022-08-03)

### Bug Fixes

- **searchfacetstore.ts:** account for inline merchandising content when trimming facets ([441fcfe](https://github.com/searchspring/snap/commit/441fcfe748fbef992e8e7391dbe9ac59a73ddd2c))

### Features

- **tracker:** preventing error beacon events in development mode and in certain cases ([51049a9](https://github.com/searchspring/snap/commit/51049a958833caea90d81794af677862c8377a37))
- **tracking:** adding sessionId and pageLoadId to search request params ([e380f27](https://github.com/searchspring/snap/commit/e380f2768ac1071b510ea4a24335b2acd96cb8c4))

# [0.33.0](https://github.com/searchspring/snap/compare/v0.32.0...v0.33.0) (2022-07-22)

### Bug Fixes

- **preact-components-select:** fixing logic with rendering Observables and improving state functions ([38fb7c8](https://github.com/searchspring/snap/commit/38fb7c881446554ba0809a4d86a10d9a849d0df4))
- **preact-components-select:** improving logic for select component and fixing bug preventing render ([64f3a2a](https://github.com/searchspring/snap/commit/64f3a2a6b9d672292f24004a78563acce31715e0))
- **preact:** create function should have been resetting URL on detach for controller ([41797cf](https://github.com/searchspring/snap/commit/41797cf1aa7771130b0f7f45ee5ddf7cbd90acdf))
- **searchcontroller:** use previous response over store.results to not overwrite inline banners ([00cc651](https://github.com/searchspring/snap/commit/00cc651af9434781cb8bcf984a91d344fd572e18))

### Features

- **controller-autocomplete:** adding `serializeForm` setting for picking up additional form params ([3095bb9](https://github.com/searchspring/snap/commit/3095bb939758a97d79457e69741d3a3c1b80458e))
- send beacon error events from middleware errors ([daeba21](https://github.com/searchspring/snap/commit/daeba214facd250505c1bf89ae18588a709244b7))
- **url-manager:** serializeUrlRoot now a required in config; change to order of params and defaults ([feaea8f](https://github.com/searchspring/snap/commit/feaea8f14892411b83625ec8ef82242bc38e4942))
- **url-manager:** using serializeUrlRoot when enabled to set global state ([d828522](https://github.com/searchspring/snap/commit/d8285221144db70c05297a7a433da28b0d0d5278))

# [0.32.0](https://github.com/searchspring/snap/compare/v0.31.0...v0.32.0) (2022-07-19)

### Bug Fixes

- remove empty search object from stringyParams key ([439d7ff](https://github.com/searchspring/snap/commit/439d7ffa0fb0c18658b467cf1eaf19e60c671212))

### Features

- **client:** adding `merchandising.intellisuggest` as a request option ([e809114](https://github.com/searchspring/snap/commit/e8091147ac2fbbd00f828336844f0d0e8bd421df))

# [0.31.0](https://github.com/searchspring/snap/compare/v0.30.2...v0.31.0) (2022-07-13)

### Features

- add restorePosition to infinite config ([4e822cc](https://github.com/searchspring/snap/commit/4e822cce5e164faddb0f283f345e50b20fcfb9ac))
- **searchmerchandisingstore:** transform merch.triggerCampaigns - campaigns & add to store ([e13986f](https://github.com/searchspring/snap/commit/e13986fc239bee7857ffee98dc0c3c602a859d69))

## [0.30.2](https://github.com/searchspring/snap/compare/v0.30.1...v0.30.2) (2022-07-06)

### Bug Fixes

- fix lastStringyParams logic ([9cab5cb](https://github.com/searchspring/snap/commit/9cab5cbbc16529928ae6f55e80a315ad82bbe04d))
- **mobx-store-finder:** removing the `data` property to prevent future access problems ([b523369](https://github.com/searchspring/snap/commit/b52336973614c07a28a93b1fcf5ce465689c0cb2))
- **searchcontroller:** remove search.redirectResponse and personalization when comparing params ([93b40a2](https://github.com/searchspring/snap/commit/93b40a2f9b0c43fe4aefb6ccb5a9cb9c74b76d9d))

## [0.30.1](https://github.com/searchspring/snap/compare/v0.30.0...v0.30.1) (2022-07-02)

### Bug Fixes

- **preact-components:** withStore and withController prop order reversion ([36ba37b](https://github.com/searchspring/snap/commit/36ba37bb8ad9aaa0d8ed7d41aec75c2425a2a881))

# [0.30.0](https://github.com/searchspring/snap/compare/v0.29.0...v0.30.0) (2022-07-01)

### Bug Fixes

- **preact-components-carousel:** adding a `threshold` prop to prevent clicks from dragging swiper ([ff0b4ab](https://github.com/searchspring/snap/commit/ff0b4abc95d59ffc2f7e04d1eccd00de29c7abb4))
- **url-manager:** updating translators to use window.location.pathname when there is no urlRoot ([cbf6997](https://github.com/searchspring/snap/commit/cbf6997d7031c83f2d67bbce5ec4059142bb2c66))

### Features

- **snap:** adding `AppMode` to toolbox and utilizing it to disable caching and add header in client ([48cc911](https://github.com/searchspring/snap/commit/48cc9119a2da9c73de7ceb6b772378aa351ee413))
- **snap:** adding mode switching to snap-preact and controller - removing controller window access ([99a8f21](https://github.com/searchspring/snap/commit/99a8f2176ad803af451e4317e5d98f38303cef1e))
- **tracker.ts:** adding attribution values to tracker context and saving to storage ([1a2c936](https://github.com/searchspring/snap/commit/1a2c93670a2c00ec3c6039a22b8d8e9316b7bfe5))

# [0.29.0](https://github.com/searchspring/snap/compare/v0.28.0...v0.29.0) (2022-06-28)

### Bug Fixes

- **preact:** adding condition to branch override to reload the page when URL is unchanged ([4a4df9e](https://github.com/searchspring/snap/commit/4a4df9ed73e77aa26d24619a49e935d66a35e02b))

### Features

- **tracker:** add error beaconing ([8e687a9](https://github.com/searchspring/snap/commit/8e687a9c5ca16c0f71a55986580ab88190cc9993))

# [0.28.0](https://github.com/searchspring/snap/compare/v0.27.8...v0.28.0) (2022-06-15)

### Bug Fixes

- **autocomplete.tsx:** checking input state to determine visible bool ([1fad14e](https://github.com/searchspring/snap/commit/1fad14e938fb43da77170ccbc0c5e7a0e5657026))
- **client:** fixing deferred resolve ordering when using `options.order` ([d74df0a](https://github.com/searchspring/snap/commit/d74df0a09b51095887460bdf934cce33afa1a3d7))
- load branch override script after branch override component renders ([e8884a9](https://github.com/searchspring/snap/commit/e8884a9f1a10e1a20cdfd86be679eebb27d5efa4))
- **preact-components:** dereferencing breakpoints to prevent multiple carousels from sharing values ([2de6945](https://github.com/searchspring/snap/commit/2de6945e8761b735d038e38bd79a0955ef3d5065))
- remove failing test, assume window.searchspring ([be18438](https://github.com/searchspring/snap/commit/be18438cd64dd1a17aff0f2a16d531c648afc728))

### Features

- **facet:** add searchable prop to facet; Add searchinput component ([b055c32](https://github.com/searchspring/snap/commit/b055c32f91053b241c87a5ffd52fb5138655e0ea))

## [0.27.8](https://github.com/searchspring/snap/compare/v0.27.7...v0.27.8) (2022-06-09)

### Bug Fixes

- **client:** deleting the batch as soon as it begins execution so that new requests don't attach ([35ebeb5](https://github.com/searchspring/snap/commit/35ebeb535e2aba6d4f0bd8cb71e2b5473b2a9dd9))

## [0.27.7](https://github.com/searchspring/snap/compare/v0.27.6...v0.27.7) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap

## [0.27.6](https://github.com/searchspring/snap/compare/v0.27.5...v0.27.6) (2022-06-03)

**Note:** Version bump only for package @searchspring/snap

## [0.27.5](https://github.com/searchspring/snap/compare/v0.27.4...v0.27.5) (2022-05-19)

### Bug Fixes

- **urltranslator:** fixing a bug in the core type that did not allow for proper configuration ([0162342](https://github.com/searchspring/snap/commit/016234246fa19bec4664725346999501008b4571))

## [0.27.4](https://github.com/searchspring/snap/compare/v0.27.3...v0.27.4) (2022-05-09)

**Note:** Version bump only for package @searchspring/snap

## [0.27.3](https://github.com/searchspring/snap/compare/v0.27.2...v0.27.3) (2022-05-09)

### Bug Fixes

- **recommend.ts:** bugfix for batchRecommendations function duplicating params ([f13640c](https://github.com/searchspring/snap/commit/f13640c456d378d30b33843dab66d12611137f6c))

## [0.27.2](https://github.com/searchspring/snap/compare/v0.27.1...v0.27.2) (2022-05-05)

### Bug Fixes

- **searchrequest:** allow queries with leading and trailing spaces ([3cac19d](https://github.com/searchspring/snap/commit/3cac19d8667ff6b1126be6676d10eb4e648c7572))

## [0.27.1](https://github.com/searchspring/snap/compare/v0.27.0...v0.27.1) (2022-05-04)

**Note:** Version bump only for package @searchspring/snap

# [0.27.0](https://github.com/searchspring/snap/compare/v0.26.1...v0.27.0) (2022-05-04)

### Bug Fixes

- **autocompletecontroller:** allow queries with spaces to be submitted ([f3c1c61](https://github.com/searchspring/snap/commit/f3c1c6149dbfde9f9fa68d6eb79ceb17561f96c0))
- **component-branchoverride:** correcting documentation and ensuring 'error' prop takes priority ([1885eb1](https://github.com/searchspring/snap/commit/1885eb19dace0741a68fd07067819aa565a92cd8))
- **recommendationcontroller:** fixing bug which did not allow for instantiator branch param change ([f980cae](https://github.com/searchspring/snap/commit/f980caee18e3625f28b3accfb1dbbe2c18171674))
- **recommendationinstantiator:** changing controller naming structure - object name to 'controller' ([5a373b9](https://github.com/searchspring/snap/commit/5a373b9975cf0d5a7f6d8a9a2b3f6eda930ec21c))
- **recommendationinstantiator:** remove fallback url when creating recs controller ([533785a](https://github.com/searchspring/snap/commit/533785a63924a6266ff2470414242ac0244c64a8))
- **snap-preact:** changing instantiator name to 'recommendation' from 'recommendations' ([1e48228](https://github.com/searchspring/snap/commit/1e48228560e84df7f0515b0f103bcc07eb1ddc99))
- **snap-preact:** move controller import outside of conditional ([340b1f4](https://github.com/searchspring/snap/commit/340b1f4fd4db15e5d1f6c4d6971dc6fe67dce918))

### Features

- **instantiator-recommendation:** param plugin support, services included or passed in constructor ([4baee3c](https://github.com/searchspring/snap/commit/4baee3cb44bdd3900d73d156f7788212f6377d89))
- **snap-preact:** added services as constructor param, async onTarget and heavily refactored ([b1cd990](https://github.com/searchspring/snap/commit/b1cd99061de3176a3554c0f523098a17a0efdc4a))

## [0.26.1](https://github.com/searchspring/snap/compare/v0.26.0...v0.26.1) (2022-04-21)

### Bug Fixes

- **controller-search:** moving param check to after `beforeSearch` event fire ([1a1be22](https://github.com/searchspring/snap/commit/1a1be22abfe788a2497260ed46f304e8592dbccd))

# [0.26.0](https://github.com/searchspring/snap/compare/v0.25.1...v0.26.0) (2022-04-14)

### Bug Fixes

- add parent traversal for attribute tracking, refactor instantiator services ([dc61f52](https://github.com/searchspring/snap/commit/dc61f5212185b814ba5f8f02840a79d7831062e7))
- convert tickSize to number ([7471841](https://github.com/searchspring/snap/commit/7471841a9f35bb609046f0f96a7f8d03c65f342c))
- **facetslider:** prevent chrome from crashing when tickSize <= 0 ([dfecb49](https://github.com/searchspring/snap/commit/dfecb495c99fe0e4e381b1e2d8ec70d526b6b94f))
- **tracker:** add href attribute to attributeList ([1fec898](https://github.com/searchspring/snap/commit/1fec8986843afbddbd466c91191176924114fd11))

### Features

- **recommendationinstantiator:** add cart param to recs context ([9b3d633](https://github.com/searchspring/snap/commit/9b3d633325020187c1472024ca33b8620ba16ab4))
- **snap.tsx:** adding siteId override for branch switch query param ([58b5b56](https://github.com/searchspring/snap/commit/58b5b5616425f1ee01fed5990309961330f2eb81))

## [0.25.1](https://github.com/searchspring/snap/compare/v0.25.0...v0.25.1) (2022-04-11)

### Bug Fixes

- **recommend.ts:** bugfix for batched recommendations not spreading all params ([7b59ad8](https://github.com/searchspring/snap/commit/7b59ad85c0a7b5721e66e76c4dac4f981c50507f))

# [0.25.0](https://github.com/searchspring/snap/compare/v0.24.0...v0.25.0) (2022-04-07)

### Bug Fixes

- **facetslider.stories.tsx:** adding default value for ticksize prop in facetSlider component story ([dfa2590](https://github.com/searchspring/snap/commit/dfa2590ed8c6fe1934f222c4ca14c26fd2543f33))
- **findercontroller:** log beforeFind middleware error ([b117c52](https://github.com/searchspring/snap/commit/b117c525026eb612b96483c95c3dd19f7c4eefe1))

### Features

- add matchType to QueryStore and supporting client transform ([2f01e81](https://github.com/searchspring/snap/commit/2f01e81c0fdf9a1f6cef7203f07d536ae91c8412))
- **controller-finder:** adding persistence configuration and functionality ([eac3ef4](https://github.com/searchspring/snap/commit/eac3ef40fc19c08a4cede96923efe861ffded8d6))
- **wip:** finder persisting ([3a87f9a](https://github.com/searchspring/snap/commit/3a87f9ad73518ad52f2d6b07443226a5a9c1ffd8))

# [0.24.0](https://github.com/searchspring/snap/compare/v0.23.1...v0.24.0) (2022-03-31)

### Bug Fixes

- **errorhandler.tsx:** bugfix for theme spreading in errorhandler component ([f610a23](https://github.com/searchspring/snap/commit/f610a2356c0f416a82cc6cd0e95e49e6e89d46e3))
- **facet-store:** fixing logic around individual facet settings ([663806d](https://github.com/searchspring/snap/commit/663806d2e5bcb075fd7df57ad5cf5d1529c6cbcf))
- **recommendation:** ensure children length matches results or controller.store.results, update docs ([2a957b8](https://github.com/searchspring/snap/commit/2a957b858d68c9c6862327bdaaf2b1213609a0bc))

### Features

- **facet-store:** adding `storeRange` option and allowing for per-facet configuration ([b67248d](https://github.com/searchspring/snap/commit/b67248da94ffeb8d75763ba2f1c68c9bd84066fb))
- **facet-store:** adding `storeRange` option and allowing for per-facet configuration ([f885286](https://github.com/searchspring/snap/commit/f885286db82844fb03bfed0cea4d5ffed63addfe))
- **recommendations:** add results prop to recommendations component, allows for slicing results ([08b438b](https://github.com/searchspring/snap/commit/08b438b25685a563419919991efeea7f87a21629))

## [0.23.1](https://github.com/searchspring/snap/compare/v0.23.0...v0.23.1) (2022-03-21)

### Bug Fixes

- **event-manager:** making the context optional, adding some types to functions and enhancing remove ([0373bfb](https://github.com/searchspring/snap/commit/0373bfb79d43a565e66170eee9d24a38fef667f6))

# [0.23.0](https://github.com/searchspring/snap/compare/v0.22.0...v0.23.0) (2022-03-15)

### Bug Fixes

- **autocompletecontroller.ts:** after removing a query, trending terms show & auto select 1st term ([b514da4](https://github.com/searchspring/snap/commit/b514da407b49c5391a6e5268d7d21d4f2b32a23c))
- **snap-preact:** fixing config services wiring and config merge issue with non-plain objects ([afab290](https://github.com/searchspring/snap/commit/afab290d971b579a3dccdaace755097c0e191e0f))
- **translators:** adjusting class properties to be protected instead of private and re-order config ([df0166d](https://github.com/searchspring/snap/commit/df0166dd52abb9b6d76b8f49f58dbb29e2e5bff7))

### Features

- **autocomplete-controller:** change the use of `config.action` and utilize UrlManager for URL ([f89c02f](https://github.com/searchspring/snap/commit/f89c02fddfd12bfb9381246f65b107c5958587a5))

# [0.22.0](https://github.com/searchspring/snap/compare/v0.21.1...v0.22.0) (2022-03-09)

### Bug Fixes

- **facetstore:** altering logic to ensure meta and facet details are in agreement ([efd9ceb](https://github.com/searchspring/snap/commit/efd9cebee93ea65b9b218160d23303f0215ab573))

### Features

- **autocomplete:** ac showResults config prop for showing trending term results ([7a1d71e](https://github.com/searchspring/snap/commit/7a1d71e2f15c2beff4c9403cb348a017d41f64a3))
- **client:** adding 'facets.autoDrillDown' request parameter to transformer ([1726235](https://github.com/searchspring/snap/commit/1726235c56ceef0b3bdaa28efe0a0e1fa5229241))
- **findercontroller:** adding default parameters to use 'facets.autoDrillDown' by default ([fa2df7e](https://github.com/searchspring/snap/commit/fa2df7e2639abc3d087b399c80f757a6455e9dbe))

## [0.21.1](https://github.com/searchspring/snap/compare/v0.21.0...v0.21.1) (2022-03-01)

### Bug Fixes

- **autocomplete.tsx:** breakpoints prop should override theme prop ([193f5a8](https://github.com/searchspring/snap/commit/193f5a8bf4ae0742a760217e1039cf18d8d0119d))
- **autocomplete.tsx:** bugfix for autocomplete breakpoints prop not working ([d9472fd](https://github.com/searchspring/snap/commit/d9472fdb53da4b6a16ba559cb02c0a6cfe31bafc))
- **snap.tsx:** use the merged config when creating a recommendationInstantiator ([f14c679](https://github.com/searchspring/snap/commit/f14c6790ddc8386c64ec8e86f2e50b708a657885))

# [0.21.0](https://github.com/searchspring/snap/compare/v0.20.5...v0.21.0) (2022-02-25)

### Bug Fixes

- add limit to RecommendationInstantiatorConfig type ([e5bb19d](https://github.com/searchspring/snap/commit/e5bb19da4ab11003249fd3480f9e515b2e8287d1))
- allow for limits param in recommendations globals or context ([bb09402](https://github.com/searchspring/snap/commit/bb094024c158601d95e979868a33174ab8132783))
- **client:** adding 'deepmerge' as a package dependency ([835802f](https://github.com/searchspring/snap/commit/835802ff31e053a75e66d5cd39953f55658d3531))
- deepmerge recommendations context globals with config and defaults ([ade3377](https://github.com/searchspring/snap/commit/ade337717d6717f96ecdf79b16bcff11f1c6df31))
- **facetstore.ts:** stringify facet value in facet url ([26dc5f8](https://github.com/searchspring/snap/commit/26dc5f818f4d485e617d67c4eeb7d4a0b8a821dd))
- **featureflags:** updating cookie feature flag logic to properly utilize the 'doNotTrack' flag ([96e8603](https://github.com/searchspring/snap/commit/96e8603f4124b9a07af0675241d010656788be75))
- hide carousel prev/next buttons if hideButtons instead of removing ([4a1c41d](https://github.com/searchspring/snap/commit/4a1c41de0a6be783a0b68027a0c20a4f8dbbb470))
- pr feedback - add default limit, update types and docs ([9b9124a](https://github.com/searchspring/snap/commit/9b9124ad3f048f8ca910e53841eb62283bb355c9))
- pr feedback: rename finder id, add config.url assertion on page change ([6c68f8f](https://github.com/searchspring/snap/commit/6c68f8faf1c6f46e795e673b3ecb13a080a4d469))
- **recommendationinstantiator:** fix shopper.id ([1b7715a](https://github.com/searchspring/snap/commit/1b7715a5e71797302af160b5d5aad3bf54e7fccb))
- remove limit, rename limit -> limits in config, refactor batching limits logic ([58b4302](https://github.com/searchspring/snap/commit/58b43026e2f8af7ba262091553dac7dd49af0f9f))
- **result.tsx:** changing from onMouseDown to onClick to fix recommendation onclick prop not working ([fa77195](https://github.com/searchspring/snap/commit/fa771953c4b4d45088991234306b5e17f74e075d))

### Features

- add custom space to recommendations instantiator context variables ([d05d35b](https://github.com/searchspring/snap/commit/d05d35b0bc84ac123ece803d821a96de24a008f2))
- add personalization preflightCache to Tracker, move charsParams to toolbox ([85cc74d](https://github.com/searchspring/snap/commit/85cc74d4a5d3b7ddc36827b7f2c1d9a3f08217a9))
- **carousel.tsx:** breakpoints bugfix, new autoAdjustSlides prop added ([bcd06a2](https://github.com/searchspring/snap/commit/bcd06a23ee522144f3ade7a8e3a94326a6b6c51e))
- **getcontext:** alter getContext to noly pull attributes as requested via 'evaluate' parameter ([9c51dd0](https://github.com/searchspring/snap/commit/9c51dd03eab78ede5757a89cc237f4530429bda6))
- **preact-components:** adding onClick props on organisms to tie into children onClick functions ([69449ae](https://github.com/searchspring/snap/commit/69449ae95031e698e794ee147f257ed29dc1e6ac))

## [0.20.5](https://github.com/searchspring/snap/compare/v0.20.4...v0.20.5) (2022-02-25)

**Note:** Version bump only for package @searchspring/snap

## [0.20.4](https://github.com/searchspring/snap/compare/v0.20.3...v0.20.4) (2022-02-02)

### Bug Fixes

- **tracker:** remove preventDefault from attribute click event listener ([09734c9](https://github.com/searchspring/snap/commit/09734c9252dbaed8d9a453e8de7ed1c0f55accce))

## [0.20.3](https://github.com/searchspring/snap/compare/v0.20.2...v0.20.3) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap

## [0.20.2](https://github.com/searchspring/snap/compare/v0.20.1...v0.20.2) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap

## [0.20.1](https://github.com/searchspring/snap/compare/v0.20.0...v0.20.1) (2022-02-02)

**Note:** Version bump only for package @searchspring/snap

# [0.20.0](https://github.com/searchspring/snap/compare/v0.13.5...v0.20.0) (2022-02-01)

### Bug Fixes

- add promise polyfill ([c698b76](https://github.com/searchspring/snap/commit/c698b76078dd23ad13b528f4da74e28233d0cff3))
- add realtime type to RecommendationInstantiatorConfig ([eee7a1a](https://github.com/searchspring/snap/commit/eee7a1a9c13d270aae7dafa0d35181d8eb75baab))
- **client:** batch recommendations by siteId instead of params ([36d7f84](https://github.com/searchspring/snap/commit/36d7f84f5162b4b9eaade51be92e18d3134dbb9f))
- **controller-finder:** fixing bug with reset and hierarchy types of finders ([cb94ebd](https://github.com/searchspring/snap/commit/cb94ebd42f5481a8108f2d4d1575e5eb679552f8))
- **facetslider:** bugfix for slider that causes it to set lower and upper range to zero ([3a51f5d](https://github.com/searchspring/snap/commit/3a51f5db41a14e76c4d66a62498a46da5718d38a))
- **index.html:** switched to http-server to fix blank storybook bug, attempting to fix iframe render ([e693a3a](https://github.com/searchspring/snap/commit/e693a3a6e1e90803dcc3cf8cf9764d88d9675eb0))
- refactor polyfill to es5 syntax ([5cad0bd](https://github.com/searchspring/snap/commit/5cad0bd2b120aab9adc40d2998a58b292bb6215b))
- remove fetch and core-js from polyfills ([6a371aa](https://github.com/searchspring/snap/commit/6a371aac0a417011b3b76d26a723c66a5b84502a))
- remove unused variable ([9a5b13a](https://github.com/searchspring/snap/commit/9a5b13ad77ba72911dd48a35060a8618e1d5a734))
- **resultstore:** remove mappings from children, refactor Variant to Child ([816dcd3](https://github.com/searchspring/snap/commit/816dcd3d3c6c76b36ba1d0274b01174d7f9ba453))
- **snap-docs:** bugfix for firefox ss logo image sizing in doc app ([f13672c](https://github.com/searchspring/snap/commit/f13672c194aeaa3667afcb6d9789ddf95e51c6c0))
- **tracker.ts:** added config for tracker namespace, force all controllers to use same namespace ([6f8bd2f](https://github.com/searchspring/snap/commit/6f8bd2ff6ca04dabff5aa70f363452f0b287fc07))

### Features

- add batched config and context setting to disable batching ([d4c0ac2](https://github.com/searchspring/snap/commit/d4c0ac28d1bd220df0fac948dbb77b4dc5c4504e))
- add polyfills export to snap preact ([a841f39](https://github.com/searchspring/snap/commit/a841f395997897319fc7827c7241afa4eeb83b2a))
- add realtime config, add cart to context, refactor attribute names ([789dcd3](https://github.com/searchspring/snap/commit/789dcd34cc298340618c3debeb144524d7ff1b66))
- **image:** add onError event, fix onLoad event param ([ce353c5](https://github.com/searchspring/snap/commit/ce353c54245b650dd5e9764b1bc88894a7e1bbd0))
- **networkcache.ts:** added network request caching and support to config ([bc11c14](https://github.com/searchspring/snap/commit/bc11c14e92119f204bbbd1c27f51709e8d49fe92))
- **networkcache:** added memory caching ability to networkcache, removed meta getter, refactoring ([e70744d](https://github.com/searchspring/snap/commit/e70744d4a8749435cff1e0fcc599e5a2d5c30c6c))
- **resultstore:** add children variant support to resultStore ([a911b6f](https://github.com/searchspring/snap/commit/a911b6fe12ef1b2d036b1198aecb502887b54be8))
- **tracker:** finalize attribute tracking for add to cart, remove, clear ([b5bf033](https://github.com/searchspring/snap/commit/b5bf033d6ccf171980bafa1cd9b4b7ba93015ac0))
- **tracker:** wip: add initial cart attribute tracking ([5036896](https://github.com/searchspring/snap/commit/5036896f1022ccd9801946559e0762de36668363))

## [0.13.5](https://github.com/searchspring/snap/compare/v0.13.4...v0.13.5) (2022-01-31)

### Bug Fixes

- **tracker:** use native localStorage for getUserId ([782a285](https://github.com/searchspring/snap/commit/782a285748e8ae7272f1462cfd2ca3f339ea7d0f))

## [0.13.4](https://github.com/searchspring/snap/compare/v0.13.3...v0.13.4) (2022-01-31)

### Bug Fixes

- **tracker:** refactor getSessionId to match is.js native interface instead of StorageStore ([b5224de](https://github.com/searchspring/snap/commit/b5224de77eedc45c204af3e0bf64159c0b7891c6))

## [0.13.3](https://github.com/searchspring/snap/compare/v0.13.2...v0.13.3) (2022-01-07)

### Bug Fixes

- **autocomplete:** pass down banner subProps ([8036a20](https://github.com/searchspring/snap/commit/8036a2092b22c98f34cbfd8d2b7010a3d4241d62))
- **getparams:** added a null check for range filters with null low values ([af1bbf1](https://github.com/searchspring/snap/commit/af1bbf1b765ec278fd49e677bc6a91ab5fcb8408))
- **hybrid.ts:** use suggested query before spell corrected query ([a8792ce](https://github.com/searchspring/snap/commit/a8792cea26b3659654792d19541405e652a7e0e5))

## [0.13.2](https://github.com/searchspring/snap/compare/v0.13.1...v0.13.2) (2021-12-29)

### Bug Fixes

- **autocomplete-controller:** when spell correction is used the controller will wait for response ([0d65093](https://github.com/searchspring/snap/commit/0d650935ac0c310595fcb6d8e1843cb703afbd25))

## [0.13.1](https://github.com/searchspring/snap/compare/v0.13.0...v0.13.1) (2021-12-22)

**Note:** Version bump only for package @searchspring/snap

# [0.13.0](https://github.com/searchspring/snap/compare/v0.12.0...v0.13.0) (2021-12-14)

### Bug Fixes

- **domtargeter.ts:** removing interactive so scripts loaded with defer tag wait for DOMContentLoaded ([10b9ca3](https://github.com/searchspring/snap/commit/10b9ca3ee8a3ad563f01e1b919d433c2f2fb725e))
- **preact-component-image:** changing useRef to have a default empty string value ([e679aed](https://github.com/searchspring/snap/commit/e679aed6461efa7bd7371b44388d10743d28033a))
- **searchrequest:** add missing tracking.domain search request param ([45afe2d](https://github.com/searchspring/snap/commit/45afe2d089b0d172290e36854a89998bb607c019))
- **snap-preact:** fixing issue in getController after making SearchController creation synchronous ([bb25898](https://github.com/searchspring/snap/commit/bb258989ce4e4b0546df4b6169d84bb210b24694))
- **sortingstore:** remove duplicate sort options ([3723b8a](https://github.com/searchspring/snap/commit/3723b8a436e0f9302db822fe64b9ff2fc1bf739e))
- **toolbox-getcontext:** making the function more robust and not requiring innerHTML ([f62a284](https://github.com/searchspring/snap/commit/f62a28416f5abe2daead261d108a8e39c0871b5f))

### Features

- **snap-preact:** adding context to the window global ([1e10921](https://github.com/searchspring/snap/commit/1e109216a1430259690518c14332c333da6fb5b7))
- **snap.tsx:** adding Skeleton template support and examples ([ac426bc](https://github.com/searchspring/snap/commit/ac426bcc7ef2794a747183a21e8e89d70bcf40e1))
- **tracker:** adding ability to track using script tags ([b655062](https://github.com/searchspring/snap/commit/b65506258ebc8845af0fb5c19efbf159e045e60d))

# [0.12.0](https://github.com/searchspring/snap/compare/v0.11.0...v0.12.0) (2021-11-19)

### Bug Fixes

- **facetslider-component:** adding 'type="button"' to slider handles to prevent form submission ([86f3909](https://github.com/searchspring/snap/commit/86f39094725cd94de25ffb14145fc14ee5af332d))
- **filtersummary.tsx:** onClearAllClick should clear the page by default ([de8f78e](https://github.com/searchspring/snap/commit/de8f78e32d992c83498bb6212059b175f7b78de8))
- **searchcontroller:** search redirect bugfixes when filters are applied ([95c4edb](https://github.com/searchspring/snap/commit/95c4edb2016045d92bfeb84354e34269af05cda8))
- **storagestore:** fallback to empty object when get() does not find anything ([f6e3c13](https://github.com/searchspring/snap/commit/f6e3c131f51398331892da353a27c5e6491ad721))

### Features

- getContext, update tests, refactor components out of branchOverride ([717bd8b](https://github.com/searchspring/snap/commit/717bd8bdaade6c532f02bad376b10b69a0ac445c))
- **result:** added new hideImage prop to result & autocomplete to hide the product image ([c7c2032](https://github.com/searchspring/snap/commit/c7c2032c1000d37651da213be0004757aa2fab72))
- **snap-preact:** updated BranchOverride with dynamic import, themes and display date modified ([2ac155d](https://github.com/searchspring/snap/commit/2ac155d7bf35ac17bb49993e0d2691b7f484a5c2))
- **snap-preact:** work towards making branch bundle switching occur client side (instead of lambda) ([43a9f25](https://github.com/searchspring/snap/commit/43a9f251da4d743168fb0cde0fd8a7517b649798))

# [0.11.0](https://github.com/searchspring/snap/compare/v0.10.0...v0.11.0) (2021-10-29)

### Bug Fixes

- **autocomplete-component:** changing 'facetsToShow' to always be an array ([df3a59f](https://github.com/searchspring/snap/commit/df3a59f4a941f00d74e6aaad155049dd1a681fb1))
- **client:** add retry logic for 429 rate limited requests ([e443efa](https://github.com/searchspring/snap/commit/e443efaca3c5155c60c9c1b0f33c66c21901f2bd))
- **facet:** bugfix for issue [#231](https://github.com/searchspring/snap/issues/231), Issue when switching between slider and list types ([21c97c5](https://github.com/searchspring/snap/commit/21c97c51a6c8b33e0bcbfae0e63e504bfc9623b6))
- **theme:** add message colors to default theme ([782155c](https://github.com/searchspring/snap/commit/782155c2f4068124496b57ab96bb3b8d44e7191c))

### Features

- **errorhandler:** add ErrorHandler Component, updated icons ([6d50f84](https://github.com/searchspring/snap/commit/6d50f84b098f2e3d31b712236d945946828e3443))
- **facet.tsx:** added optionsSlot & fields props to facet component ([09846c0](https://github.com/searchspring/snap/commit/09846c0a87cf422bf83dea4526e06b8e72274071))
- modify retry delay to fibonacci algo, modify error code handling of request failures ([50613da](https://github.com/searchspring/snap/commit/50613da92db014552f3ff6a529fb742b4559cc02))

# [0.10.0](https://github.com/searchspring/snap/compare/v0.9.7...v0.10.0) (2021-10-15)

### Bug Fixes

- **autocomplete:** add theme prop deepmerge to results subprop ([ac21190](https://github.com/searchspring/snap/commit/ac21190aa3fbc9f6bbc18a191d9e8cda40547fd1))
- **autocomplete:** deepmerge default subprop with theme props ([616aaba](https://github.com/searchspring/snap/commit/616aabad4d5dbc0904938891750cc82f4ca9f056))
- **autocomplete:** deepmerge prop theme with breakpoint theme ([ae0717f](https://github.com/searchspring/snap/commit/ae0717f96f15e722b0bb34df30d0f1ac54dcb10f))
- **querystore:** fixing 'rq' and 'oq' bug where they were only using the first letter of value ([2d5faec](https://github.com/searchspring/snap/commit/2d5faecb76dac3b0ad2cda3b557eba902036bcb3))
- remove duplicate subprop class ss**autocomplete**facets ([0ba88b5](https://github.com/searchspring/snap/commit/0ba88b5163996cfb2351d00bdd3f4d0267b2bfad))
- remove redundant globals, update docs with link to api docs ([b679a3a](https://github.com/searchspring/snap/commit/b679a3aa53c730a3caf96b22af2ab4badf69d4e4))

### Features

- add personalization params and transforms to search and autocomplete request params ([05c709d](https://github.com/searchspring/snap/commit/05c709dc0d11e145cf3837d76414c0efe0423286))
- **autocomplete:** add linkSlot & hideLink props, update docs, add props to facetsSlot & termsSlot ([81547f0](https://github.com/searchspring/snap/commit/81547f013eb1e68671653ebc19efa5711ecc65dc))
- **facets:** add limit prop to Facets component, refact Autocomplete to use Facets ([de36bcc](https://github.com/searchspring/snap/commit/de36bcc76a65f4993321b536133281d6ee02edba))

## [0.9.7](https://github.com/searchspring/snap/compare/v0.9.6...v0.9.7) (2021-10-08)

### Bug Fixes

- **autocomplete-controller:** added a timeout to ensurethe focus event occurs after click event ([1a23f23](https://github.com/searchspring/snap/commit/1a23f23abca4e4fe8bd7b95973fd1abd4c2ff813))
- **autocomplete-controller:** removing console logs ([3c73561](https://github.com/searchspring/snap/commit/3c735616314202c44ca9ebeea3a505c48b095518))
- **snap-preact:** preventing multiple bindings ([d25c4c4](https://github.com/searchspring/snap/commit/d25c4c464cca582aedc7d769a68cf6a741ff9478))

## [0.9.6](https://github.com/searchspring/snap/compare/v0.9.5...v0.9.6) (2021-10-07)

**Note:** Version bump only for package @searchspring/snap

## [0.9.5](https://github.com/searchspring/snap/compare/v0.9.4...v0.9.5) (2021-10-06)

**Note:** Version bump only for package @searchspring/snap

## [0.9.4](https://github.com/searchspring/snap/compare/v0.9.3...v0.9.4) (2021-10-05)

### Bug Fixes

- **autocomplete-component:** adding missing 'valueProps' prop to facetsSlot ([60ea6f8](https://github.com/searchspring/snap/commit/60ea6f8027268efe25ff5a359b12b2103c417693))
- **facet-component:** adding overflow slot ([0dd2b69](https://github.com/searchspring/snap/commit/0dd2b69885e4cca9b80bff61cda698b38663f60f))
- **facet-component:** removing 'hideIcon' prop and renaming the overflow icons ([0279f6e](https://github.com/searchspring/snap/commit/0279f6ef156d635338c74d0c59286f0c4c9a80f3))

## [0.9.3](https://github.com/searchspring/snap/compare/v0.9.2...v0.9.3) (2021-10-01)

### Bug Fixes

- **dev-cookie:** dev cookie name did not conform to other cookie names 'ssXxx' ([0addc52](https://github.com/searchspring/snap/commit/0addc52b2c72c09a017e573d5685881ebf634e91))
- **paginationstore:** adding support for totalPages in the pagination store ([a867ea4](https://github.com/searchspring/snap/commit/a867ea4e6cc02b2360f281247c5c18c738cc1070))
- **recommendation-controller:** removing duplicated config.globals merge on params ([2782025](https://github.com/searchspring/snap/commit/2782025b4f2023bb69bfb8cb28cf244065687b76))
- **snap-preact:** unifying interface to get recommendations instantiator ([14f4c01](https://github.com/searchspring/snap/commit/14f4c0122349c8d1aca258ad2eebd2f85107b246))
- **urltranslator:** remove core parameters that have empty values ([d48211a](https://github.com/searchspring/snap/commit/d48211a935d82bc89ac3c33ac37bbabe606832f1))

## [0.9.2](https://github.com/searchspring/snap/compare/v0.9.1...v0.9.2) (2021-09-29)

### Bug Fixes

- **snap-preact:** adding controller to onTarget; fixing url params in createController ([c9e65e5](https://github.com/searchspring/snap/commit/c9e65e56acc11ab9b51c9d58725dde63f9bc97b2))

## [0.9.1](https://github.com/searchspring/snap/compare/v0.9.0...v0.9.1) (2021-09-29)

### Bug Fixes

- **client-recs-api:** enabling POST/GET change based on payload size ([0126736](https://github.com/searchspring/snap/commit/0126736c0b8121d5edd5a3a2e3145ae0eeb5c9c3))
- **recommendation-instantiator:** instantiator template component, add selector and allowing '-' ids ([50b3e34](https://github.com/searchspring/snap/commit/50b3e3441ffb67edf3db281b9e9552c9bb339d10))

# [0.9.0](https://github.com/searchspring/snap/compare/v0.8.0...v0.9.0) (2021-09-28)

### Features

- code splitting work in progress, add finder to demostore ([15c55a9](https://github.com/searchspring/snap/commit/15c55a9a72d9c497b66fc6a2c1744bb318236aa8))

# [0.8.0](https://github.com/searchspring/snap/compare/v0.7.3...v0.8.0) (2021-09-17)

### Bug Fixes

- rename handleTextColor to valueTextColor and apply to non-sticky handles also ([33d3370](https://github.com/searchspring/snap/commit/33d3370a81ff2aaca0c81e51b410bf959111bfd4))

### Features

- **dynamic-import:** change to snap config for components utilizing return from function ([83929ee](https://github.com/searchspring/snap/commit/83929eea52324e5ca197dbf9ac6bac208d06fc59))

### Performance Improvements

- work in progress for getting dynamic importing ([93d095b](https://github.com/searchspring/snap/commit/93d095b5e56bb72438b73ac1a4b8087c3da6e46c))

## [0.7.3](https://github.com/searchspring/snap/compare/v0.7.2...v0.7.3) (2021-09-15)

### Bug Fixes

- **facet-hierarchy-options-component:** fixing typo with theme props ([fae326c](https://github.com/searchspring/snap/commit/fae326cf370381af60dd90ce9af43ba45b787a22))

## [0.7.2](https://github.com/searchspring/snap/compare/v0.7.1...v0.7.2) (2021-09-13)

### Bug Fixes

- **package-lock.json:** fixing some tests and errors related to package updates ([55ade00](https://github.com/searchspring/snap/commit/55ade000ac02e0a712b1d34486f885b975de7ba8))

## [0.7.1](https://github.com/searchspring/snap/compare/v0.7.0...v0.7.1) (2021-09-10)

### Bug Fixes

- **facet-component:** using handleize filter for classname of palette option ([b694cf9](https://github.com/searchspring/snap/commit/b694cf9cc85d4e86f1eb2ca0ee24319c438710d1))
- **snap-client:** client support for siteId swap (using proper subdomain) for meta ([7607072](https://github.com/searchspring/snap/commit/7607072f4d0fc4f4d4c9b4bc102628ae2338aa3e))

# [0.7.0](https://github.com/searchspring/snap/compare/v0.6.2...v0.7.0) (2021-09-09)

### Bug Fixes

- **(carousel/recommendation)-component:** adding support for vertical pagination ([eb24284](https://github.com/searchspring/snap/commit/eb24284a0ea79a1bd9fa325f6a054e05f26eaefb))
- **facet-slider-component:** adjust margin to prevent overflow scroll ([d6a89dd](https://github.com/searchspring/snap/commit/d6a89dd1ff4d4329818bd33284349b6034e1a929))
- **facet-slider-component:** handling overflow with all prop options ([952b261](https://github.com/searchspring/snap/commit/952b2610bff32bde966214f8b69ebc95396ded68))
- **facet-slider-component:** small change to remove min-height ([2fe3ed8](https://github.com/searchspring/snap/commit/2fe3ed81435240d625345218babb9aa32ae16383))
- **facetslider.tsx:** bugfix for slider handle labels overflowing when handle is at the ends of rail ([3c43b4c](https://github.com/searchspring/snap/commit/3c43b4c94d4497b27eb10428d3bccc01924947b5))
- **facetslider:** increase label spacing if showTicks enabled ([ef0be4f](https://github.com/searchspring/snap/commit/ef0be4f42f3958f5f22a644ee44a01ffeab328d0))
- **pagination-store:** fix to setPageSize method to remove the current page ([4996d66](https://github.com/searchspring/snap/commit/4996d6657f31cda1102de2c1df7edde19d4e1b5c))
- **recommendation.tsx:** recommendation component was not using the global theme ([ce5da93](https://github.com/searchspring/snap/commit/ce5da938d4f112909e7947c69ced024f51aedcf8))
- **search-request:** add siteId to search request params ([af68f5a](https://github.com/searchspring/snap/commit/af68f5a61bd259bf1ee5244573edc55f710462b7))
- **select.tsx:** add support for native styling ([81228fb](https://github.com/searchspring/snap/commit/81228fbd8aae41485b7a445531ce4c8b5019d46d))

### Features

- **carousel.tsx:** new feature to support vertical carousels ([466d211](https://github.com/searchspring/snap/commit/466d21147b4ded1d5c4061e12305f6f326b590fe))
- **facetslider.tsx:** prop for sticky handle labels ([c6974f0](https://github.com/searchspring/snap/commit/c6974f0446d177a39e8586c74a99e6ac1232ee0a))
- **theme prop:** theme prop refactor ([641fc44](https://github.com/searchspring/snap/commit/641fc44d2df1efd8353e541bb880b08cb21c2a2e))
- **url-translator:** changes to translator - urlRoot params, value-less params and settings changes ([0022ff0](https://github.com/searchspring/snap/commit/0022ff03b0ce3f64b7971c559fb0020e17b6a891))
- **url-translator:** making urlTranslator fully customizable via name and type for all parameters ([f5194f5](https://github.com/searchspring/snap/commit/f5194f53b6d678ef4df1300ff5dab93fda206634))

## [0.6.2](https://github.com/searchspring/snap/compare/v0.6.1...v0.6.2) (2021-09-03)

### Bug Fixes

- **client-translator:** preventing NaN on price core fields when undefined ([f5ece91](https://github.com/searchspring/snap/commit/f5ece9195affedf565452f46ee3b0e9660a646f3))
- **formatnumber:** fixing case of NaN and no longer returning input when not a number ([9e68eff](https://github.com/searchspring/snap/commit/9e68eff2af7e7e393f11c02556d0a1f0bd0b42ee))
- **infinite:** fixing inline banner support of infinite scroll in search controller and store ([62dc80b](https://github.com/searchspring/snap/commit/62dc80b0e36a3c65165a41c48035e87f9f211bc8))
- **inlinebanner:** removing unnecessary max-width from styles ([d23e81d](https://github.com/searchspring/snap/commit/d23e81d761c734ff9cfacbe8744115dc4318dcc6))

## [0.6.1](https://github.com/searchspring/snap/compare/v0.6.0...v0.6.1) (2021-09-02)

### Bug Fixes

- **search-controller:** fixing lastParam not being set all the time ([84476a2](https://github.com/searchspring/snap/commit/84476a246f74e9a7c6ebf45653f196e1a48798b7))

# [0.6.0](https://github.com/searchspring/snap/compare/v0.5.6...v0.6.0) (2021-09-01)

### Bug Fixes

- **autocomplete-component:** moving facetSlot out of facetsToShow logic ([27ce891](https://github.com/searchspring/snap/commit/27ce891d00af2c971d0934d215937b2bae167443))
- **carousel-component:** restoring 'additionalProps' that was removed previously for swiper props ([2d25032](https://github.com/searchspring/snap/commit/2d2503263ce7ec575d91a52d00bb9998dc35e036))
- **controller:** controller package.json was missing toolbox dependency ([82047bc](https://github.com/searchspring/snap/commit/82047bcc697b53191292ffcfbdc3148a93f4f91b))
- moving loading completion to 'afterStore' ([c062dfc](https://github.com/searchspring/snap/commit/c062dfc8288445ffe4a1c6923dcf5b552c963595))
- **querystore:** change to make QueryStore Query url preserve non result limiting urls ([3266bcb](https://github.com/searchspring/snap/commit/3266bcbea9e6b8389249a69b0f3b20c2a964d748))
- **search-controller:** preventing search when no params changed since last search ([7f7c606](https://github.com/searchspring/snap/commit/7f7c60610a68941056066da91b46e1f3e28ac22e))
- **urltranslator:** removing console.log ([90e22f4](https://github.com/searchspring/snap/commit/90e22f413ae56e3c3f26a12e9dc2971a84f9d425))

### Features

- **abstract-controller:** adding ability to pass parameters to plugins ([6411ece](https://github.com/searchspring/snap/commit/6411ece8b0f3261a4dc2945d9cb2db3b67809ba8))
- **abstract:** adding id to abstract controller and renaming attachment 'on' -> 'middleware' ([8ff6134](https://github.com/searchspring/snap/commit/8ff613429719ca60d966e752a9c958b463a0a865))
- **autocomplete-component:** adding resultsSlot and noResultsSlot - fixing bug with dupe terms elem ([47aff58](https://github.com/searchspring/snap/commit/47aff58aa75f8c27db9c8ab38dde55c3159885c6))
- **autocomplete-controller:** adding 'beforeSubmit' event ([697b474](https://github.com/searchspring/snap/commit/697b474c2bf7cc555fafbb948377d8a9f23dd9b8))
- **autocomplete-controller:** adding escKey event handler and refactoring for tabbing support ([23771a7](https://github.com/searchspring/snap/commit/23771a7f505a166a307efeb8f6f6d6af44c0856b))
- **carousel:** refactor of carousel and recommendations components with test and doc updates ([2718f57](https://github.com/searchspring/snap/commit/2718f572a109339e36d59b2bea8ce233e09c2abb))
- **urlmanager:** adding global state to allow parameters to always be generated ([e5067e2](https://github.com/searchspring/snap/commit/e5067e29a9bb5e3c9edad5867d20e14373c6e7bc))
- **urltranslator:** adding to snap-preact and urlTranslator the ability to customize parameters ([028929c](https://github.com/searchspring/snap/commit/028929c136ca95e0c55c03319cde64199a97788f))

### Reverts

- **gitignore:** removing the ignore of package docs to ensure docs branch has files ([13fa1aa](https://github.com/searchspring/snap/commit/13fa1aa9adc6ae18777c2c058d97223603fb493b))

## [0.5.6](https://github.com/searchspring/snap/compare/v0.5.5...v0.5.6) (2021-08-31)

### Bug Fixes

- **slideout-component:** adding --active modifier class to ss\_\_slideout when active ([b2bb8fa](https://github.com/searchspring/snap/commit/b2bb8fa184c25335752d97deaa7a6b91e056e754))

## [0.5.5](https://github.com/searchspring/snap/compare/v0.5.4...v0.5.5) (2021-08-25)

**Note:** Version bump only for package @searchspring/snap

## [0.5.4](https://github.com/searchspring/snap/compare/v0.5.3...v0.5.4) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap

## [0.5.3](https://github.com/searchspring/snap/compare/v0.5.2...v0.5.3) (2021-08-24)

**Note:** Version bump only for package @searchspring/snap

## [0.5.2](https://github.com/searchspring/snap/compare/v0.5.1...v0.5.2) (2021-08-24)

### Bug Fixes

- **autocomplete-controller:** fixing issue with spell correct input value not using string ([6d62d99](https://github.com/searchspring/snap/commit/6d62d999ae371d8026fed5374915bae40525b3c6))

## [0.5.1](https://github.com/searchspring/snap/compare/v0.5.0...v0.5.1) (2021-08-24)

### Bug Fixes

- **autocompletecomponent:** styling changes to make facets appear correctly in ac component ([7dcb600](https://github.com/searchspring/snap/commit/7dcb600de8a4353f6acd545b866d767cf789831c))
- **facetheirarchyoptions:** adding ability to preview this type of facet for autocomplete component ([ec9014b](https://github.com/searchspring/snap/commit/ec9014befb22a16c7e05a89c6ce7c6e7fded16f6))

# [0.5.0](https://github.com/searchspring/snap/compare/v0.4.0...v0.5.0) (2021-08-23)

### Bug Fixes

- **autocomplete:** add flex basis to facets, remove demo store autocomplete theme.results duplicate ([0b79a73](https://github.com/searchspring/snap/commit/0b79a739f1cdf86dda7e871ca3bd0f2881569c0f))
- **autocomplete:** additional styling improvements, disable badges, hide section props, title props ([c8392d2](https://github.com/searchspring/snap/commit/c8392d21187ea0b77dfba6b062cc8f6346c68aca))
- **autocomplete:** terms flex shrink, set input spellcheck and autocomplete attrs, slot wrappers ([949887f](https://github.com/searchspring/snap/commit/949887ffaba666864cf9e9a325ac29210044cafa))
- **autocomplete:** wrapper should not exist if empty div ([aa60b2e](https://github.com/searchspring/snap/commit/aa60b2e871472fea95e184132fc6fb0209da935f))
- **banner:** add additional styles to images within banner component ([568366a](https://github.com/searchspring/snap/commit/568366a33c74749ae458f8b13d84cea2396da318))
- **facet:** adjust classnames of facet component to include display on root ([4cef5ce](https://github.com/searchspring/snap/commit/4cef5ced72b244abcc04a2cdf311188563ff957e))
- **facets.tsx:** fixing facet subprop theme ([5a32e6a](https://github.com/searchspring/snap/commit/5a32e6a107f1bf03dbf2a92bf495cc151ccf45e3))
- **result:** swap msrp and reg price in price component ([f47cede](https://github.com/searchspring/snap/commit/f47cedee21b667c2623cab06a8afa04e6c33e295))

### Features

- **autocomplete:** add horizontalTerms, vertical props, improve autocomplete styling and dom ([6fcd661](https://github.com/searchspring/snap/commit/6fcd66105287af8a75bf46ab511a1b17b3bca467))
- **autocomplete:** further styling improvements & add termsSlot, facetsSlot, contentSlot ([9043447](https://github.com/searchspring/snap/commit/90434470287ce6b0ded940241cdc671b76104b23))
- **image:** add maxHeight prop to Image component, update tests ([e6d742a](https://github.com/searchspring/snap/commit/e6d742a54d06a8748084a058bb54e0603264ca35))

# [0.4.0](https://github.com/searchspring/snap/compare/v0.3.47...v0.4.0) (2021-08-23)

### Bug Fixes

- **dropdown.tsx:** bugfix for dropdowns passing multiple children ([3c5cbdc](https://github.com/searchspring/snap/commit/3c5cbdc15735538911dd37557ffdbb8089147b20))

### Features

- **dropdown.tsx:** 'open' prop should be passed into dropdown content and button slots ([9b44559](https://github.com/searchspring/snap/commit/9b445590b37c3ac3f6d62a803fba70905061b15e))

## [0.3.47](https://github.com/searchspring/snap/compare/v0.3.46...v0.3.47) (2021-08-23)

### Bug Fixes

- fix github action to checkout all tags ([e9e2f73](https://github.com/searchspring/snap/commit/e9e2f7393e1b765c26882715f7ffaa8a50b7fb6f))

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

- **github-pages:** disable jekyll ([8976091](https://github.com/searchspring/snap/commit/8976091670f96f31ac4ba9c980c134ef39b79361))

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

- update gh action to include version before publish ([2527f8f](https://github.com/searchspring/snap/commit/2527f8f42dc515e53639c6579c8c743ea3809eb6))

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

- **slideout.tsx:** slideout slide direction ([#45](https://github.com/searchspring/snap/issues/45)) ([55b6544](https://github.com/searchspring/snap/commit/55b654489d66c48cea1fe4aa6769c14fcd779a4f))

## 0.2.1 (2021-06-15)

**Note:** Version bump only for package @searchspring/snap

# 0.2.0 (2021-05-20)

### Features

- **domtargeter.ts:** default 'replace' action that replaces target elem ([#40](https://github.com/searchspring/snap/issues/40)) ([82f2435](https://github.com/searchspring/snap/commit/82f24359136cf92e5993f535f35593c344e65095))

## 0.1.14 (2021-05-18)

**Note:** Version bump only for package @searchspring/snap

## 0.1.13 (2021-05-12)

**Note:** Version bump only for package @searchspring/snap

## 0.1.12 (2021-05-11)

### Bug Fixes

- **select.tsx:** fixing disableclickoutside bug. Adding an additional… ([#39](https://github.com/searchspring/snap/issues/39)) ([5e51c5e](https://github.com/searchspring/snap/commit/5e51c5ef4eaab24b86f0c363f9c66424ba71cfd1))

## 0.1.11 (2021-05-11)

### Bug Fixes

- **facet.tsx:** disableCollapse prop forces Dropdown to be open ([#37](https://github.com/searchspring/snap/issues/37)) ([d64b48b](https://github.com/searchspring/snap/commit/d64b48bddfe40017e2cf051325037b4743a1e002))

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

- commit docs ([#29](https://github.com/searchspring/snap/issues/29)) ([dd69d05](https://github.com/searchspring/snap/commit/dd69d0548465672eb58ab720884ce2d8190a0677))

## [0.1.1](https://github.com/searchspring/snap/compare/v0.1.0...v0.1.1) (2021-04-29)

### Bug Fixes

- remove test code ([e005ebd](https://github.com/searchspring/snap/commit/e005ebdf3395acca43469aa4ad8d18842b491f2f))

# 0.1.0 (2021-04-29)

### Bug Fixes

- fix lerna version to be new starting package version ([b58d42b](https://github.com/searchspring/snap/commit/b58d42b1ae3e532ae01cdc44fa7a492086f72ef3))
- fix translator configs and hybrid range ([#9](https://github.com/searchspring/snap/issues/9)) ([ac43573](https://github.com/searchspring/snap/commit/ac43573266c63592d6f83ccb08f9860cd59c4cca))
- icon gallery hiding controls ([#19](https://github.com/searchspring/snap/issues/19)) ([20a9d24](https://github.com/searchspring/snap/commit/20a9d246408a404fcfe2ca7b27541a8215e60f79))
- remove version from root package.json ([03a1aa0](https://github.com/searchspring/snap/commit/03a1aa0aa0128076a8a6f126fb610c0b6b2e2913))
- **husky:** migrate v4 to v6 ([#15](https://github.com/searchspring/snap/issues/15)) ([1d15c8f](https://github.com/searchspring/snap/commit/1d15c8f24467bc91b28039db51c35c02199c0774))
- **package-lock:** removing snapp stuff from package-lock... derp ([7a72eae](https://github.com/searchspring/snap/commit/7a72eae82a59e366aec813a7d374508be2165559))

### Features

- hide control column of ArgsTable on docs tab using css ([#16](https://github.com/searchspring/snap/issues/16)) ([63f0194](https://github.com/searchspring/snap/commit/63f0194a8aa2aebc4cbb6af235e85dfb47ee7e68))

### Reverts

- revert removing version from each package.json ([a0471de](https://github.com/searchspring/snap/commit/a0471dee9794c7044bd0231d645de3a831983a52))
