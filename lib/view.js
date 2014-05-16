/* global require: true, module: true */
'use strict';
/*
 a view should:
 implement an interface with the following functionality
 take nemo config as constructor argument
 load its locator file (../locator/viewName)
 find (all locators: e.g. findSubmitButton)
 isVisible (all locators: e.g. isSubmitButtonVisible)
 isPresent (all locators: e.g. isSubmitButtonPresent)
 instantiate any subviews
 */

function ViewInterface() {
	//what here?
}
ViewInterface.prototype.init = function (context, nemo) {

	var drivex = nemo.drivex,
		locator = resolveLocator(context.config, nemo),
		viewName = resolveViewName(context.config),
		that = this;
		this.drivex = drivex;
	nemo.locator[viewName] = locator;
	Object.keys(locator).forEach(function (loc) {
		var _loc = nemo.locatex(viewName + "." + loc);

		if (locator[loc].Elements) {
			//return a method which, when called will return a list of objects each with the locreator methods for each item in the element list

			context[loc] = (function () {
				var d = nemo.wd.promise.defer();
				drivex.finds(_loc).then(function (elts) {
					var listLength = elts.length;
					var listItemLength = Object.keys(locator[loc].Elements).length;
					var currentItem = 0;
					var currentListItem = 0;
					elts.forEach(function (elt) {
						elt.getText().then(function(txt) {
							currentItem++;
							currentListItem = 0;
							Object.keys(locator[loc].Elements).forEach(function (l) {
								currentListItem++;
								var _l = nemo.locatex(viewName + "." + loc + ".Elements." + l);
								locreator(that, elt, l, _l, elt);
								if (currentItem === listLength && currentListItem === listItemLength) {
									d.fulfill(elts);
								}
							});
						})
					});
				});
				return d;
			}).bind(that);
		} else {
			locreator(that, context, loc, _loc);
		}
	});

};
//privates
var locreator = function (thees, context, loc, _loc, el) {
		context[ loc + "Present"] = (function () {
			return thees.drivex.present(_loc, el);
		}).bind(thees);
		context[loc] = (function () {
			return thees.drivex.find(_loc, el);
		}).bind(thees);
		context[loc + "Wait"] = (function (timeout, msg) {
			return thees.drivex.waitForElement(_loc, timeout || 5000, msg);//wait(_loc, timeout, msg);
		}).bind(thees);
		context[loc + "Visible"] = (function () {
			return thees.drivex.visible(_loc, el);
		}).bind(thees)
	},
	resolveLocator = function(config, nemo) {
		if (config.constructor === String) {
			return require(nemo.props.autoBaseDir + "/locator/" + config);
		}
		else {
			var loco = config.locator.split(":");
			if (loco[0] === "module") {
				//for module style
				return require(loco[1]);
			} else {
				//path style
				return require(nemo.props.autoBaseDir + "/" + loco[1])
			}
		}
	},
	resolveViewName = function(config) {
		var _viewname = (config.constructor === String) ? config : config.name;
		return _viewname;
	};
module.exports = ViewInterface;
