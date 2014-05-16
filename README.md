## nemo-view

View Interface for nemo views

### Peer Dependencies

* nemo-locatex
* nemo-drivex

### Installation

1. Add to package.json the appropriate versions of dependencies and nemo-view to package.json and install.

```javascript
	...
    "nemo": "git://github.paypal.com/NodeTestTools/nemo.git#v0.6-beta",
    "nemo-view": "git://github.paypal.com/NodeTestTools/nemo-view.git#v0.3-beta",
    "nemo-drivex": "^0.1.0",
    "nemo-locatex": "^0.3.0-beta",
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
	homePage = require("../page/homePage"),
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

### View features

#### locator methods
The view will create the following methods for each locator object:

##### [locatorName]

* arguments: none
* returns: Promise which resolves to WebElement or rejected

##### [locatorName]Present

* arguments: none
* returns: Promise which resolves to true or false

##### [locatorName]Wait

* arguments
  * timeout {Number} time to wait in milliseconds
  * msg {String} optional. Message to accompany error in failure case
* returns: Promise which resolves to true or false

##### [locatorName]Visible

* arguments: none
* returns: Promise which resolves to true or false

Any method in the view object's prototype will also be available for use

### Using LOCALE specific locators

Please see these sections in the nemo-locatex README:
* https://github.paypal.com/NodeTestTools/nemo-locatex#changing-your-locator-files
* https://github.paypal.com/NodeTestTools/nemo-locatex#setting-locale

Other than that, the nemo-view uses nemo-locatex internally, so if you change your locator files and set LOCALE, nemo-view will handle the rest!

