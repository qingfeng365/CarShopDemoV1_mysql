'use strict';
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
  var Car = sequelize.define('Car', {
    proTitle: DataTypes.STRING,
    brand: DataTypes.STRING,
    series: DataTypes.STRING,
    color: DataTypes.STRING,
    yearStyle: DataTypes.STRING,
    carModelName: DataTypes.STRING,
    ml: DataTypes.STRING,
    kw: DataTypes.STRING,
    gearbox: DataTypes.STRING,
    guidePrice: DataTypes.STRING,
    imageLogo: DataTypes.STRING,
    buyNum: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    charset: 'utf8',
    classMethods: {
      associate: function (models) {

      },
      fetch: function (op) {
        return this
          .findAll(_.extend({
            order: ['createdAt']
          }, op || {}));
      },
      getCount: function (s) {
        if (s) {
          return this
            .count({
              where: {
                $or: [{
                  proTitle: {
                    $like: '%' + s + '%'
                  }
                }, {
                  brand: {
                    $like: '%' + s + '%'
                  }
                }, {
                  series: {
                    $like: '%' + s + '%'
                  }
                }, {
                  carModelName: {
                    $like: '%' + s + '%'
                  }
                }]
              }
            });
        } else {
          return this
            .count();
        }
      },
      findByPage: function (s, page, size) {
        if (s) {
          return this
            .findAll({
              where: {
                $or: [{
                  proTitle: {
                    $like: '%' + s + '%'
                  }
                }, {
                  brand: {
                    $like: '%' + s + '%'
                  }
                }, {
                  series: {
                    $like: '%' + s + '%'
                  }
                }, {
                  carModelName: {
                    $like: '%' + s + '%'
                  }
                }]
              },
              order: ['createdAt'],
              offset: (page - 1) * size,
              limit: size
            });
        } else {
          return this
            .findAll({
              order: ['createdAt'],
              offset: (page - 1) * size,
              limit: size
            });
        }
      }
    }
  });

  return Car;
};
