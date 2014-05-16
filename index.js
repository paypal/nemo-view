/* global require: true, module: true */
"use strict";
var NemoView = require("./lib/view");
module.exports = {
	"addView": function (config, nemo) {

		var _view = (new NemoView());
		_view.config = config;
		_view.init(_view, nemo);
		return _view;
	}
};
