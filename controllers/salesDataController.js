import db from "../db.js"; // Adjust the import based on your file structure

const getSalesData = async (req, res) => {
  const query = `
    SELECT s.sale_id, 
           b.title AS book_title, 
           c.name AS client_name, 
           s.sale_date, 
           s.quantity, 
           s.total_price
    FROM Sales s
    JOIN Books b ON s.book_id = b.book_id
    JOIN Clients c ON s.client_id = c.client_id
    ORDER BY s.sale_date DESC;
  `;

  try {
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSalesData;
