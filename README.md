## nemo-view

View Interface for nemo views

[![Build Status](https://travis-ci.org/paypal/nemo-view.svg?branch=master)](https://travis-ci.org/paypal/nemo-view)

### Peer Dependencies

* nemo-locatex
* nemo-drivex

### Installation

1. Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^0.1.0",
    "nemo-view": "^0.1.0",
    "nemo-drivex": "^0.1.0",
    "nemo-locatex": "^0.1.0",
	...
```

2. Add plugins to your nemo plugins JSON object

```javascript
{
	"plugins": {
		"drivex": {
			"module": "nemo-drivex",
			"register": true
		},
		"locatex": {
			"module": "nemo-locatex",
			"register": true
		},
		"view": {
			"module": "nemo-view"
		}
	}
}
```

### Writing a locator file

The locator JSON file describes elements and the locator strategy used for each one. The most common use case is to store
all your locator files in the `nemo.props.autoBaseDir` + /locator directory

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

### Using views in spec files

Just specify one or more view by name in the "view" namespace of the configuration object (named setup below). Note below we are calling in two view objects, selectBox and textBox.

In the common use case, make sure the view you request matches the name of the locator file in the `nemo.props.autoBaseDir` + /locator directory.

```javascript
/*global nemo:true, describe:true, it:true */
var plugins = require("../config/nemo-plugins"),
	nemoFactory = require("nemo-mocha-factory"),
	setup = {
		"view": ["selectBox", "textBox"]
	};
describe('this is a @nemoSuite@', function() {
	nemoFactory({"plugins": plugins, "setup": setup});
    it('should open a URL', function(done) {
        nemo.driver.get(nemo.props.targetBaseUrl).then(function() {
			done()
		}, function(err) {
			done(err);
		});
    });
	it('should @useNemoViewMethods@', function(done) {
		nemo.driver.get(nemo.props.targetBaseUrl);
		nemo.view.textBox.fooText().sendKeys("foo");
		nemo.view.textBox.fooButton().click();
		nemo.view.textBox.barText().sendKeys("bar");
		nemo.view.textBox.barButton().click();
		nemo.view.textBox.bingText().sendKeys("bing");
		nemo.view.textBox.bingButton().click();
		nemo.view.textBox.bangText().sendKeys("bang");
		nemo.view.textBox.bangButton().click();
		nemo.view.selectBox.abcOption().click();
		return nemo.view.textBox.outBox().getText().then(function (outText) {
			if (outText === "foobarbingbangabc") {
				done()
			} else {
				done(new Error("Didn't get an OK"))
			}
			}, function(err) {
				done(err)
			});
	});
});

```
The view will automatically require its locator (looking in nemo.props.autoBaseDir/locator). The locator is required and there will be an error unless a locator file of the same name is provided.

#### Putting locators into other directories

If you want to create a sub-directory structure for locators. E.g. instead of all your locator files under `nemo.props.autoBaseDir` + /locator, you
prefer to add directory structure under that:

```
<autoBaseDir>
  |-locator/
    |-loggedOut/
    |   login.json
    |   signup.json
    |-loggedIn/
    |   profile.json
```

In this case, you need to specify your views in the nemo setup config a little differently:

```javascript
/*global nemo:true, describe:true, it:true */
var plugins = require("../config/nemo-plugins"),
	nemoFactory = require("nemo-mocha-factory"),
	homePage = require("../page/homePage"),
	setup = {
		"view": [{
				"name": "login",
				"locator": "path:locator/loggedOut/login"
			}, {
				"name": "profile",
                "locator": "path:locator/loggedIn/profile"
			}]
	};
```

#### Putting locators into other commonjs modules

You may want to use a locator file that someone else created and published as a commonjs module. Using the nemo-paypal-locators module:

Add it to package.json:
```javascript
"devDependencies": {
	...
	"nemo-paypal-locators": "*",
	...
}
```

`npm install`

Specify the view in the nemo setup config

```javascript
/*global nemo:true, describe:true, it:true */
var plugins = require("../config/nemo-plugins"),
	nemoFactory = require("nemo-mocha-factory"),
	homePage = require("../page/homePage"),
	setup = {
		"view": [{
				"name": "login",
				"locator": "module:nemo-paypal-locators/login"
			}]
	};
```
### Creating nemo plugins with self contained views and flows

You may want to publish complete flows as a nemo plugin. That way you can import the functionality and access as a plugin. The following is an example of that.

```javascript
var path = require("path");
module.exports = {
	"setup": function(config, nemo, callback) {
		var login = {
			'view': {},
			'locator': {}
		};
		var loginLocator = {
			"email": {
				"locator": "login_email",
				"type": "id"
			},
			"password": {
				"locator": "login_password",
				"type": "id"
			},
			"showLogin": {
				"locator": "login-button",
				"type": "id"
			},
			"button": {
				"locator": "input[type='submit'][name='submit']",
				"type": "css"
			},
			"logoutLink": {
				"locator": "li.logout a",
				"type": "css"
			},
			"loggedOutLoginLink": {
				"locator": "li.login a",
				"type": "css"
			}
		};
		var loginContext = {
			'locator': loginLocator,
			'name': 'login'
		};
		login.view.login = nemo.view.addView(loginContext, false);
		login.login = function(email, password) {
			var me = login.view.login;
			nemo.driver.get('https://www.stage2pph20.stage.paypal.com');
			me.showLoginVisible().then(function(isVisible) {
				if (isVisible) {
					return me.showLogin().click();
				}
				return;
			});
			me.email().clear();
			me.email().sendKeys(email);
			me.password().sendKeys(password);
			me.button().click();
			return me.logoutLinkWait(10000);
		};
		login.logout = function() {
			var me = login.view.login;
			me.logoutLink().click();
			//nemo.driver.sleep(30000);
			return me.loggedOutLoginLink(10000);
		};
		nemo.login = login;
		callback(null, config, nemo);

	}
};
```

The above can be registered as a plugin during nemo setup, and accessed as `nemo.login` within a spec.

### Using multiple views in modules external to spec files

You will probably want to share functionality between spec files which encapsulate multiple views (called flow modules). And you may want to use multiple of these flow modules in a single spec. In this case, it makes more sense to allow the flow module to specify which view(s) to include instead of specifying the views at the spec level. Use the nemo-view `addView` method in the flow modules to accomplish this.

Example of the top of a flow file `addCard.js`
```javascript
'use strict';

function addCard(nemo) {
	var CC = nemo.view.addView('CC');
	var allSet = nemo.view.addView('allSet');
	return {
		addCC: function(cardNumber, date, csc) {
			CC.CCTabLink().click();
```

This module can in turn be included in a spec file as below:

```javascript
'use strict';
var assert = require('assert'),
  nemoFactory = require('nemo-mocha-factory'),
  nemo = {},
  plugins = require('../config/nemo-plugins'),
  addCard = require('../flow/addCard'),
  addBank = require('../flow/addBank');

describe('@p2@FRbank@migrate@', function() {
  nemoFactory({
    'plugins': plugins,
    'context': nemo
  });
  before(function(done) {
    addCard = addCard(nemo);
    addBank = addBank(nemo);
    done();
  )};
```

Now any of the flow module methods can be used in the spec file, and the correct views will be available in the flow modules.

### View features

#### addView method

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

#### locator methods
The view will create the following methods for each locator object:

##### [locatorName]

* arguments: none
* returns: Promise which resolves to WebElement or rejected

##### [locatorName]By

* arguments: none
* returns: JSON locator object. You can use this, for example, to pass to selenium-webdriver until statements

##### [locatorName]Present

* arguments: none
* returns: Promise which resolves to true or false

##### [locatorName]Wait

* arguments
  * timeout {Number} time to wait in milliseconds
  * msg {String} optional. Message to accompany error in failure case
* returns: Promise which resolves to true or false

##### [locatorName]WaitVisible

* arguments
  * timeout {Number} time to wait in milliseconds
  * msg {String} optional. Message to accompany error in failure case
* returns: A promise that will be resolved when element is found.

##### [locatorName]Visible

* arguments: none
* returns: Promise which resolves to true or false

Any method in the view object's prototype will also be available for use

##### [locatorName]OptionText

* arguments
  * text: the text in the option you wish to select
* returns: Promise which resolves to true when option is selected

##### [locatorName]OptionValue

* arguments
  * value: the value attribute of the option you wish to select
* returns: Promise which resolves to true when option is selected
Any method in the view object's prototype will also be available for use
Other than that, the nemo-view uses nemo-locatex internally, so if you change your locator files and set LOCALE, nemo-view will handle the rest!

### Using LOCALE specific locators

Please see these sections in the nemo-locatex README:
* https://github.com/paypal/nemo-locatex#changing-your-locator-files
* https://github.com/paypal/nemo-locatex#setting-locale

