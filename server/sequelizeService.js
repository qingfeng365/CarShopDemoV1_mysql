'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(
  'carShop',
  'root',
  '38259343', {
    host: 'localhost',
    dialect: 'mysql'
  });


var sequelizeService = {};
sequelizeService.Sequelize = Sequelize;
sequelizeService.sequelize = sequelize;

sequelizeService.models = {};

var modelpath = path.join(__dirname, 'models_mysql');


fs
  .readdirSync(modelpath)
  .filter(function(file) {
    return (file.indexOf('.js') !== 0);
  })
  .forEach(function(file){
  	var model = sequelize.import(path.join(modelpath, file));
  	sequelizeService.models[model.name] = model;
  });

Object.keys(sequelizeService.models).forEach(function(modelName) {
  if ('associate' in sequelizeService.models[modelName]) {
    sequelizeService.models[modelName].associate(sequelizeService.models);
  }
});
module.exports = sequelizeService;