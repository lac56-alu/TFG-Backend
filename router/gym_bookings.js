const router = require('express').Router();
const { query, matchedData, body, param } = require('express-validator');
//const generateApiKey = require('generate-api-key');
const moment = require('moment-timezone');
const Sequelize = require("sequelize");



const User = require('../models/user');
const GymBooking = require('../models/gym_booking');

const checkNewBooking = [
    body('date').isDate().withMessage("Field must be date"),
    body('fk_users').isInt().withMessage("Field must be int")
];

function checkAdmin(user) {
    if (user.fk_type_users == 1) {
        return true;
    } else {
        return false;
    }
}

// Obtener todas las reservas del gimnasio
router.get('/getGymBookings',
    async (req, res) => {
        try{
            const { count, rows: bookings } = await GymBooking.findAndCountAll();

            if (!bookings) {
                return res.status(404).json({ errorMessage: "No existen reservas" });
            }
        
            res.json(bookings);
        }catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        }
});


// Obtener todas las reservas del gimnasio
router.get('/getGymBookingsAdmin/:token',
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
                const { count, rows: bookings } = await GymBooking.findAndCountAll();
            
                if (!bookings) {
                    return res.status(404).json({ errorMessage: "No existen reservas" });
                }
            
                res.json(bookings);
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


// Obtener la reserva del gimnasio
router.get('/getGymBooking/:id',
    async (req, res) => {
        try{
            const id = req.params.id;
            const bookingFind = await GymBooking.findOne({
                where: { id }
            });
            
            if (!bookingFind) {
                return res.status(404).json({ errorMessage: "No existe esa reserva" });
            }

            res.json(bookingFind);
        }
        catch (error) {
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        }
});


// Obtener la reserva del gimnasio para el usuario
router.get('/searchGymBooking/:token',
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }

            fk_users = user.id;
            const bookingFind = await GymBooking.findAndCountAll({
                where: { fk_users }
            });
            
            if (!bookingFind) {
                return res.status(404).json({ errorMessage: "No existen reservas" });
            }

            res.json(bookingFind.rows);
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});


// Obtener la reserva del gimnasio para el usuario
router.get('/searchGymBookingToday/:token',
    async (req, res) => {
        try{
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }

            fk_users = user.id;
            const currentDate = moment().tz('Europe/Madrid').format('YYYY-MM-DD');
            const conditionDate = Sequelize.literal(`DATE(date) = '${currentDate}'`);
            const bookingFind = await GymBooking.findAndCountAll({
                where: { 
                    fk_users, 
                    conditionDate,
                }
            });
            
            if (!bookingFind) {
                return res.status(404).json({ errorMessage: "No existen reservas" });
            }

            res.json(bookingFind.rows);
        }
        catch (error) {
            // Manejo de la excepción
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});


// Crear nueva reserva
router.post('/createGymBooking/:token/:hour',
    checkNewBooking,
    async (req, res) => {
        try{
            const hourParam = req.params.hour;
            const hourBooking = parseInt(hourParam) + 2;
            const token = req.params.token;
            const user = await User.findOne({
                where: { token }
            });
            
            if (!user) {
                return res.status(404).json({ errorMessage: "No existe ese usuario" });
            }

            const currentDate = moment().tz('Europe/Madrid').format('YYYY-MM-DD');
            const dateBooking = currentDate.toString() + " " + hourBooking + ":00:00"
            console.log(dateBooking);
            const booking = await GymBooking.create({
                date: dateBooking,
                fk_users: user.id,
            });
            res.status(201).json({ booking });
        }
        catch (error) {
            console.error('Se produjo un error:', error.message);
            res.status(400).json({ errorMessage: error.message });
        } 
});

router.delete('/deleteGymBooking/:token/:id',
  async (req, res) => {
    try{
        const token = req.params.token;
        const user = await User.findOne({
            where: { token }
        });
        
        if (!user) {
            return res.status(404).json({ errorMessage: "No existe ese usuario" });
        }

        var idDel = req.params.id;
        var deleteGymBooking = await GymBooking.findByPk(idDel);

        if (!deleteGymBooking) {
            return res.status(404).json({ errorMessage: "No existe esa reserva" });
        }
        var respuesta = await GymBooking.destroy({
            where: {
                id: idDel
            }
        });
        res.status(200).json();  
    }
    catch (error) {
        // Manejo de la excepción
        console.error('Se produjo un error:', error.message);
        res.status(400).json({ errorMessage: error.message });
    }
});


module.exports = router;