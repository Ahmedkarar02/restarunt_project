const express = require('express');
const { Order, OrderItem, Menu } = require('../models');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');

const router = express.Router();

// Get total sales and order count for a specific period
router.get('/sales', authenticate, authorize(['admin']), async (req, res) => {
  const { startDate, endDate } = req.query; // Expecting start and end dates as query parameters

  if (!startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Start and end date are required' });
  }

  try {
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate total sales and order count within the date range
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end],
        },
        status: 'complete', // We only want completed orders
      },
      include: {
        model: OrderItem,
        include: {
          model: Menu,
          attributes: ['name', 'price'],
        },
      },
    });

    let totalSales = 0;
    let orderCount = 0;

    orders.forEach(order => {
      orderCount++;
      order.OrderItems.forEach(item => {
        totalSales += item.quantity * item.Menu.price;
      });
    });

    res.json({
      success: true,
      data: {
        totalSales,
        orderCount,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
  }
});

router.get('/export/csv', authenticate, authorize(['admin']), async (req, res) => {
    const { startDate, endDate } = req.query;
  
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Start and end date are required' });
    }
  
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const orders = await Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [start, end],
          },
          status: 'complete',
        },
        include: {
          model: OrderItem,
          include: {
            model: Menu,
            attributes: ['name', 'price'],
          },
        },
      });
  
      const orderData = orders.map(order => ({
        orderId: order.id,
        userId: order.userId,
        totalAmount: order.OrderItems.reduce((acc, item) => acc + item.quantity * item.Menu.price, 0),
        orderCount: order.OrderItems.length,
        createdAt: order.createdAt,
      }));
  
      // Convert to CSV
      const csvParser = new Parser();
      const csvData = csvParser.parse(orderData);
  
      res.header('Content-Type', 'text/csv');
      res.attachment('orders.csv');
      return res.send(csvData);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error exporting CSV', error: error.message });
    }
  });

module.exports = router;
