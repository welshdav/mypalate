'use strict';

// comment-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const comment = sequelize.define('comment', {
    content: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        comment.belongsTo(sequelize.models.post, { foreignKey: 'post_id' });
        comment.belongsTo(sequelize.models.user, { foreignKey: 'from_id' });
      }
    }
  });

  return comment;
};
