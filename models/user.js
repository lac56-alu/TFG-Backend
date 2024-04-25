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
  },
  fk_type_users: {
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
  return apiKey;
}

// SEGURIDAD
User.convertirA32Bytes = function(str) {
  return crypto.createHash('sha256').update(str).digest();
}

User.encriptarPassword = function (password, clave) {
  const cipher = crypto.createCipheriv('aes-256-cbc', clave, Buffer.alloc(16));
  let encrypted = cipher.update(password, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

module.exports = User;