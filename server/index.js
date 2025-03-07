const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Slot = require('./model/slotSchema');
const dayjs = require('dayjs')


const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/appointmentDB');
const availableTimes = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];




app.get('/slots', async (req, res) => {
    const date = req.query.date || dayjs().format('YYYY-MM-DD');
    let slots = await Slot.find({ date });
    if (slots.length === 0) {
        slots = availableTimes.map(time => ({ date, time, booked: false, name: '', phone: '' }));
    }
    res.json(slots);
});
app.post('/book', async (req, res) => {
    const { date, time, name, phone } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required to book a slot' });
    }
    const existingSlot = await Slot.findOne({ date, time });
    if (existingSlot && existingSlot.booked) {
        return res.status(400).json({ message: 'Slot already booked' });
    }
    await Slot.updateOne({ date, time }, { booked: true, name, phone }, { upsert: true });
    res.json({ message: 'Appointment booked successfully' });
});

app.listen(3001, () => console.log('Server running on port 3001'));
