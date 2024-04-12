const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
//const generateApiKey = require('generate-api-key');

const Rate = require('../models/rate');
const User = require('../models/user');

const checkNewRate = [
    body('name').isString().withMessage("Field must be string"),
    body('value').isFloat().withMessage("Field must be float")
];

// Obtener todos las tarifas
router.get('/getRates',
    async (req, res) => {
    const requestURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    //const { skip, limit } = matchedData(req, { includeOptionals: true });
    const { count, rows: rates } = await Rate.findAndCountAll();

    res.json(rates);
});

// Obtener la tarifa con el id pasado en los parametros
router.get('/:id',
    async (req, res) => {
    const id = req.params.id;
    const rateFind = await Rate.findOne({
        where: { id }
    });
    
    if (!rateFind) {
        return res.status(404).json({ errorMessage: "No existe esa tarifa" });
    }

    res.json(rateFind);
});

// Obtener la tarifa con el token del cliente
router.get('/searchRateToken/:token',
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }
            
            const id = user.fk_rates;
            const rateFind = await Rate.findOne({
                where: { id }
            });
            
            if (!rateFind) {
                return res.status(404).json({ errorMessage: "No existe esa tarifa" });
            }
        
            res.json(rateFind);
        
            //res.json(user);
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});

// Crear nueva tarifa
router.post('/createRate',
  checkNewRate,
  async (req, res) => {
    try{
        const newRate = matchedData(req, { locations: ['body'], includeOptionals: true });
        console.log(newRate);
        
        const rate = await Rate.create(newRate);
        res.status(201).json({ rate });
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    } 
});

// Modificar datos tarifa
router.patch('/updateRate/:id',
    checkNewRate,
    async (req, res) => {
        var updatedRate = await Rate.findByPk(req.params.id);

        if (!updatedRate) {
            return res.status(404).json({ errorMessage: "No existe esa tarifa" });
        }

        try{
            var idMod = req.params.id;
            var modifyRate = matchedData(req, { 
                locations: ['body'], 
                includeOptionals: true 
            });
            updateResult = await Rate.update(modifyRate, {
                where: {
                  id: idMod
                }
            });
            updatedRate = await Rate.findByPk(req.params.id);
            res.status(200).json({ updatedRate });
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
    }   
);

// Modificar la tarifa del usuario con su token
router.patch('/updateRateUser/:token/:idRate',
    checkNewRate,
    async (req, res) => {
        var tokenFind = req.params.token;
        var updatedUser = await User.findOne({ where: { token: tokenFind } });

        if (!updatedUser) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }

        var updatedRate = await Rate.findByPk(req.params.idRate);

        if (!updatedRate) {
            return res.status(404).json({ errorMessage: "No existe esa tarifa" });
        }

        try{
            var updateResult = await User.update(
                { fk_rates: req.params.idRate },
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


// Delete tarifa
router.delete('/deleteRate/:id',
  async (req, res) => {
    try{
        var idDel = req.params.id;
        var deleteRate = await Rate.findByPk(idDel);

        if (!deleteRate) {
            return res.status(404).json({ errorMessage: "No existe esa tarifa" });
        }
        var respuesta = await Rate.destroy({
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


// Delete tarifa
router.delete('/deleteRateToken/:token',
  async (req, res) => {
    var tokenFind = req.params.token;
    var updatedUser = await User.findOne({ where: { token: tokenFind } });

    if (!updatedUser) {
        return res.status(404).json({ errorMessage: "No existe ese usuario" });
    }

    try{
        var updateResult = await User.update(
            { fk_rates: null },
            {
                where: {
                    token: tokenFind
                }
            }
        );
        res.status(200).json("Tarifa borrada correctamente");
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    } 
});

module.exports = router;