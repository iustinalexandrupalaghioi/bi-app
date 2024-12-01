import db from "../db.js";

const getSalesTrend = async (req, res) => {
  const { startDate, endDate, ageMin, ageMax, gender, frequency } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required." });
  }

  if (!frequency || !["Daily", "Monthly", "Yearly"].includes(frequency)) {
    return res.status(400).json({ error: "Invalid or missing frequency." });
  }

  const params = [startDate, endDate];
  let conditions = [];

  // Add age range filters if provided
  if (ageMin) {
    conditions.push(`c.age >= $${params.length + 1}`);
    params.push(Number(ageMin));
  }

  if (ageMax) {
    conditions.push(`c.age <= $${params.length + 1}`);
    params.push(Number(ageMax));
  }

  // Add gender filter if provided
  if (gender && gender !== "All") {
    conditions.push(`c.gender = $${params.length + 1}`);
    params.push(gender);
  }

  // Base query with filtering conditions
  let baseQuery = `
    SELECT
  `;
  if (frequency === "Daily") {
    baseQuery += `
      s.sale_date AS "saleDate", 
      COALESCE(SUM(s.total_price), 0) AS "totalSales"
    `;
  } else if (frequency === "Monthly") {
    baseQuery += `
      EXTRACT(YEAR FROM s.sale_date) AS "saleYear", 
      EXTRACT(MONTH FROM s.sale_date) AS "saleMonth",
      COALESCE(SUM(s.total_price), 0) AS "totalSales"
    `;
  } else if (frequency === "Yearly") {
    baseQuery += `
      EXTRACT(YEAR FROM s.sale_date) AS "saleYear", 
      COALESCE(SUM(s.total_price), 0) AS "totalSales"
    `;
  }

  baseQuery += `
    FROM Sales s
    INNER JOIN Clients c ON s.client_id = c.client_id
    WHERE s.sale_date BETWEEN $1 AND $2
  `;

  // Append additional filters
  if (conditions.length > 0) {
    baseQuery += ` AND ${conditions.join(" AND ")}`;
  }

  // Add grouping and ordering based on frequency
  if (frequency === "Daily") {
    baseQuery += `
      GROUP BY s.sale_date
      ORDER BY s.sale_date;
    `;
  } else if (frequency === "Monthly") {
    baseQuery += `
      GROUP BY "saleYear", "saleMonth"
      ORDER BY "saleYear", "saleMonth";
    `;
  } else if (frequency === "Yearly") {
    baseQuery += `
      GROUP BY "saleYear"
      ORDER BY "saleYear";
    `;
  }

  try {
    const result = await db.query(baseQuery, params);

    // Format the result based on frequency
    const formattedData = result.rows.map((record) => {
      if (frequency === "Daily") {
        return {
          sale_date: record.saleDate, // Already in YYYY-MM-DD format
          totalSales: Number(record.totalSales) || 0, // Ensure valid number
        };
      } else if (frequency === "Monthly") {
        const monthLabel = `${record.saleYear}-${String(
          record.saleMonth
        ).padStart(2, "0")}`;
        return {
          sale_date: monthLabel,
          totalSales: Number(record.totalSales) || 0, // Ensure valid number
        };
      } else {
        // Yearly
        return {
          sale_date: record.saleYear,
          totalSales: Number(record.totalSales) || 0, // Ensure valid number
        };
      }
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSalesTrend;
