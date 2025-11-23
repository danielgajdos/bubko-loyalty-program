const db = require('../utils/db');

class Product {
  static async getAll() {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE active = TRUE ORDER BY category, name'
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async getByCategory(category) {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE category = ? AND active = TRUE ORDER BY name',
      [category]
    );
    return rows;
  }

  static async create(productData) {
    const { name, category, price } = productData;
    const [result] = await db.query(
      'INSERT INTO products (name, category, price) VALUES (?, ?, ?)',
      [name, category, price]
    );
    return result.insertId;
  }

  static async update(id, productData) {
    const { name, category, price, active } = productData;
    await db.query(
      'UPDATE products SET name = ?, category = ?, price = ?, active = ? WHERE id = ?',
      [name, category, price, active, id]
    );
  }

  static async delete(id) {
    await db.query('UPDATE products SET active = FALSE WHERE id = ?', [id]);
  }
}

module.exports = Product;
