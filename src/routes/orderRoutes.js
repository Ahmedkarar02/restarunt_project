const express = require('express');
const { Order, OrderItem, Menu } = require('../models');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

const router = express.Router();

// Create an order
router.post('/', authenticate, authorize(['staff']), async (req, res) => {
  const { items } = req.body;  // Expected format: [{ menuId: 1, quantity: 2 }, { menuId: 2, quantity: 1 }]
  
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items provided for the order' });
  }

  try {
    // Create the order
    const order = await Order.create({ status: 'pending', userId: req.user.id });

    // Create order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await Menu.findByPk(item.menuId);
        if (!menuItem) {
          throw new Error(`Menu item with id ${item.menuId} not found`);
        }
        return OrderItem.create({
          orderId: order.id,
          menuId: item.menuId,
          quantity: item.quantity,
          price: menuItem.price,
        });
      })
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      orderItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
  }
});

// Add item to order
router.post('/:orderId/items', authenticate, authorize(['staff']), async (req, res) => {
    const { orderId } = req.params;
    const { menuId, quantity } = req.body;
  
    if (!menuId || !quantity) {
      return res.status(400).json({ success: false, message: 'Menu ID and quantity are required' });
    }
  
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      const menuItem = await Menu.findByPk(menuId);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
      }
  
      const orderItem = await OrderItem.create({
        orderId,
        menuId,
        quantity,
        price: menuItem.price,
      });
  
      res.status(201).json({
        success: true,
        message: 'Item added to order successfully',
        orderItem,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error adding item to order', error: error.message });
    }
  });
  
// Remove item from order
router.delete('/:orderId/items/:itemId', authenticate, authorize(['staff']), async (req, res) => {
    const { orderId, itemId } = req.params;
  
    try {
      // Find the order by ID
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      // Find the order item by ID and make sure it belongs to the specified orderId
      const orderItem = await OrderItem.findOne({
        where: { id: itemId, orderId: orderId },
      });
  
      if (!orderItem) {
        return res.status(404).json({ success: false, message: 'Item not found in this order' });
      }
  
      // Delete the order item
      await orderItem.destroy();
  
      res.status(200).json({
        success: true,
        message: 'Item removed from order successfully',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error removing item from order', error: error.message });
    }
  });

// Admin view all orders
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: {
          model: OrderItem,
          include: {
            model: Menu,
            attributes: ['name', 'price'],
          },
        },
      });
  
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
  });
  
// Mark order as complete
router.put('/:orderId/complete', authenticate, authorize(['staff']), async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      order.status = 'complete';
      await order.save();
  
      res.status(200).json({
        success: true,
        message: 'Order marked as complete',
        order,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error marking order as complete', error: error.message });
    }
  });
  
module.exports = router;
