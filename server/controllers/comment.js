'use strict';
var sequelizeService = require('../sequelizeService');
var Car = sequelizeService.models.Car;
var Comment = sequelizeService.models.Comment;
var User = sequelizeService.models.User;
var Reply = sequelizeService.models.Reply;

var Promise = require('bluebird');
var join = Promise.join;

module.exports.post = function (req, res, next) {
  var commentObj = req.body.comment;
  if (!commentObj) {
    return res.status(400).send('找不到合法数据.');
  }
  console.dir(commentObj);
  var carId = commentObj.car;
  var commentId = commentObj.commentid;
  var fromUserId = commentObj.from;
  var toUserId = commentObj.to;
  var content = commentObj.content;

  var car = Car.build({
    id: carId
  });
  var fromUser = User.build({
    id: fromUserId
  });

  if (!commentObj.commentid) {
    //新增评论
    var comment = Comment.build({
      content: content
    });

    join(comment.setCar(car, {
          save: false
        }),
        comment.setFrom(fromUser, {
          save: false
        }),
        function () {
          comment.save().then(function () {
            return res.redirect('/car/' + carId);
          });
        })
      .error(function (err) {
        return next(err);
      });

  } else {
    //回复评论
    var toUser = User.build({
      id: toUserId
    });
    Comment.findById(commentId, {
        attributes: ['id']
      })
      .then(function (comment) {
        if (!comment) {
          return Promise.reject(new Error('Comment not found.'));
        }
        var reply = Reply.build({
          content: content
        });
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
      .then(function(){
        return res.redirect('/car/' + carId);
      })
      .error(function (err) {
        return next(err);
      });

  }
};
