'use strict';
module.exports.waitForJSReady = function waitForJSReady(nemo) {
  return nemo.driver.wait(() => {
    return nemo.driver.executeScript(() => {
      return (document.readyState === 'complete')
    })
  }
  , 30 * 1000, 'JavaScript didn\'t load even after 30 seconds');
};

module.exports.doneSuccess = function (done) {
  return function () {
    done();
  };
};

module.exports.doneError = function (done) {
  return function (err) {
    done(err);
  };
};