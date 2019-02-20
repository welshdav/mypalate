'use strict';

// follower-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const follower = sequelize.define('follower', {
    
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        follower.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
        follower.belongsTo(sequelize.models.user, { foreignKey: 'follower_id' });
      }
    }
  });

  return follower;
};
