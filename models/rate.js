const Sequelize = require('sequelize');
const sequelize = require('./index');

const Rate = sequelize.define("rates", {
  id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  value: {
    type: Sequelize.FLOAT
  }
},
{
  tableName: 'rates',
  timestamps: false // Deshabilita las columnas createdAt y updatedAt
});

module.exports = Rate;