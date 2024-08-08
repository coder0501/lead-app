const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

router.post('/', async (req, res) => {
  const { name, number, email, product } = req.body;
    
  try {
    console.log("create lead")
    const newLead = new Lead({ name, number, email, product });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { search, sort } = req.query;

  try {
    let leads = await Lead.find();

    if (search) {
      leads = leads.filter(lead =>
        lead.name.includes(search) ||
        lead.number.includes(search) ||
        lead.email.includes(search) ||
        lead.product.includes(search)
      );
    }

    if (sort) {
      leads = leads.sort((a, b) => a[sort] > b[sort] ? 1 : -1);
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update lead by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    let updateData = req.body;
  
    try {
      // Convert empty strings to null to clear fields
      updateData = Object.fromEntries(
        Object.entries(updateData).map(([key, value]) => [key, value === '' ? null : value])
      );
  
      // Validate that at least one field is provided for update
      if (!Object.keys(updateData).length) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }
  
      // Find lead by ID and update only provided fields
      const updatedLead = await Lead.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
  
      if (!updatedLead) {
        return res.status(404).json({ error: 'Lead not found' });
      }
  
      res.json(updatedLead);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
    
  

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Lead.findByIdAndDelete(id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
