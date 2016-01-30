'use strict';

var _  = require('lodash');

exports.attributes = function(attr){
  var template = {
    phone: {
      type: 'string',
      unique: true
    },
    smsCode: {
      type: 'string',
      minLength: 4
    },
    resetToken: {
      model: 'resetToken'
    }
  };

  if(attr.username){
    delete(template.email);
  }

  _.merge(template, attr);
  _.merge(attr, template);
};

/**
 * used to hash the smsCode
 * @param  {object}   values
 * @param  {Function} cb
 */
exports.beforeCreate = function(values){
    if(!_.isUndefined(values.smsCode)){
    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(values.smsCode, salt);
    console.log('in before create, value is'+values.smsCode+' and hash is: ' +hash )
    values.smsCode = hash;
  }
};

/**
 * used to update the smsCode hash if user is trying to update smsCode
 * @param  {object}   values
 * @param  {Function} cb
 */
exports.beforeUpdate = function(values){
  if(!_.isUndefined(values.smsCode) && values.smsCode !== null){
    var bcrypt = require('bcrypt');
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(values.smsCode, salt);
    values.smsCode = hash;
  }
};
