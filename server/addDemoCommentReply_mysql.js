'use strict';

var sequelizeService = require('./sequelizeService');
var Promise = require('bluebird');
var join = Promise.join;

sequelizeService.sequelize
  .sync()
  .then(function () {
    var Car = sequelizeService.models.Car;
    var User = sequelizeService.models.User;
    var Comment = sequelizeService.models.Comment;
    var Reply = sequelizeService.models.Reply;

    var getComment = Comment.findOne({
      order: ['createdAt']
    });
    var getUser = User.findOne({
      order: [
        ['createdAt', 'DESC']
      ]
    });

    join(getComment, getUser, function (comment, fromUser) {
      comment.getFrom().then(function (toUser) {
        var buildPromiseArray = [];
        buildPromiseArray.push(
          Promise.resolve(Reply.build({
            content: '这是回复1....'
          }))
          .then(function (reply) {
            return join(
              reply.setFrom(fromUser, {
                save: false
              }),
              reply.setTo(toUser, {
                save: false
              }),
              reply.setComment(comment, {
                save: false
              }),
              function () {
                return reply.save();
              });
          })
        );
        buildPromiseArray.push(
          Promise.resolve(Reply.build({
            content: '这是回复2....'
          }))
          .then(function (reply) {
            return join(
              reply.setFrom(fromUser, {
                save: false
              }),
              reply.setTo(toUser, {
                save: false
              }),
              reply.setComment(comment, {
                save: false
              }),
              function () {
                return reply.save();
              });
          })
        );
        buildPromiseArray.push(
          Promise.resolve(Reply.build({
            content: '这是回复3....'
          }))
          .then(function (reply) {
            return join(
              reply.setFrom(fromUser, {
                save: false
              }),
              reply.setTo(toUser, {
                save: false
              }),
              reply.setComment(comment, {
                save: false
              }),
              function () {
                return reply.save();
              });
          })
        );

        Promise.all(buildPromiseArray)
          .then(function () {
            console.log('新增 %d 条记录...', buildPromiseArray.length);
          })
          .error(function (err) {
            console.log(err);
          });
      });

    });


  });
