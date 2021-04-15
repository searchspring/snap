# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.0.19 (2021-04-15)


### Bug Fixes

* **package-lock:** removing snapp stuff from package-lock... derp ([7a72eae](https://github.com/searchspring/snap/commit/7a72eae82a59e366aec813a7d374508be2165559))





## 0.0.18 (2021-04-08)

**Note:** Version bump only for package @searchspring/snap-url-manager





## 0.0.17 (2021-04-06)


### Bug Fixes

* case sensitive export path fix when ran on non-mac ([936b91d](https://github.com/searchspring/snap/commit/936b91d2e2c8f8ab872b98b0a52e1788bf52a3e0))





## 0.0.16 (2021-04-06)

**Note:** Version bump only for package @searchspring/snap-url-manager





# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.15](https://github.com/searchspring/snap-url-manager/compare/v0.0.14...v0.0.15) (2021-02-10)


### Bug Fixes

* Add `withConfig` option, make config immutable ([1cf4534](https://github.com/searchspring/snap-url-manager/commit/1cf4534bf6f5bf8a0337656147c4f5e3fe746a7a))
* filter parameters always array ([2e86240](https://github.com/searchspring/snap-url-manager/commit/2e862400e37dda9d6e7369f12fcf01cf3b13f414))
* Only bind external events once ([f0a5b23](https://github.com/searchspring/snap-url-manager/commit/f0a5b2390b4af0f04729e44fee62af5a9d622707))

### [0.0.14](https://github.com/searchspring/snap-url-manager/compare/v0.0.13...v0.0.14) (2021-02-05)


### Features

* Add bindExternalEvents and popstate event to QueryStringTranslator ([ed50724](https://github.com/searchspring/snap-url-manager/commit/ed507243c8d87274cda9173116418147ce23603d))

### [0.0.13](https://github.com/searchspring/snap-url-manager/compare/v0.0.12...v0.0.13) (2021-02-02)


### Bug Fixes

* Set replace all values when no path specified ([5840ee1](https://github.com/searchspring/snap-url-manager/commit/5840ee1d330dff648483fda40099bd83848ffff5))

### [0.0.12](https://github.com/searchspring/snap-url-manager/compare/v0.0.11...v0.0.12) (2021-02-02)


### Bug Fixes

* Add reset function ([4034300](https://github.com/searchspring/snap-url-manager/commit/4034300f69cc76b76e986247d4ebe5b41dc3a346))

### [0.0.11](https://github.com/searchspring/snap-url-manager/compare/v0.0.10...v0.0.11) (2021-01-29)


### Bug Fixes

* Don't merge URL values overwritten via 'set' ([957e6cd](https://github.com/searchspring/snap-url-manager/commit/957e6cd0da4363744994568c338a8c48b112cd43))

### [0.0.10](https://github.com/searchspring/snap-url-manager/compare/v0.0.9...v0.0.10) (2021-01-29)


### Bug Fixes

* **detach function:** extended detach function to maintain shared state using detatch url ([a3cf5e1](https://github.com/searchspring/snap-url-manager/commit/a3cf5e12e7265cf3cc782551a990e06461969fb2))
* fix merging (concat) of URL arrays and state arrays ([02cb8e0](https://github.com/searchspring/snap-url-manager/commit/02cb8e044ac1253347038e30274f793c459c925e))

### [0.0.9](https://github.com/searchspring/snap-url-manager/compare/v0.0.8...v0.0.9) (2021-01-26)


### Bug Fixes

* **url-manager:** fix missing parameters after multiple merge ([e6ddf6f](https://github.com/searchspring/snap-url-manager/commit/e6ddf6fc3e895b64d379e6f6b9c32a4a12294cf7))

### [0.0.8](https://github.com/searchspring/snap-url-manager/compare/v0.0.7...v0.0.8) (2021-01-22)


### Bug Fixes

* fix missing subscribe[prev] and missing query '?' ([b14f062](https://github.com/searchspring/snap-url-manager/commit/b14f062f7fbb5785f7e2e19b2a4764a737155f40))

### [0.0.7](https://github.com/searchspring/snap-url-manager/compare/v0.0.6...v0.0.7) (2021-01-22)


### Bug Fixes

* detach mechanism ([f20b60d](https://github.com/searchspring/snap-url-manager/commit/f20b60d745176b13f91e1515e91bba47e9060935))

### [0.0.6](https://github.com/searchspring/snap-url-manager/compare/v0.0.5...v0.0.6) (2021-01-22)


### Bug Fixes

* **urlmanager:** bug fixes, noop translator, and root url support ([eadb904](https://github.com/searchspring/snap-url-manager/commit/eadb904b90c4c77377ffdaf8e2de02edb72be6eb))

### [0.0.5](https://github.com/searchspring/snap-url-manager/compare/v0.0.4...v0.0.5) (2020-10-26)


### Bug Fixes

* adding 'ts-jest' which was accidentally removed - also adding test to 'preversion' ([f99d520](https://github.com/searchspring/snap-url-manager/commit/f99d520fc250c353ab2bf1017308eee9b7f4401c))

### [0.0.4](https://github.com/searchspring/snap-url-manager/compare/v0.0.3...v0.0.4) (2020-10-26)


### Bug Fixes

* removed bad copy of 'version' npm script - styles changes to tests ([1b765be](https://github.com/searchspring/snap-url-manager/commit/1b765bea3d1c684721ab94e8487f918f25fa9828))

### [0.0.3](https://github.com/searchspring/snap-url-manager/compare/v0.0.2...v0.0.3) (2020-10-26)


### Bug Fixes

* renamed package to match git repo for publishing - also added .npmrc ([e67f6f0](https://github.com/searchspring/snap-url-manager/commit/e67f6f0e3232fa6aff3df5149e9a8d32027c8a74))

### 0.0.2 (2020-10-22)

### Features

- **linkers:** add linker support, w/ ReactLinker ([031625b](https://github.com/searchspring/snap-url-manager/commit/031625b7a0622702bd343bf13f96ee880d34c479))
- initial commit ([dcdf6de](https://github.com/searchspring/snap-url-manager/commit/dcdf6deff20a36b17c3b3c46275a317d3efb5c4c))
- Refactor URL state management, fix update syncing and remove ([0a44ec6](https://github.com/searchspring/snap-url-manager/commit/0a44ec65cebced0693391d9c4a1b51cd227a716a))
- refresh URL state when accessed (remove watcher) ([20bf4b7](https://github.com/searchspring/snap-url-manager/commit/20bf4b7632b579a816a87b3666edae1c134d0a9b))
- **UrlManager:** Add initial UrlManager and query string translator ([40aa234](https://github.com/searchspring/snap-url-manager/commit/40aa23472c24129169176f82742287760661af18))

### Bug Fixes

- type error resolution ([437038b](https://github.com/searchspring/snap-url-manager/commit/437038b085a020c9cb6500b703aeb4ccd5ab069e))
- **urlmanager:** fix subscribe() and removals on set/merge ([91627ae](https://github.com/searchspring/snap-url-manager/commit/91627aec5d52a6a669c6b407646a909875122d23))
