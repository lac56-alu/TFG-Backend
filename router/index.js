const router = require('express').Router();

const usersRouter = require('./users');
const loginRouter = require('./login');
const ratesRouter = require('./rates');

router.use('/users', usersRouter);
router.use('/login', loginRouter);
router.use('/rates', ratesRouter);

router.use('*', (req, res) => {
    res.status(404);
    res.json({
        "errorMessage": "Unable to identify Api or Operation for this request"
    })
})

module.exports = router;