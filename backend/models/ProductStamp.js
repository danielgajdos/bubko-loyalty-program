const db = require('../utils/db');

class ProductStamp {
  // Get all stamps for a user
  static async getUserStamps(userId) {
    const [rows] = await db.query(`
      SELECT ps.*, p.name as product_name, p.category, p.price
      FROM product_stamps ps
      JOIN products p ON ps.product_id = p.id
      WHERE ps.user_id = ? AND p.active = TRUE
      ORDER BY p.category, p.name
    `, [userId]);
    return rows;
  }

  // Get stamps for specific product
  static async getStamps(userId, productId) {
    const [rows] = await db.query(
      'SELECT * FROM product_stamps WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows[0];
  }

  // Add stamps (when product is purchased)
  static async addStamps(userId, productId, quantity = 1) {
    // Get current stamps
    let stamps = await this.getStamps(userId, productId);
    
    if (!stamps) {
      // Create new record
      await db.query(
        'INSERT INTO product_stamps (user_id, product_id, stamps_count) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      stamps = await this.getStamps(userId, productId);
    } else {
      // Update existing
      const newCount = stamps.stamps_count + quantity;
      const freeEarned = Math.floor(newCount / 10) - stamps.free_products_earned;
      
      await db.query(`
        UPDATE product_stamps 
        SET stamps_count = stamps_count + ?,
            free_products_earned = free_products_earned + ?
        WHERE user_id = ? AND product_id = ?
      `, [quantity, freeEarned, userId, productId]);
      
      stamps = await this.getStamps(userId, productId);
    }
    
    return stamps;
  }

  // Use free product
  static async useFreeProduct(userId, productId) {
    const stamps = await this.getStamps(userId, productId);
    
    if (!stamps || stamps.free_products_earned <= stamps.free_products_used) {
      throw new Error('No free products available');
    }
    
    await db.query(`
      UPDATE product_stamps 
      SET free_products_used = free_products_used + 1,
          stamps_count = stamps_count - 10
      WHERE user_id = ? AND product_id = ?
    `, [userId, productId]);
    
    return await this.getStamps(userId, productId);
  }

  // Get available free products count
  static async getAvailableFreeProducts(userId, productId) {
    const stamps = await this.getStamps(userId, productId);
    if (!stamps) return 0;
    return stamps.free_products_earned - stamps.free_products_used;
  }
}

module.exports = ProductStamp;
