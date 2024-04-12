const Sequelize = require('sequelize');
const sequelize = require('./index');
const crypto = require('crypto');

const User = sequelize.define("users", {
  id:{
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {   // same as above, but constructing the RegExp from a string
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING
  },
  adress: {
    type: Sequelize.STRING
  },
  identity_document: {
    type: Sequelize.STRING
  },
  telephone: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  },
  fk_rates: {
    type: Sequelize.BIGINT
  }
},
{
  tableName: 'users',
  timestamps: false // Deshabilita las columnas createdAt y updatedAt
});

User.generateKey = function(){
  var randomBytes = crypto.randomBytes(32);
  var apiKey = randomBytes.toString('hex');
  return apiKey
}

/*
User.prototype.isValidPassword = function(password) {
  console.log(password, this.password, bcrypt.compareSync(password, this.password));
  return bcrypt.compareSync(password, this.password);
};

User.genCreditCardHash = function(creditCard) {
  const salt = process.env.CC_SALT || "$2b$10$Qcdj3xcmao1tBJKVUFVwju";

  return bcrypt.hashSync(creditCard.toString(), salt);
}
*/

module.exports = User;