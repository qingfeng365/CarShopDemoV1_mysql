'use strict';

var sequelizeService = require('./sequelizeService');
var Promise = require('bluebird');

var join = Promise.join;

sequelizeService.sequelize
  .sync()
  .then(function() {
    var Car = sequelizeService.models.Car;
    var User = sequelizeService.models.User;
    var Comment = sequelizeService.models.Comment;

    var getCar = Car.findOne({
      order: ['createdAt']
    });
    var getUser = User.findOne({
      order: ['createdAt']
    });

    join(getCar, getUser, function(car, user) {
      var buildPromiseArray = [];

      buildPromiseArray.push(
        Promise.resolve(Comment.build({
          content: '这是评论1....',
        })).then(function(comment) {
          return join(comment.setCar(car, {
              save: false
            }),
            comment.setFrom(user, {
              save: false
            }),
            function() {
              comment.save().then(function() {
                // console.dir(comment);
              });
            });
        })
      );

      buildPromiseArray.push(
        Promise.resolve(Comment.build({
          content: '这是评论2....',
        })).then(function(comment) {
          return join(comment.setCar(car, {
              save: false
            }),
            comment.setFrom(user, {
              save: false
            }),
            function() {
              comment.save().then(function() {
                // console.dir(comment);
              });
            });
        })
      );

      buildPromiseArray.push(
        Promise.resolve(Comment.build({
          content: '这是评论3....',
        })).then(function(comment) {
          return  join(comment.setCar(car, {
              save: false
            }),
            comment.setFrom(user, {
              save: false
            }),
            function() {
              comment.save().then(function() {
                // console.dir(comment);
              });
            });
        })
      );

      Promise.all(buildPromiseArray)
        .then(function() {
          console.log('新增 %d 条记录...', buildPromiseArray.length);
        })
        .error(function(err) {
          console.log(err);
        });
    });
  });
