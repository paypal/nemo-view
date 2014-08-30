var path = require("path");
//var nview = require(path.resolve(__dirname, '../../index'));
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