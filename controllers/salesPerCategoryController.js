import db from "../db.js";

const getSalesPerCategory = async (req, res) => {
  const { gender, ageMin, ageMax, startDate, endDate } = req.query;

  let baseQuery = `
        SELECT cat.category_name AS category_name,
               COUNT(*) AS TotalSales
        FROM Sales s
        INNER JOIN Books b ON s.book_id = b.book_id
        INNER JOIN Clients c ON s.client_id = c.client_id
        INNER JOIN Categories cat ON b.category_id = cat.category_id
        WHERE s.sale_date BETWEEN $1 AND $2
    `;

  const params = [];
  let conditions = [];

  // Ensure startDate and endDate are provided
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required." });
  }

  // Add date parameters to params array
  params.push(startDate);
  params.push(endDate);

  // Handle gender filter
  if (gender && gender !== "All") {
    conditions.push(`c.gender = $${params.length + 1}`);
    params.push(gender);
  }

  // Handle age filters
  if (ageMin !== undefined) {
    conditions.push(`c.age >= $${params.length + 1}`);
    params.push(ageMin);
  }

  if (ageMax !== undefined) {
    conditions.push(`c.age <= $${params.length + 1}`);
    params.push(ageMax);
  }

  // Append conditions to the base query
  if (conditions.length > 0) {
    baseQuery += " AND " + conditions.join(" AND ");
  }

  // Group by category name
  baseQuery += " GROUP BY cat.category_name ORDER BY cat.category_name;";

  try {
    const result = await db.query(baseQuery, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSalesPerCategory;
