var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	nemo = {},
	logs,
	setup = {
		'view': ['simple']
	};

describe('nemo-view @methods@travis@', function() {
	nemoFactory({
		'context': nemo,
		'plugins': plugins,
		'setup': setup
	});

	beforeEach(function(done) {
		//can we access driver logs?
		//logs = new nemo.wd.WebDriver.Logs(nemo.driver);

		nemo.driver.get(nemo.props.targetBaseUrl).then(function () {
			done()
		}, function(err) {
			done(err);
		})
	});
	it('should return a @locatorObject@', function(done) {
		var locator = nemo.view.simple.outBoxBy();
		if (locator.using && locator.value) {
			done();
		} else {
			done(new Error('didnt get back a locator object'));
		}
	});
	it('should appropriately use a timeout argument to the @Wait@CustomTimeout@ method in a failure scenario', function(done) {
		var start = Date.now();
    nemo.view.simple.notExistWait(13000, 'didnt find notExist').then(function(find) {
      done(new Error('found notExist but should not have'));
    }, function(err) {
      var found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 13800 || found < 12500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
    });

	});
	it('should appropriately use a DIFFERENT timeout argument to the @Wait@CustomTimeout@ method in a failure scenario', function(done) {
		var start = Date.now();
		nemo.view.simple.notExistWait(3000, 'didnt find notExist').then(function(find) {
			done(new Error('found notExist but should not have'));
		}, function(err) {
      var found = Date.now() - start;
      console.log('timeout in ', found);
      if (found > 3800 || found < 2500) {
        done(new Error('error thrown but in the wrong period of time, '));
      } else {
        done();
      }
   });
	});
  it('should use @WaitVisible@ method', function(done) {

    var start;
    nemo.driver.get(nemo.props.targetBaseUrl + '/waits').then(function() {
       start = Date.now();
    });
    nemo.driver.wait(function() {
        return nemo.driver.executeScript(function() {
           //return $('body').data('loaded');
          if (window.$) {
            return $('body').data('loaded');
          }
          return false;
        });
      }
    , 2000, 'JavaScript didn\'t load');
    nemo.view.simple.waitButton().click();
    nemo.view.simple.outBoxWaitVisible(6000, 'didnt find outbox').then(function(find) {
      console.log('find', find);
      //find.should.equal(true);
      done();
    }, function(err) {
      var found = Date.now() - start;
      done(err);
    });
  });
  it('should use @WaitVisible@ method in negative scenario', function(done) {

    var start;
    nemo.driver.get(nemo.props.targetBaseUrl + '/waits').then(function() {
      start = Date.now();
    });
    nemo.view.simple.outBoxWaitVisible(3000, 'didnt find outbox').then(function(find) {
      console.log('find', find);
      //find.should.equal(true);
      done(new Error('shouldn\'t have found the element to be visible'));
    }, function(err) {
      var found = Date.now() - start;
      done();
    });
  });
	it('should find an existing element using the @Wait@ElementExists@ method', function(done) {
    console.log(nemo.wd.By.css('body'));
		nemo.driver.sleep(2000);
		nemo.view.simple.bodyTagWait(3000, 'didn\t find body tag').then(function(found) {
			if (found === true) {
				done();
			} else {
				done(new Error('something went wrong here'));
			}
		})
	});
});