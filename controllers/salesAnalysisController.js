import db from "../db.js";

const getSalesAnalysis = async (req, res) => {
  const { categories, clientType, minAge, maxAge, startDate, endDate } =
    req.query;

  let query = `
    SELECT c.category_id, c.category_name, cl.gender, cl.age, 
           COUNT(s.sale_id) AS total_sales, SUM(s.total_price) AS revenue
    FROM Sales s
    INNER JOIN Books b ON s.book_id = b.book_id
    INNER JOIN Categories c ON b.category_id = c.category_id
    INNER JOIN Clients cl ON s.client_id = cl.client_id
    WHERE 1=1
  `;

  const params = [];

  if (categories) {
    const categoriesArray = categories.split(",").map((cat) => cat.trim());
    query += ` AND c.category_name IN (${categoriesArray
      .map((_, index) => `$${params.length + index + 1}`)
      .join(", ")})`;
    params.push(...categoriesArray);
  }

  if (clientType) {
    if (clientType === "Men") query += ` AND cl.gender = 'Male'`;
    else if (clientType === "Women") query += ` AND cl.gender = 'Female'`;
  }

  if (minAge && maxAge) {
    query += ` AND cl.age BETWEEN $${params.length + 1} AND $${
      params.length + 2
    }`;
    params.push(minAge, maxAge);
  } else if (minAge) {
    query += ` AND cl.age >= $${params.length + 1}`;
    params.push(minAge);
  } else if (maxAge) {
    query += ` AND cl.age <= $${params.length + 1}`;
    params.push(maxAge);
  }

  if (startDate && endDate) {
    query += ` AND s.sale_date BETWEEN $${params.length + 1} AND $${
      params.length + 2
    }`;
    params.push(startDate, endDate);
  } else if (startDate) {
    query += ` AND s.sale_date >= $${params.length + 1}`;
    params.push(startDate);
  } else if (endDate) {
    query += ` AND s.sale_date <= $${params.length + 1}`;
    params.push(endDate);
  }

  query += ` GROUP BY c.category_id, c.category_name, cl.gender, cl.age`;

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSalesAnalysis;
