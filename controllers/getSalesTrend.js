import db from "../db.js";

const getSalesTrend = async (req, res) => {
  const { startDate, endDate, frequency } = req.query;
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "startDate and endDate are required." });
  }

  let baseQuery;
  const params = [startDate, endDate];

  // Determine the query structure based on frequency
  if (frequency === "Daily") {
    baseQuery = `
      SELECT s.sale_date AS "saleDate", 
             SUM(s.total_price) AS "totalSales"
      FROM Sales s
      WHERE s.sale_date BETWEEN $1 AND $2
      GROUP BY s.sale_date
      ORDER BY s.sale_date;
    `;
  } else if (frequency === "Monthly") {
    baseQuery = `
      SELECT EXTRACT(YEAR FROM s.sale_date) AS "saleYear", 
             EXTRACT(MONTH FROM s.sale_date) AS "saleMonth",
             SUM(s.total_price) AS "totalSales"
      FROM Sales s
      WHERE s.sale_date BETWEEN $1 AND $2
      GROUP BY "saleYear", "saleMonth"
      ORDER BY "saleYear", "saleMonth";
    `;
  } else if (frequency === "Yearly") {
    baseQuery = `
      SELECT EXTRACT(YEAR FROM s.sale_date) AS "saleYear", 
             SUM(s.total_price) AS "totalSales"
      FROM Sales s
      WHERE s.sale_date BETWEEN $1 AND $2
      GROUP BY "saleYear"
      ORDER BY "saleYear";
    `;
  } else {
    return res.status(400).json({ error: "Invalid frequency" });
  }

  try {
    const result = await db.query(baseQuery, params);

    // Format the result based on frequency
    const formattedData = result.rows.map((record) => {
      if (frequency === "Daily") {
        return { date: record.saleDate, totalSales: record.totalSales };
      } else if (frequency === "Monthly") {
        const monthLabel = `${record.saleYear}-${String(
          record.saleMonth
        ).padStart(2, "0")}`;
        return { month: monthLabel, totalSales: record.totalSales };
      } else {
        // Yearly
        return { year: record.saleYear, totalSales: record.totalSales };
      }
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getSalesTrend;
