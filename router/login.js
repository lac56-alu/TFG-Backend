const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
const crypto = require('crypto');

const User = require('../models/user');


// Modulos de ayuda
const checkParamsUser = [
    body('email').isEmail().withMessage("Field must be an email"),
    body('password').isString().withMessage("Field must be a string")
];



// Login
router.post('/',
checkParamsUser,
  async (req, res) => {
    var loginUser = matchedData(req, { 
        locations: ['body'], 
        includeOptionals: true 
    });

    try{
        const user = await User.findOne({
            where: { email: loginUser.email }
        });

        if(loginUser.password === user.password){
            var token = user.token
            res.status(201).json({ token });
        }
        else{
            res.status(403).json({ errorMessage: "Credenciales incorrectas." });
        }
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.parent.sqlMessage);
        res.status(400).json({ errorMessage: error.parent.sqlMessage });
    } 
});


module.exports = router;