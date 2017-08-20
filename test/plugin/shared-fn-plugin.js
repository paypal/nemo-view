'use strict';
module.exports = {
	"setup": function(whoami, nemo, callback) {
		var login = {
			'view': {},
			'locator': {}
		};
        var loginLocator = {
            "email": {
                "locator": "email",
                "type": "id"
            },
            "password": {
                "locator": "password",
                "type": "id"
            },
            "loginButton": {
                "locator": "input[type='button'][class='login']",
                "type": "css"
            },
            "logoutButton": {
                "locator": "input[type='button'][class='logout']",
                "type": "css"
            }

        };


    //setting the second param to "false" means this view won't impose on whatever is already attached to nemo.view
        login.view.login = nemo.view.addView(loginLocator, ['doesntmatter'], false);
        login.getPage = function () {
            return nemo.driver.get(nemo.data.baseUrl + '/login');
        };
		login.login = function(email, password) {
			var me = login.view.login;

			me.email().clear();
			me.email().sendKeys(email);
			me.password().sendKeys(password);
			me.loginButton().click();
			return me.logoutButtonWait(10000);
		};
		login.logout = function() {
			var me = login.view.login;
			me.logoutButton().click();
			return me.emailWait(10000);
		};
		nemo[whoami] = login;
		callback(null);

	}
};