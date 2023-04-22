const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true, message: "Brand can't be empty" },
    model: { type: String, required: true, message: "Model can't be empty" },
    category: { type: String, required: true, message: "Category can't be empty" },
    images: [{
        name: String,
        id: String
    }],
    pricePerDay: { type: Number, required: true, message: "Category can't be empty", min: [0, 'Must be must be greater than 0'], }
})
carSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});
const Car = mongoose.model('Car', carSchema)

module.exports = Car