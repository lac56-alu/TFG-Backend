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
    try{
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        console.log('\x1b[33m%s\x1b[0m', "PARAMETROS --> ", req.body.email, req.body.password);
        console.log('\x1b[33m%s\x1b[0m', "BUSQUEDA --> ", user);

        if(req.body.password == user.password){
            var token = user.token
            res.status(201).json({ token });
        }
        else{
            res.status(403).json({ errorMessage: "Credenciales incorrectas." });
        }
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    } 
});


module.exports = router;