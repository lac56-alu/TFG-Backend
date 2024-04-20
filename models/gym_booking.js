const Sequelize = require('sequelize');
const sequelize = require('./index');

const GymBooking = sequelize.define("gym_bookings", {
  id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATE,
    timezone: '+02:00', 
  },
  fk_users: {
    type: Sequelize.BIGINT
  }
},
{
  tableName: 'gym_bookings',
  timestamps: false,
  timezone: '+02:00'
});

module.exports = GymBooking;