const express = require('express')
const router = express.Router()
const Car = require('../models/Car')
require('express-async-errors')
const { currentUser, requireAdmin } = require('../middleware/middlewares')

var ImageKit = require("imagekit");

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_URL,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});
// GET Route
router.get('/', async (req, res) => {
    const cars = await Car.find()
    res.send(cars)
})

// POST Route
router.post('/new', currentUser, requireAdmin, async (req, res) => {
    let car = new Car({
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        year: req.body.year,
        images: req.body.images,
        pricePerDay: req.body.price
    })
    car = await car.save()
    res.send(car)
})


router.get('/:id', async (req, res) => {
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).send('The car with the given ID was not found.')
    res.send(car)
})
// PUT Route
router.put('/:id', currentUser, requireAdmin, async (req, res) => {
    const car = await Car.findByIdAndUpdate(req.params.id, {
        brand: req.body.brand,
        model: req.body.model,
        category: req.body.category,
        year: req.body.year,
        images: req.body.images,
        pricePreDay: req.body.price
    }, { new: true })
    if (!car) return res.status(404).send('The car with the given ID was not found.')
    res.send(car)
})

// DELETE Route
router.delete('/:id', currentUser, requireAdmin, async (req, res) => {

    const car = await Car.findByIdAndRemove(req.params.id)
    if (!car) return res.status(404).send('The car with the given ID was not found.')
    if (car.images.length > 0) {
        car.images.forEach(item => {

            imagekit.deleteFile(item.id, function (error, result) {
                if (error) error;
                else return;
            });
        })
    }
    res.send(car)
})

module.exports = router