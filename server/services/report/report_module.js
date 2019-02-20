'use strict';

// report-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const report = sequelize.define('report', {
    contentType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contentId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    freezeTableName: true
  });

  return report;
};
