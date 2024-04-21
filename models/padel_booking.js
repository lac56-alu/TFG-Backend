const Sequelize = require('sequelize');
const sequelize = require('./index');

const PadelBooking = sequelize.define("padel_bookings", {
  id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  num_court:{
    type: Sequelize.INTEGER,
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
  tableName: 'padel_bookings',
  timestamps: false,
  timezone: '+02:00'
});

module.exports = PadelBooking;