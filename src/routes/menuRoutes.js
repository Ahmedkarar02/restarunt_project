const express = require('express');
const { Menu } = require('../models');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a menu item
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const menu = await Menu.create({ name, description, price, category });
    res.status(201).json({ success: true, message: 'Menu item created', data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating menu item', error: error.message });
  }
});

// Get all menu items (with filtering and sorting)
router.get('/', async (req, res) => {
  const { category, sort } = req.query;
  const filters = category ? { category } : {};
  const order = sort === 'desc' ? [['price', 'DESC']] : [['price', 'ASC']];

  try {
    const menus = await Menu.findAll({ where: filters, order });
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu items', error: error.message });
  }
});

// Update a menu item
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  try {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await menu.update({ name, description, price, category });
    res.json({ success: true, message: 'Menu item updated', data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating menu item', error: error.message });
  }
});

// Delete a menu item
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    await menu.destroy();
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting menu item', error: error.message });
  }
});

module.exports = router;
