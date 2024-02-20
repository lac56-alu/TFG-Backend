const router = require('express').Router();

const usersRouter = require('./users');

router.use('/users', usersRouter);

router.use('*', (req, res) => {
    res.status(404);
    res.json({
        "errorMessage": "Unable to identify Api or Operation for this request"
    })
})

module.exports = router;