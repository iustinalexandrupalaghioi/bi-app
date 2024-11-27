import { createObjectCsvWriter } from "csv-writer";
import faker from "faker";

// Create CSV Writers for Categories, Books, Clients, and Sales
const categoryCsvWriter = createObjectCsvWriter({
  path: "categories.csv",
  header: [
    { id: "category_id", title: "CATEGORY_ID" },
    { id: "category_name", title: "CATEGORY_NAME" },
  ],
});

const bookCsvWriter = createObjectCsvWriter({
  path: "books.csv",
  header: [
    { id: "book_id", title: "BOOK_ID" },
    { id: "title", title: "TITLE" },
    { id: "category_id", title: "CATEGORY_ID" },
    { id: "price", title: "PRICE" },
    { id: "stock", title: "STOCK" },
    { id: "published_date", title: "PUBLISHED_DATE" },
  ],
});

const clientCsvWriter = createObjectCsvWriter({
  path: "clients.csv",
  header: [
    { id: "client_id", title: "CLIENT_ID" },
    { id: "name", title: "NAME" },
    { id: "gender", title: "GENDER" },
    { id: "age", title: "AGE" },
  ],
});

const salesCsvWriter = createObjectCsvWriter({
  path: "sales.csv",
  header: [
    { id: "sale_id", title: "SALE_ID" },
    { id: "book_id", title: "BOOK_ID" },
    { id: "client_id", title: "CLIENT_ID" },
    { id: "sale_date", title: "SALE_DATE" },
    { id: "quantity", title: "QUANTITY" },
    { id: "total_price", title: "TOTAL_PRICE" },
  ],
});

// Specific Book Categories
const bookCategories = [
  { category_id: 1, category_name: "Romance" },
  { category_id: 2, category_name: "Science Fiction" },
  { category_id: 3, category_name: "Mystery" },
  { category_id: 4, category_name: "Biography" },
  { category_id: 5, category_name: "History" },
  { category_id: 6, category_name: "Fantasy" },
  { category_id: 7, category_name: "Thriller" },
  { category_id: 8, category_name: "Non-Fiction" },
];

// Random Data Generation
const generateRandomData = async () => {
  const books = [];
  const clients = [];
  const sales = [];

  const numBooks = 200;
  const numClients = 1000;
  const numSales = 5000;

  let bookIdCounter = 1;

  // Generate Books (Using Specific Categories)
  for (let i = 1; i <= numBooks; i++) {
    const book = {
      book_id: bookIdCounter++,
      title: faker.commerce.productName(),
      category_id: faker.random.number({ min: 1, max: bookCategories.length }),
      price: faker.commerce.price(10, 100, 2),
      stock: faker.random.number({ min: 0, max: 100 }),
      published_date: faker.date.past(10).toISOString().split("T")[0],
    };
    books.push(book);
  }

  // Generate Clients
  for (let i = 1; i <= numClients; i++) {
    const client = {
      client_id: i,
      name: faker.name.findName(),
      gender: faker.random.arrayElement(["Male", "Female"]),
      age: faker.random.number({ min: 18, max: 80 }),
    };
    clients.push(client);
  }

  // Generate Sales
  for (let i = 1; i <= numSales; i++) {
    const sale = {
      sale_id: i,
      book_id: faker.random.number({ min: 1, max: numBooks }),
      client_id: faker.random.number({ min: 1, max: numClients }),
      sale_date: faker.date.past(2).toISOString().split("T")[0],
      quantity: faker.random.number({ min: 1, max: 5 }),
      total_price: faker.commerce.price(15, 500, 2),
    };
    sales.push(sale);
  }

  // Write Data to CSV Files
  await categoryCsvWriter.writeRecords(bookCategories);
  await bookCsvWriter.writeRecords(books);
  await clientCsvWriter.writeRecords(clients);
  await salesCsvWriter.writeRecords(sales);

  console.log("Data generation complete.");
};

// Run the script
generateRandomData().catch((err) => console.error(err));
