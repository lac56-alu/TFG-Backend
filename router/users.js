const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
//const generateApiKey = require('generate-api-key');

const User = require('../models/user');

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


module.exports = router;