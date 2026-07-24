const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST - Save Contact Message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();
    console.log('✅ Contact message saved:', name, email);

    res.status(200).json({ 
      message: '✅ Message received! I will get back to you soon.' 
    });

  } catch (error) {
    console.error('❌ Contact error:', error.message);
    res.status(500).json({ 
      message: '❌ Failed to save message.' 
    });
  }
});

// GET - Get All Contact Messages (Admin Only)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Mark as Read
router.put('/:id', async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete Message
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


