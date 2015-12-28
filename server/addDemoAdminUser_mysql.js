'use strict';

var sequelizeService = require('./sequelizeService');

sequelizeService.sequelize
  .sync()
  .then(function() {
    var User = sequelizeService.models.User;

    var adminUserArray = [{
      name: 'admin',
      password: 'admin',
      level: 900
    }, {
      name: 'superadmin',
      password: 'superadmin',
      level: 999
    }];

    User
      .bulkCreate(adminUserArray,{individualHooks:true})
      .then(function() {
        console.log('新增 %d 条记录', adminUserArray.length);
      })
      .error(function(err) {
        console.log(err);
      });
  });
