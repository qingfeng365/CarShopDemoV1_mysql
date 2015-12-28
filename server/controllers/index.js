'use strict';

// var ModelCar = require('../models/car');

var sequelizeService = require('../sequelizeService');
var Car = sequelizeService.models.Car;

module.exports.index = function(req, res, next) {
  console.log('req.session.user');
  console.log(req.session.user);

  // ModelCar.fetch(function(err, cars) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.render('index', {
  //     title: '汽车商城 首页',
  //     cars: cars
  //   });
  // });

  return Car.fetch()
    .then(function(cars) {
      console.log('then...1');
      return res.render('index', {
        title: '汽车商城 首页',
        cars: cars
      });
    })
    .error(function(err) {
      return next(err);
    });

};
