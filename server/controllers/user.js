'use strict';
// var ModelUser = require('../models/user');

var sequelizeService = require('../sequelizeService');
var User = sequelizeService.models.User;

module.exports.showSignup = function(req, res, next) {
  res.render('signup', {
    title: '汽车商城 注册页',
    user: {}
  });
};

module.exports.showSignin = function(req, res, next) {
  res.render('signin', {
    title: '汽车商城 登录页',
    user: {}
  });
};

module.exports.postSignup = function(req, res, next) {
  var userObj = req.body.user;
  if (!userObj) {
    return res.status(400).send('找不到合法数据.');
  }

  User
    .build(userObj)
    .save()
    .then(function(_user) {
      req.session.loginuser = _user;
      return res.redirect('/');
    })
    .error(function(err) {
      res.locals.syserrmsg = '用户名已存在，不能完成注册';
      return module.exports.showSignup(req, res, next);
    });
};

module.exports.postSignin = function(req, res, next) {
  var userObj = req.body.user;
  if (!userObj) {
    return res.status(400).send('找不到合法数据.');
  }
  var name = userObj.name;
  var inputpw = userObj.password;

  User.findOne({
      where: {
        name: name
      }
    })
    .then(function(_user) {
      if (!_user) {
        res.locals.syserrmsg = '用户名不存在...';
        return module.exports.showSignin(req, res, next);
      } else {
        _user.comparePassword(inputpw, function(err, isMatch) {
          if (err) {
            console.log(err);
            return res.redirect('/signin');
          }
          if (isMatch) {
            console.log('用户: %s 登录验证成功.', name);
            req.session.loginuser = _user.get({
              plain: true
            });
            var id = _user.id;
            _user
              .update({
                lastSigninDate: Date.now()
              })
              .then(function() {
                return res.redirect('/');
              })
              .error(function(err) {
                return next(err);
              });
          } else {
            res.locals.syserrmsg = '密码不正确，请重新输入...';
            return module.exports.showSignin(req, res, next);
          }
        });
      }
    })
    .error(function(err) {
      console.log(err);
      return res.redirect('/signup');
    });

};

module.exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    return res.redirect('/');
  });
};

module.exports.requireSignin = function(req, res, next) {
  var user = req.session.loginuser;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
};

module.exports.requireAdmin = function(req, res, next) {
  var user = req.session.loginuser;
  if (!user) {
    return res.redirect('/signin');
  }
  if (!user.level) {
    return res.redirect('/signin');
  }
  if (user.level < 900) {
    return res.redirect('/signin');
  }
  next();
};
