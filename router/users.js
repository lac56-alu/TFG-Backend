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
    body('telephone').isString().withMessage("Field must be a string")
];



// Obtener todos los usuarios
router.get('/getUsers',
    /*
    isAuthenticated,
    isAdmin,
    query('skip').default(0).isInt({ gt: -1 }).withMessage("Field must be a positve integer").toInt(),
    query('limit').default(10).isInt({ gt: -1 }).withMessage("Field must be a positve integer").toInt(),
    validationResponse,
    */
    async (req, res) => {
    const requestURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //const { skip, limit } = matchedData(req, { includeOptionals: true });
    const { count, rows: users } = await User.findAndCountAll();

    res.json(users);
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

router.get('/token/:token',
    //param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({
        where: { token }
    });
    
    if (!user) {
        return res.status(404).json({ errorMessage: "No existe ese usuario" });
    }

    res.json(user);
});

// Crear nuevo usuario
router.post('/createUser',
  checkNewUser,
  async (req, res) => {
    //const newUser = new User();
    try{
        const newUser = matchedData(req, { locations: ['body'], includeOptionals: true });
        /*
        newUser.name = req.body.name
        newUser.lastname = req.body.lastname
        newUser.adress = req.body.adress
        newUser.identity_document = req.body.identity_document
        newUser.telephone = req.body.telephone
        newUser.email = req.body.email
        newUser.password = req.body.password
        */
        newUser.token = User.generateKey();
        console.log(newUser);
        
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


module.exports = router;