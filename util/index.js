'use strict';

module.exports.once = function once(fn) {
  var called = false;
  return function (err) {
    if (!!called) {
      return undefined;
    }
    called = true;
    return fn(err);
  };
};