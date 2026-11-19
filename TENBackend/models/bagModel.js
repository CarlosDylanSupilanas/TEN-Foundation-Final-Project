import db from "../config/db.js";

// "AS" renames columns so React gets productName, productCode...
export const fetchAllBags = async () => {
  const [rows] = await db.query(
    "SELECT id, product_name AS productName, product_code AS productCode, category, color, quantity FROM bags",
  );
  return rows;
};

export const findBagById = async (id) => {
  const [rows] = await db.query("SELECT * FROM bags WHERE id = ?", [id]);
  return rows;
};

export const findBagByCode = async (productCode) => {
  const [rows] = await db.query("SELECT * FROM bags WHERE product_code = ?", [
    productCode,
  ]);
  return rows;
};

export const insert = async (bag) => {
  const [result] = await db.query(
    "INSERT INTO bags (product_name, product_code, category, color, quantity) VALUES (?, ?, ?, ?, ?)",
    [bag.productName, bag.productCode, bag.category, bag.color, bag.quantity],
  );
  return result.insertId;
};

export const remove = async (id) => {
  await db.query("DELETE FROM bags WHERE id = ?", [id]);
  return id;
};

export const update = async (id, bag) => {
  await db.query(
    "UPDATE bags SET product_name = ?, product_code = ?, category = ?, color = ?, quantity = ? WHERE id = ?",
    [bag.productName, bag.productCode, bag.category, bag.color, bag.quantity, id],
  );
  return id;
};

export const ship = async (bag, amount) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE bags SET quantity = quantity - ? WHERE id = ? AND quantity >= ?",
      [amount, bag.id, amount],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.query(
      "INSERT INTO shipments (bag_id, product_name, product_code, color, quantity) VALUES (?, ?, ?, ?, ?)",
      [bag.id, bag.product_name, bag.product_code, bag.color, amount],
    );

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};