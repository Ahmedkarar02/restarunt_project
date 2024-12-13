const cron = require('node-cron');
const { Order } = require('../models');

// This cron job runs every hour
cron.schedule('0 * * * *', async () => {
  console.log('Checking for expired orders...');

  try {
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago

    // Find orders that are still pending and older than 4 hours
    const expiredOrders = await Order.findAll({
      where: {
        status: 'pending',
        createdAt: {
          [Op.lt]: fourHoursAgo, // Orders older than 4 hours
        },
      },
    });

    // Update the status of expired orders
    for (const order of expiredOrders) {
      order.status = 'expired';
      await order.save();
      console.log(`Order ${order.id} marked as expired`);
    }
  } catch (error) {
    console.error('Error checking for expired orders:', error.message);
  }
});
