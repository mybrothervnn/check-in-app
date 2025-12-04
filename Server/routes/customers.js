const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Reward milestones
const MILESTONES = [5, 10, 15, 20];
const REWARDS = {
  5: { discount: 10, description: 'Giảm 10% cho hóa đơn này' },
  10: { discount: 15, description: 'Giảm 15% cho hóa đơn này' },
  15: { discount: 20, description: 'Giảm 20% cho hóa đơn này' },
  20: { discount: 25, description: 'Giảm 25% cho hóa đơn này' }
};

// Create or register a customer.
router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing name or phone' });
  }

  try {
    // Save phone last 6 digits as canonical
    const canonicalPhone = phone.slice(-6);

    // Check if exists
    let customer = await Customer.findOne({ phone: canonicalPhone });
    if (!customer) {
      customer = new Customer({ name, phone: canonicalPhone });
      await customer.save();
    } else {
      // update name if changed
      if (customer.name !== name) {
        customer.name = name;
        await customer.save();
      }
    }

    res.status(201).json({ customer });
  } catch (err) {
    console.error('Create customer error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get customer by phone (last 6 digits accepted)
router.get('/:phone', async (req, res) => {
  const phone = req.params.phone.slice(-6);
  try {
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ customer });
  } catch (err) {
    console.error('Get customer error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check-in (increment visits)
router.post('/:phone/checkin', async (req, res) => {
  const phone = req.params.phone.slice(-6);
  console.log('Check-in request received',req);
  try {
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    customer.visits += 1;
    await customer.save();

    // Check milestones
    const milestoneReached = MILESTONES.find((m) => m === customer.visits);
    const reward = milestoneReached ? REWARDS[milestoneReached] : null;

    res.json({ customer, reward });
  } catch (err) {
    console.error('Check-in error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Return next milestone info
router.get('/:phone/rewards', async (req, res) => {
  const phone = req.params.phone.slice(-6);
  try {
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const next = MILESTONES.find((m) => m > customer.visits) || null;
    const remaining = next ? next - customer.visits : 0;
    res.json({ visits: customer.visits, next, remaining });
  } catch (err) {
    console.error('Rewards error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public route to list milestones
router.get('/', (req, res) => {
  const milestonesWithRewards = MILESTONES.map((m) => ({ milestone: m, reward: REWARDS[m] }));
  res.json({ milestones: milestonesWithRewards });
});

module.exports = router;
