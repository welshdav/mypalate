'use strict';

// user-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const user = sequelize.define('user', {
    facebookId: {
      type: Sequelize.STRING,
      allowNull: true
    },
    registration_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'default.png'
    },
    rank: {
      type: Sequelize.ENUM('commis', 'line_cook', 'sous_cook', 'executive_chef', 'master_chef'),
      allowNull: true,
      defaultValue: 'commis'
    },
    user_type: {
      type: Sequelize.ENUM('home_cook', 'restaurant_chef'),
      allowNull: true,
      defaultValue: 'home_cook'
    },
    comment_notifications: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    rating_notifications: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    follower_notifications: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
      freezeTableName: true,
      classMethods: {
      }
    });

  return user;
};
