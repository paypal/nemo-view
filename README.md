## nemo-view

View Interface for nemo views

[![Build Status](https://travis-ci.org/paypal/nemo-view.svg?branch=master)](https://travis-ci.org/paypal/nemo-view)


### Installation

1. Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^1.0.0",
    "nemo-view": "^1.0.0",
	...
```

2. Add plugins to your nemo config JSON object

```javascript
{
  "driver": {
    ...
  },
  "plugins": {
    "view": {
      "module": "nemo-view",
      "arguments": ["path:locator"]
    }
  },
  "data": {
    ...
  }
}
```

### locatorDefinition

The `locatorDefinition` can either be a JSON object like this:

```
{
  "locator": ".myClass",
  "type": "css"
}
```

Where `type` is any of the locator strategies here: http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_By.html.
A `locator` or `type` CANNOT be empty/blank/absent in JSON object representation of `locatorDefinition`. An error will be thrown during the setup of nemo-view
If `type` under `locatorDefinition` is invalid (not amongst [allowed types](http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_By.html)) then an error is thrown as well.


Or `locatorDefinition` can be a string like this:

```
"css:.myClass"
```
String of the form `<type>:<locator>`or `<locator>` (where `<type>` will be assumed as css)


### Writing a locator file

The locator JSON file describes elements and the locator strategy used for each one. The most common use case is to store
all your locator files in the `nemoBaseDir` + /locator directory. The below example uses the JSON style `locatorDefinition`.

#### textBox.json

```javascript
{
	"fooText": {
		"locator": "#foo input.texty",
		"type": "css"
	},
	"fooButton": {
		"locator": "#foo input[type='button']",
		"type": "css"
	},
	"barText": {
		"locator": "#bar input.texty",
		"type": "css"
	},
	"barButton": {
		"locator": "#bar input[type='button']",
		"type": "css"
	},
	"bingText": {
		"locator": "#bing input.texty",
		"type": "css"
	},
	"bingButton": {
		"locator": "#bing input[type='button']",
		"type": "css"
	},
	"bangText": {
		"locator": "#bang input.texty",
		"type": "css"
	},
	"bangButton": {
		"locator": "#bang input[type='button']",
		"type": "css"
	},
	"outBox": {
		"locator": "outy",
		"type": "id"
	}
}
```
`nemo-view` supports for adding JavaScript-style comments in your json files as each file is processed by using [shush](https://github.com/krakenjs/shush)

### Using views

_Note: code snippets are minus the require blocks for the sake of brevity. Please see unit tests for full files_

#### Without locator files

If you don't have any locator files, or don't configure nemo-view to find locator files, you will still get back convenience methods on the nemo object:

```
nemo.view._find
nemo.view._finds
nemo.view._present
nemo.view._visible
nemo.view._wait
nemo.view._waitVisible
nemo.view._firstVisible

```

Which can be used as follows:

```javascript
describe('nemo-view @verySimple@', function () {
  before(function (done) {
    nemo = Nemo(done);
  });
  after(function (done) {
    nemo.driver.quit().then(done);
  });

  beforeEach(function (done) {
    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should use the form view to enter values and write to outy div @useView@', function (done) {
    nemo.view._find('css:#outy').getTagName().then(function (tn) {
      assert.equal(tn.toLowerCase(), 'div');
    });
    nemo.view._finds('body').then(function (bodyArray) {
      return bodyArray[0].getTagName();
    }).then(function (tn) {
      assert.equal(tn.toLowerCase(), 'body');
    }).then(done, util.doneError(done));
  });
});
```

These generic - or "underbar" - methods are defined below.

#### With locator files

If you've configured nemo-view properly, and have the following locator files:

```
<nemoBaseDir>
   |- locator
      |- form.json
      |- formElementList.json
      |- select.json
      |- simple.json
      |- sub
         |- form.json
```

You will get back the following views on the nemo object:

```
nemo.view.form
nemo.view.formElementList
nemo.view.select
nemo.view.simple
nemo.view.sub.form
```

Each including a set of helper methods for each locator as documented below. And usable as follows:

```javascript
describe('nemo-view @simpleViewSuite@', function () {
  before(function(done) {
    nemo = Nemo(done);
  });
  after(function(done) {
    nemo.driver.quit().then(done);
  });
  beforeEach(function (done) {

    nemo.driver.get(nemo.data.baseUrl);
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });
  it('should use the form view to enter values and write to outy div @useView@', function (done) {
    nemo.view.form.fooText().sendKeys('foo');
    nemo.driver.sleep(300);
    nemo.view.form.fooButton().click();
    nemo.view.form.barText().sendKeys('bar');
    nemo.view.form.barButton().click();
    nemo.view.form.bingText().sendKeys('bing');
    nemo.view.form.bingButton().click();
    nemo.view.form.bangText().sendKeys('bang');
    nemo.view.form.bangButton().click();
    nemo.driver.sleep(3000);
    nemo.view.form.outBox().getText().then(function (outText) {
      assert.equal(outText, 'foobarbingbang');
      done();
    }, util.doneError(done));
  });
});
```
### Combining methods from with and without locator files

You can pass locators from `[locatorName]By` to underscore methods like `_find` or `_finds` etc. For example,

```javascript
nemo.view._finds(nemo.view.paypal.languageBy()).then(function(languages){
    languages.forEach(function(language){
        //do stuff
    });
 });
```


### Creating nemo plugins with self contained views and flows

You may want to publish complete flows as a nemo plugin. That way you can import the functionality and access as a plugin. The following is an example of that.

Please see the `test/contained-functionality.js` test file and `test/plugin/shared-fn-plugin.js` plugin file for an example of this.




## View features

### Generic/underbar methods

The following generic methods are added to `nemo.view`

#### _find(locatorString)

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@returns {Promise}` resolves to a WebElement or rejected

#### _finds(locatorString)

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@returns {Promise}` resolves to an array of WebElements or rejected


#### _present(locatorString)

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@returns {Promise}` resolves to true or false

#### _visible(locatorString)

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@returns {Promise}` resolves to true or false.  Rejected if element is not found

#### _wait(locatorString[, timeout [, msg]])

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@argument timeout {Integer} (optional, default 5000)` - ms to wait until rejecting

`@argument msg {String} (optional)` - Message to accompany error in failure case`

`@returns {Promise}` resolves to true or rejected

#### _waitVisible(locatorString[, timeout [, msg]])

`@argument locatorDefinition {String|Object}` - Please see `locatorDefinition` above

`@argument timeout {Integer} (optional, default 5000)` - ms to wait until rejecting

`@argument msg {String} (optional)` - Message to accompany error in failure case`

`@returns {Promise}` resolves to true or rejected

#### _firstVisible(locatorObject[, timeout])

`@argument locatorObject {Object}` - Object of key/value pairs where the key describes the element to find and the
value is a `locatorDefinition` (see above). Example would be:
```javascript
{
  'loginerror': '.notification.notification-critical',
  'profile': '#contents[role=main]'
 }
```

`@argument timeout {Integer} (optional, default 5000)` - ms to wait until rejecting

`@returns {Promise}` resolves to the found key (e.g. 'loginerror' or 'profile' from above example) or rejected

### addView method

The addView method will be added to the nemo.view namespace with the following signature:
`nemo.view.addView(viewSpec, addToNamespace);`

__viewSpec__ {String|JSON} will be either a string, or a JSON object to define the view/locator.
__addToNamespace__ {boolean} (optional, defaults to true) if `false` nemo-view will not attach the view to the `nemo.view` namespace

Using the addView method, you can add a view at any time using the same formats and conventions as if you are adding them in the Nemo.setup() method. Examples:

```javascript
//add using a locator in the autoBaseDir/locator directory
var myPage = nemo.view.addView('myPage');
var login = nemo.view.addView({
	"name": "login",
	"locator": "path:locator/loggedOut/login"
});
var addCard = nemo.view.addView({
	"name": "addCard",
	"locator": "module:nemo-paypal-locators/addCard"
});

The addView method will return the view object. It will also dedupe to prevent extra cycles adding the same view multiple times, or overwriting of a view with another of the same name.

```

### locator methods
The view will create the following methods for each locator object:

#### [locatorName]

* arguments: none
* returns: Promise which resolves to WebElement or rejected

#### [locatorName]By

* arguments: none
* returns: JSON locator object. You can use this, for example, to pass to selenium-webdriver until statements

#### [locatorName]Present

* arguments: none
* returns: Promise which resolves to true or false

#### [locatorName]Wait

* arguments
  * timeout {Number} time to wait in milliseconds
  * msg {String} optional. Message to accompany error in failure case
* returns: Promise which resolves to WebElement when element is present, or reject

#### [locatorName]WaitVisible

* arguments
  * timeout {Number} time to wait in milliseconds
  * msg {String} optional. Message to accompany error in failure case
* returns: A promise which resolves to WebElement when element is both found and visible, or reject

#### [locatorName]Visible

* arguments: none
* returns: Promise which resolves to true or false when element is present, or rejected if element is not present

#### [locatorName]OptionText

* arguments
  * text: the text in the option you wish to select
* returns: Promise which resolves to true when option is selected

#### [locatorName]OptionValue

* arguments
  * value: the value attribute of the option you wish to select
* returns: Promise which resolves to true when option is selected
Any method in the view object's prototype will also be available for use
Other than that, the nemo-view uses nemo-locatex internally, so if you change your locator files and set LOCALE, nemo-view will handle the rest!

#### [locatorName]TextEquals

* arguments
  * value: the expected value for the element
* returns: Promise which resolves to true when the expected text matches

#### [locatorName]AttrEquals

* arguments
  * attribute: attribute value to check
  * value: the expected value for the element
* returns: Promise which resolves to true when the expected text matches

## Using locator specialization

You can specify different locator strings/strategies based on the `data.locale` configuration value.
To do so, first modify the entry you wish to be specialized:

```js
{
  "myLocator": {
    "type": "css",
    "locator": ".myLocator"
  }
}
```

changes to

```js
{
  "myLocator": {
    "default": {
       "type": "css",
       "locator": ".myLocator"
     },
    "DE": {
      "type": "css",
      "locator": ".meinLocator"
    }
  }
}
```

You can set the `data.locale` property as follows:

```js
nemo._config.set('data:locale', 'DE');
```

For a working example, refer to the unit tests for the locale feature (found in `test/locale.js`) in this module.

_NOTE: This feature is a carry-over from earlier versions of nemo-view. It is understood now that the above feature does
not actually represent "locale" specificity as defined by bcp47 (https://tools.ietf.org/html/bcp47). See discussion
[here](https://github.com/paypal/nemo-view/pull/32) and issue [here](https://github.com/paypal/nemo-view/issues/33).
Follow along as we discuss a backwards compatible way to resolve this unfortunate nomenclature error.
