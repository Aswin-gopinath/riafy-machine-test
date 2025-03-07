const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    date: String,
    time: String,
    booked: Boolean,
    name: String,
    phone: String
});

const Slot = mongoose.model('Slot', SlotSchema);

module.exports = Slot;