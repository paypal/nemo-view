# nemo-view changelog

## v2.1.2

* Improved error messaging for Wait and WaitVisible methods by using locatorId to identify the problematic locator

## v2.1.1

- PR https://github.com/paypal/nemo-view/pull/46
  - Fix: `lib/normalize` did not handle the case of attempting to normalize an already normalized locator
  - Fix: README doc for `_visible` and `_present` methods
  - New: unit tests for `_visible` and `_present` methods
  
## v2.1.0

* Now using [shush](https://github.com/krakenjs/shush) so that users can add comments to their locator files. This way `nemo-view` is consistent with `nemo`
* When `locator.type` is empty/blank/invalid/absent an error will be thrown during the setup
* When `locator.locator` is empty/blank/absent, an error is thrown,
* Fixed a bug for a case when `locatorBy()` is passed to underscore methods, for example  `nemo._find(locatorBy())`
* Updated unit tests so that sample locator file reflects comments and different flavors of invalid types
* Fixed JSHint errors
* Updated README with content about invalid type/locator. Also fixed a selenium link for types. Previous link was responding with 404

## v2.0.0

* add peerDependency to nemo v2.0

## v1.2.0

* add realtime locale switching support (see https://github.com/paypal/nemo-view/issues/31)

## v1.1.0

* add new methods `[locatorName]TextEquals` and `[locatorName]AttrEquals` (see https://github.com/paypal/nemo-view/pull/29)
* add optional msg parameter to generic methods (see https://github.com/paypal/nemo-view/pull/28)

## v1.0.3

Change API to match `nemo@1.0`

## v0.3.2-beta

Add support for module based locators and path based locators. I.e. you can put locators into commonjs modules as well as into other directory structure
(relative to your nemo.props.autoBaseDir) aside from the locators directory.

## v0.3.1-beta

Adding ability to parse element lists (see new unit test suite)
