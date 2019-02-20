'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const alert = sequelize.define('alert', {
    category: {
      type: Sequelize.ENUM('comment','rate','new_follower'),
      allowNull: true
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        alert.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
        alert.belongsTo(sequelize.models.user, { foreignKey: 'from_id' });
        alert.belongsTo(sequelize.models.post, { foreignKey: 'post_id' });
      }
    }
  });

  return alert;
};
