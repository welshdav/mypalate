'use strict';

// rating-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const rating = sequelize.define('rating', {
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        rating.belongsTo(sequelize.models.user, { foreignKey: 'from_id' });
        rating.belongsTo(sequelize.models.post, { foreignKey: 'post_id' });
      }
    }
  });

  return rating;
};
