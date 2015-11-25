# nemo-view changelog

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
