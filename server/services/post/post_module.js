'use strict';

// post-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const post = sequelize.define('post', {
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    recipe: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    image_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        post.belongsTo(sequelize.models.user, { foreignKey: 'user_id' });
      }
    }
  });

  return post;
};
