'use strict';
var _ = require('underscore');
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');

function encodePassword(user) {
  return new Promise(function(resolve, reject) {
    if (!user.password) {
      resolve(user);
    } else {
      if (user.changed('password')) {
        bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return reject(err);
          }
          bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
              return reject(err);
            }
            user.password = hash;
            resolve(user);
          });
        });
      }else{
        resolve(user);
      }
    }
  });
}

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastSigninDate: DataTypes.DATE
  }, {
    charset: 'utf8',
    classMethods: {
      associate: function(models) {

      },
      fetch: function(op) {
        return this
          .findAll(_.extend({
            order: ['createdAt']
          }, op || {}));
      }
    },
    instanceMethods: {
      comparePassword: function(inputpw, cb) {
        var user = this;
        bcrypt.compare(inputpw, user.password,
          function(err, isMatch) {
            if (err) {
              return cb(err);
            }
            cb(null, isMatch);
          });
      }
    },
    hooks: {
      beforeCreate: function(user, options) {
        console.log('beforeCreate......');
        return encodePassword(user);
      },
      beforeUpdate: function(user, options) {
        console.log('beforeUpdate......');
        return encodePassword(user);
      },
    }
  });
  return User;
};
