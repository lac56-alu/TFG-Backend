const Sequelize = require('sequelize');
const sequelize = require('./index');

const TypeUser = sequelize.define("type_user", {
  id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  }
},
{
  tableName: 'type_users',
  timestamps: false 
});

module.exports = TypeUser;