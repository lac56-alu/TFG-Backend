const Sequelize = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define("users", {
  name: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  adress: {
    type: Sequelize.STRING
  },
  identity_document: {
    type: Sequelize.STRING
  }
},
{
  tableName: 'users',
  timestamps: false // Deshabilita las columnas createdAt y updatedAt
});

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