const db = require('../utils/db');
const ProductStamp = require('./ProductStamp');

class Visit {
  // Create a new visit with multiple products
  static async create(userId, products, scannedBy, notes = null) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create visit record
      const [visitResult] = await connection.query(
        'INSERT INTO visits (user_id, scanned_by, notes) VALUES (?, ?, ?)',
        [userId, scannedBy, notes]
      );
      
      const visitId = visitResult.insertId;
      
      // Add each product to visit_items and update stamps
      for (const product of products) {
        const { productId, quantity, isFree, price } = product;
        
        // Add to visit_items
        await connection.query(
          'INSERT INTO visit_items (visit_id, product_id, quantity, is_free, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
          [visitId, productId, quantity || 1, isFree || false, price]
        );
        
        // Update stamps (only for paid products)
        if (!isFree) {
          for (let i = 0; i < (quantity || 1); i++) {
            await ProductStamp.addStamps(userId, productId, 1);
          }
        } else {
          // Use free product
          await ProductStamp.useFreeProduct(userId, productId);
        }
      }
      
      await connection.commit();
      return visitId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get visit by ID with items
  static async getById(visitId) {
    const [visits] = await db.query(`
      SELECT v.*, u.first_name, u.last_name, u.email,
             a.username as scanned_by_username
      FROM visits v
      JOIN users u ON v.user_id = u.id
      LEFT JOIN admin_users a ON v.scanned_by = a.id
      WHERE v.id = ?
    `, [visitId]);
    
    if (visits.length === 0) return null;
    
    const visit = visits[0];
    
    // Get visit items
    const [items] = await db.query(`
      SELECT vi.*, p.name as product_name, p.category
      FROM visit_items vi
      JOIN products p ON vi.product_id = p.id
      WHERE vi.visit_id = ?
    `, [visitId]);
    
    visit.items = items;
    return visit;
  }

  // Get all visits for a user
  static async getUserVisits(userId, limit = 50) {
    const [visits] = await db.query(`
      SELECT v.*, a.username as scanned_by_username,
             COUNT(vi.id) as items_count,
             SUM(vi.quantity) as total_products
      FROM visits v
      LEFT JOIN admin_users a ON v.scanned_by = a.id
      LEFT JOIN visit_items vi ON v.id = vi.visit_id
      WHERE v.user_id = ?
      GROUP BY v.id
      ORDER BY v.visit_date DESC
      LIMIT ?
    `, [userId, limit]);
    
    // Get items for each visit
    for (const visit of visits) {
      const [items] = await db.query(`
        SELECT vi.*, p.name as product_name, p.category
        FROM visit_items vi
        JOIN products p ON vi.product_id = p.id
        WHERE vi.visit_id = ?
      `, [visit.id]);
      visit.items = items;
    }
    
    return visits;
  }

  // Get all visits (admin)
  static async getAll(limit = 100, offset = 0) {
    const [visits] = await db.query(`
      SELECT v.*, u.first_name, u.last_name, u.email,
             a.username as scanned_by_username,
             COUNT(vi.id) as items_count,
             SUM(vi.quantity) as total_products
      FROM visits v
      JOIN users u ON v.user_id = u.id
      LEFT JOIN admin_users a ON v.scanned_by = a.id
      LEFT JOIN visit_items vi ON v.id = vi.visit_id
      GROUP BY v.id
      ORDER BY v.visit_date DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    return visits;
  }

  // Get visit statistics
  static async getStats() {
    const [totalVisits] = await db.query('SELECT COUNT(*) as count FROM visits');
    const [totalProducts] = await db.query('SELECT SUM(quantity) as count FROM visit_items');
    const [freeProducts] = await db.query('SELECT SUM(quantity) as count FROM visit_items WHERE is_free = TRUE');
    
    const [popularProducts] = await db.query(`
      SELECT p.name, p.category, SUM(vi.quantity) as total_sold
      FROM visit_items vi
      JOIN products p ON vi.product_id = p.id
      WHERE vi.is_free = FALSE
      GROUP BY vi.product_id
      ORDER BY total_sold DESC
      LIMIT 10
    `);
    
    return {
      totalVisits: totalVisits[0].count,
      totalProducts: totalProducts[0].count || 0,
      freeProducts: freeProducts[0].count || 0,
      popularProducts
    };
  }
}

module.exports = Visit;
