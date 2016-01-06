'use strict';
var _ = require('underscore');
// var ModelCar = require('../models/car');
// var ModelComment = require('../models/comment');

var sequelizeService = require('../sequelizeService');
var Car = sequelizeService.models.Car;
var Comment = sequelizeService.models.Comment;


module.exports.showDetail = function (req, res, next) {
  var id = req.params.id;
  // ModelCar.findById(id, function (err, car) {
  //   if (err) {
  //     return next(err);
  //   }
  //   var carId = car._id;
  //   ModelComment.fetchByCarId(carId, function (err, comments) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.render('car_detail', {
  //       title: '汽车商城 详情页',
  //       car: car,
  //       comments: comments
  //     });
  //   });
  // });

  var car;
  var comments;
  Car.findById(id)
    .then(function (_car) {
      car = _car;
      return Comment.fetchByCarId(id);
    })
    .then(function (_comments) {

      comments = _comments;
      // console.dir(comments);
      return res.render('car_detail', {
        title: '汽车商城 详情页',
        car: car,
        comments: comments
      });
    })
    .error(function (err) {
      console.log(err);
      return next(err);
    });
};


// admin/car/list?page=&pagetotal=&search=
module.exports.showList = function (req, res, next) {

  var size = 2;
  var page = parseInt(req.query.page);
  var pagetotal = parseInt(req.query.pagetotal);
  var search = req.query.search;
  console.log('search');
  console.log(search);

  var searchquery = '';
  if (search) {
    searchquery = '&search=' + encodeURIComponent(search);
  }


  // if (!page) {
  //   //第一次调用
  //   ModelCar.getCount(search, function (err, totalsize) {
  //     page = 1;
  //     pagetotal = Math.ceil(totalsize / size);
  //     ModelCar.findByPage(search, page, size, function (err, cars) {
  //       if (err) {
  //         return next(err);
  //       }
  //       res.render('car_list.jade', {
  //         title: '汽车商城 列表页',
  //         cars: cars,
  //         page: page,
  //         size: size,
  //         pagetotal: pagetotal,
  //         searchquery: searchquery
  //       });
  //     });
  //   });
  // } else {
  //   ModelCar.findByPage(search, page, size, function (err, cars) {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.render('car_list.jade', {
  //       title: '汽车商城 列表页',
  //       cars: cars,
  //       page: page,
  //       size: size,
  //       pagetotal: pagetotal,
  //       searchquery: searchquery
  //     });
  //   });
  // }

  if (!page) {
    //第一次调用
    Car.getCount(search)
      .then(function (totalsize) {
        page = 1;
        pagetotal = Math.ceil(totalsize / size);
        return Car.findByPage(search, page, size);
      })
      .then(function (cars) {
        res.render('car_list.jade', {
          title: '汽车商城 列表页',
          cars: cars,
          page: page,
          size: size,
          pagetotal: pagetotal,
          searchquery: searchquery
        });
      })
      .error(function (err) {
        return next(err);
      });
  } else {
    Car.findByPage(search, page, size)
      .then(function (cars) {
        return res.render('car_list.jade', {
          title: '汽车商城 列表页',
          cars: cars,
          page: page,
          size: size,
          pagetotal: pagetotal,
          searchquery: searchquery
        });

      })
      .error(function (err) {
        return next(err);
      });;
  }


};

module.exports.search = function (req, res, next) {
  var search = req.body.search;
  var s = encodeURIComponent(search.text);

  res.redirect('/admin/car/list?search=' + s);

};

module.exports.new = function (req, res, next) {
  res.render('car_admin', {
    title: '汽车商城 后台录入页',
    car: {}
  });
};
module.exports.update = function (req, res, next) {
  var id = req.params.id;
  // ModelCar.findById(id, function (err, car) {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.render('car_admin', {
  //     title: '汽车商城 后台录入页',
  //     car: car
  //   });
  // });

  Car.findById(id)
    .then(function (car) {
      return res.render('car_admin', {
        title: '汽车商城 后台录入页',
        car: car
      });
    })
    .error(function (err) {
      return next(err);
    });

};
module.exports.post = function (req, res, next) {
  var carObj = req.body.car;
  if (!carObj) {
    return res.status(400).send('找不到合法数据.');
  }
  var id = carObj.id;

  // if (!id) {
  //   //新增
  //   var docCar = new ModelCar(carObj);
  //   docCar.save(function (err, _car) {
  //     if (err) {
  //       return next(err);
  //     }
  //     return res.redirect('/car/' + _car._id);
  //   });
  // } else {
  //   //修改 方案一
  //   // ModelCar.findByIdAndUpdate(id, carObj, function(err, _car) {
  //   //   if (err) {
  //   //     return next(err);
  //   //   }
  //   //   return res.redirect('/car/' + id);
  //   // });

  //   //修改 方案二
  //   ModelCar.findById(id, function (err, docCar) {
  //     if (err) {
  //       return next(err);
  //     }
  //     docCar = _.extend(docCar, carObj);
  //     docCar.save(function (err, _car) {
  //       if (err) {
  //         return next(err);
  //       }
  //       return res.redirect('/car/' + _car._id);
  //     });
  //   });
  // }

  if (!id) {
    //新增
    Car.build(carObj)
      .save()
      .then(function (_car) {
        return res.redirect('/car/' + _car.id);
      })
      .error(function (err) {
        return next(err);
      });
  } else {
    Car.findById(id)
      .then(function (_car) {
        _car = _.extend(_car, carObj);
        return _car.save();
      })
      .then(function (_car) {
        return res.redirect('/car/' + _car.id);
      })
      .error(function (err) {
        return next(err);
      });
  }
};
module.exports.del = function (req, res, next) {
  var id = req.query.id;
  if (id) {
    // ModelCar.findByIdAndRemove(id, function (err, _car) {
    //   if (err) {
    //     res.status(500).json({
    //       ok: 0
    //     });
    //     return next(err);
    //   } else {
    //     res.json({
    //       ok: 1
    //     });
    //   }
    // });

    Car.destroy({
        where: {
          id: id
        }
      })
      .then(function (row) {
        res.json({
          ok: 1
        });
      })
      .error(function (err) {
        res.status(500).json({
          ok: 0
        });
      });

  } else {
    res.json({
      ok: 0
    });
  }
};
