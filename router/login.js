const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
const crypto = require('crypto');

const User = require('../models/user');
const password_IV = 'password12345_pass'
const password_bytes = User.convertirA32Bytes(password_IV);


// Modulos de ayuda
const checkParamsUser = [
    body('email').isEmail().withMessage("Field must be an email"),
    body('password').isString().withMessage("Field must be a string")
];



// Login
router.post('/',
    checkParamsUser,
    async (req, res) => {
    try{
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        var passwordEncript = User.encriptarPassword(req.body.password.toString(), password_bytes);
        
        if(passwordEncript.toString() == user.password){
            var token = user.token
            res.status(201).json({ token });
        }
        else{
            res.status(403).json({ errorMessage: "Credenciales incorrectas." });
        }
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error);
        res.status(400).json({ errorMessage: error.message });
    } 
});


module.exports = router;