'use strict';
var bcrypt = require('bcrypt');

/**
 * Login action
 */
module.exports = function(req, res) {

  var scope = require('../../scope')(waterlock.Auth, waterlock.engine);
  var params = req.params.all();

  if (typeof params[scope.type] === 'undefined' || typeof params.smsCode === 'undefined') {
    //console .log('undefined shit');
    waterlock.cycle.registerFailure(req, res, null, {

      error: 'Invalid ' + scope.type + ' or smsCode'
    });
  } else {
    var pass = params.smsCode;
    //console.log('reg: things defined inside else');
    scope.registerUserAuthObject(params, req, function(err, user) {
      if (err) {
        //console.log('error registering users');
        res.serverError(err);
      }
      if (user) {
        //console.log('reg: user object from auth object');
        //NOTE: not sure we need to bother with bcrypt here?
        if (bcrypt.compareSync(pass, user.auth.smsCode)) {
          //console.log('reg: correct smsCode');
          waterlock.cycle.registerSuccess(req, res, user);
        } else {
          //console.log('reg: incorrect smsCode');
          waterlock.cycle.registerFailure(req, res, user, {
            error: 'Invalid ' + scope.type + ' or smsCode'
          });
        }
      } else {
        //console.log('user empty');
        waterlock.cycle.registerFailure(req, res, null, {
          error: scope.type + ' is already in use'
        });
      }
    });

  }
};
