const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');

const TypeUser = require('../models/type_user');
const User = require('../models/user');

// Obtener todos los tipos de usuarios
router.get('/getTypesUser',
    async (req, res) => {
    const { count, rows: users } = await TypeUser.findAndCountAll();

    res.json(users);
});

// Obtener el tipo de usuario
router.get('/:id',
    async (req, res) => {
    const id = req.params.id;
    const typeUser = await TypeUser.findOne({
        where: { id }
    });
    
    if (!typeUser) {
        return res.status(404).json({ errorMessage: "No existe ese tipo de usuario" });
    }

    res.json(user);
});

// Crear nuevo tipo de usuario
router.post('/createTypeUser',
  async (req, res) => {
    try{
        const newType = matchedData(req, { locations: ['body'], includeOptionals: true });
        
        const typeUser = await TypeUser.create(newType);
        res.status(201).json({ typeUser });
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    } 
});

// Modificar datos usuario
router.patch('/updateTypeUser/:id',
    param('id').isInt({ gt: 0 }).withMessage("Field must be a positive integer"),
    async (req, res) => {
        var updatedTypeUser = await TypeUser.findByPk(req.params.id);

        if (!updatedTypeUser) {
            return res.status(404).json({ errorMessage: "No existe ese tipo de usuario" });
        }

        try{
            var idMod = req.params.id;
            var modifyTypeUser = matchedData(req, { 
                locations: ['body'], 
                includeOptionals: true 
            });
            updateResult = await TypeUser.update(modifyTypeUser, {
                where: {
                  id: idMod
                }
            });
            updatedTypeUser = await TypeUser.findByPk(req.params.id);
            res.status(200).json({ updatedTypeUser });
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
    }   
);

// Delete tipo de usuario
router.delete('/deleteTypeUser/:id',
  async (req, res) => {
    try{
        var idDel = req.params.id;
        var deleteTypeUser = await TypeUser.findByPk(idDel);

        if (!deleteTypeUser) {
            return res.status(404).json({ errorMessage: "No existe ese tipo de usuario" });
        }
        var respuesta = await TypeUser.destroy({
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

// Modificar el tipo del usuario con su token
router.patch('/updateTypeUser/:token/:idType',
    async (req, res) => {
        var tokenFind = req.params.token;
        var updatedUser = await User.findOne({ where: { token: tokenFind } });

        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }

        var updatedTypeUser = await TypeUser.findByPk(req.params.idType);

        if (!updatedTypeUser) {
            return res.status(404).json({ errorMessage: "No existe ese tipo de usuario" });
        }

        try{
            var updateResult = await User.update(
                { fk_type_users: req.params.idType },
                {
                  where: {
                    token: tokenFind
                  }
                }
            );
            res.status(200).json("Tarifa modificada correctamente");
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
    }   
);


module.exports = router;