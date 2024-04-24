const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
//const generateApiKey = require('generate-api-key');

const User = require('../models/user');


// Modulos de ayuda
const checkNewUser = [
    body('name').isString().withMessage("Field must be string"),
    body('lastname').isString().withMessage("Field must be string"),
    body('email').isEmail().withMessage("Field must be an email"),
    body('password').isString().withMessage("Field must be a string"),
    body('adress').isString().withMessage("Field must be a string"),
    body('identity_document').isString().withMessage("Field must be a string"),
    body('token').isString().withMessage("Field must be a string"),
    body('telephone').isString().withMessage("Field must be a string"),
    body('fk_type_users').isNumeric().withMessage("Field must be a number")
];

function checkAdmin(user) {
    if (user.fk_type_users == 1) {
        return true;
    } else {
        return false;
    }
}


// Obtener todos los usuarios
router.get('/getUsers',
    async (req, res) => {
    const requestURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //const { skip, limit } = matchedData(req, { includeOptionals: true });
    const { count, rows: users } = await User.findAndCountAll();

    res.json(users);
});

router.get('/getUsersAdmin/:token',
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }
            if(checkAdmin(user)){
                const { count, rows: users } = await User.findAndCountAll();
            
                if (!users) {
                    return res.status(404).json({ errorMessage: "No existen usuarios" });
                }
            
                res.json(users);
            } else{
                return res.status(402).json({ errorMessage: "No tienes permisos" });
            }

            
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        }
});

// Obtener el usuario con el id pasado en los parametros
router.get('/:id',
    //param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({
        where: { id }
    });
    
    if (!user) {
        return res.status(404).json({ errorMessage: "No existe ese usuario" });
    }

    res.json(user);
});

router.get('/searchToken/:token',
    //param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }
        
            res.json(user);
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});

// Crear nuevo usuario
router.post('/createUser',
  checkNewUser,
  async (req, res) => {
    try{
        const newUser = matchedData(req, { locations: ['body'], includeOptionals: true });
        newUser.token = User.generateKey();
        
        const user = await User.create(newUser);
        res.status(201).json({ user });
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    } 
});

// Modificar datos usuario
router.patch('/updateUser/:id',
    param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    checkNewUser,
    async (req, res) => {
        var updatedUser = await User.findByPk(req.params.id);

        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }

        try{
            var idMod = req.params.id;
            var modifyUser = matchedData(req, { 
                locations: ['body'], 
                includeOptionals: true 
            });
            updateResult = await User.update(modifyUser, {
                where: {
                  id: idMod
                }
            });
            updatedUser = await User.findByPk(req.params.id);
            res.status(200).json({ updatedUser });
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
    }   
);

router.patch('/updateUserToken/:token',
    checkNewUser,
    async (req, res) => {
        var tokenEdit = req.params.token;
        var updatedUser = await User.findOne({ where: { token: tokenEdit } });

        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }

        try{
            var modifyUser = matchedData(req, { 
                locations: ['body'], 
                includeOptionals: true 
            });
            var updateResult = await User.update(modifyUser, {
                where: {
                    token: tokenEdit
                }
            });
            updatedUser = await User.findOne({ where: { token: tokenEdit } });
            res.status(200).json({ updatedUser });
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
    }   
);


// Delete usuario
router.delete('/deleteUser/:id',
  async (req, res) => {
    try{
        var idDel = req.params.id;
        var deleteUser = await User.findByPk(idDel);

        if (!deleteUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }
        var respuesta = await User.destroy({
            where: {
                id: idDel
            }
        });
        res.status(200).json();
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(404).json({ errorMessage: error.message });
    } 
});

router.delete('/deleteUserToken/:token',
  async (req, res) => {
    try{
        var tokenDel = req.params.token;
        var deleteUser = await User.findOne({ where: { token: tokenDel } });

        if (!deleteUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }
        var respuesta = await User.destroy({
            where: {
                id: deleteUser.id
            }
        });
        res.status(200).json();
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(404).json({ errorMessage: error.message });
    } 
});

router.delete('/deleteUserAdmin/:token/:id',
  async (req, res) => {
    try{
        const token = req.params.token;
        const user = await User.findOne({
            where: { token }
        });
        
        if (!user) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }
        if(checkAdmin(user)){
            var idDel = req.params.id;
            var deleteUser = await User.findByPk(idDel);
    
            if (!deleteUser) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }
            var respuesta = await User.destroy({
                where: {
                    id: idDel
                }
            });
            res.status(200).json();
        } else{
            return res.status(402).json({ errorMessage: "No tienes permisos" });
        }   
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    }
});


// Comprobar admin
router.get('/userType/:token',
    //param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }
            
            const idType = user.fk_type_users;
            if(idType == 1){
                console.log("aqui --> true", idType)
                return res.status(202).json({ comprobar: true });
            }
            else{
                console.log("aqui --> false", idType)
                return res.status(202).json({ comprobar: false });
            }
        
            //res.json(user);
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});



module.exports = router;