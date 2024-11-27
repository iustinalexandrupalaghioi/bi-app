-- Categories Table
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Books Table
CREATE TABLE Books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT REFERENCES Categories(category_id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    published_date DATE
);

-- Clients Table
CREATE TABLE Clients (
    client_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
    age INT CHECK (age >= 0 AND age <= 120)
);

-- Sales Table
CREATE TABLE Sales (
    sale_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES Books(book_id) ON DELETE CASCADE,
    client_id INT REFERENCES Clients(client_id) ON DELETE SET NULL,
    sale_date DATE NOT NULL,
    quantity INT CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL
);

-- Optional: Indexes for faster querying
CREATE INDEX idx_books_category_id ON Books(category_id);
CREATE INDEX idx_sales_book_id ON Sales(book_id);
CREATE INDEX idx_sales_client_id ON Sales(client_id);


