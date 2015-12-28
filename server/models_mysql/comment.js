'use strict';

module.exports = function (sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    classMethods: {
      associate: function (models) {
        Comment.belongsTo(models.Car);
        Comment.belongsTo(models.User, {
          as: 'From',
          constraints: false
        });
        Comment.hasMany(models.Reply);
      },
      fetchByCarId: function (carId, models) {
        return this
          .findAll({
            include: [{
              association: this.associations.Car,
              where: {
                id: carId
              },
              attributes: []
            }, {
              association: this.associations.Replies
            }, {
              association: this.associations.From
            }],
            order: ['createdAt']
          });

      },
    }
  });

  return Comment;
};
