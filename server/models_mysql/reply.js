'use strict';

module.exports = function (sequelize, DataTypes) {
  var Reply = sequelize.define('Reply', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    classMethods: {
      associate: function (models) {
        Reply.belongsTo(models.Comment);
        Reply.belongsTo(models.User, {
          as: 'From',
          constraints: false
        });
        Reply.belongsTo(models.User, {
          as: 'To',
          constraints: false
        });
      }
    }
  });
  return Reply;
};
