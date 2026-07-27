// Extracted verbatim from sql/index.html on 2026-07-27. Do not hand-edit.
// Regenerate: see the sed ranges in proto/README-chicken-hour.md
const SCHEMA = `
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  status TEXT,
  orders INTEGER
);
INSERT INTO customers VALUES
('C001','Alice Chen','alice@example.com','active',7),
('C002','Bob Martinez','bob@example.com','inactive',1),
('C003','Carol White','carol@example.com','active',3),
('C004','David Kim','david@example.com','active',12),
('C005','Eva Ross',NULL,'inactive',0),
('C006','Frank Liu','frank@example.com','active',2),
('C007','Grace Park','grace@example.com','active',5),
('C008','Henry Brown','henry@example.com','inactive',1);

CREATE TABLE orders (
  order_id TEXT PRIMARY KEY,
  customer_id TEXT,
  order_date TEXT,
  amount DECIMAL
);
INSERT INTO orders VALUES
('O001','C001','2024-01-15',120.00),
('O002','C003','2024-01-22',45.00),
('O003','C001','2024-02-03',200.00),
('O004','C004','2024-02-10',89.50),
('O005','C007','2024-02-18',310.00);

CREATE TABLE customers_old (
  id TEXT PRIMARY KEY,
  name TEXT,
  status TEXT
);
INSERT INTO customers_old VALUES
('C001','Alice Chen','active'),
('C002','Bob Martinez','inactive'),
('C003','Carol White','active'),
('C004','David Kim','active'),
('C005','Eva Ross','inactive'),
('C006','Frank Liu','active'),
('C007','Grace Park','active'),
('C008','Henry Brown','inactive'),
('C009','Irene Scott','active'),
('C010','James Lee','inactive');
`;

function seedSalesData(db){
  db.run(`
    CREATE TABLE products (
      product_id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price REAL
    );
    INSERT INTO products VALUES
    ('P01','House Blend Beans','Coffee',14.00),
    ('P02','Single Origin Ethiopia','Coffee',19.50),
    ('P03','Decaf Dark Roast','Coffee',15.00),
    ('P04','Cold Brew Concentrate','Coffee',11.00),
    ('P05','Earl Grey Tin','Tea',9.50),
    ('P06','Jasmine Green Tin','Tea',10.50),
    ('P07','Chai Sampler','Tea',12.00),
    ('P08','Pour-Over Kettle','Equipment',42.00),
    ('P09','Burr Grinder','Equipment',89.00),
    ('P10','French Press','Equipment',28.00),
    ('P11','Logo Mug','Merch',13.00),
    ('P12','Canvas Tote','Merch',18.00);
    CREATE TABLE sales (
      sale_id INTEGER PRIMARY KEY,
      product_id TEXT,
      customer_id TEXT,
      sale_date TEXT,
      qty INTEGER,
      region TEXT,
      amount REAL
    );`);
  const prices={P01:14,P02:19.5,P03:15,P04:11,P05:9.5,P06:10.5,P07:12,P08:42,P09:89,P10:28,P11:13,P12:18};
  const pids=Object.keys(prices);
  const custs=['C001','C002','C003','C004','C005','C006','C007','C008','C009','C010'];
  const regions=['North','South','East','West'];
  let s=42; const rnd=()=>{ s=(s*1103515245+12345)%2147483648; return s/2147483648; };
  const rows=[];
  for(let i=1;i<=180;i++){
    const pid=pids[Math.floor(rnd()*pids.length)];
    const cid=custs[Math.floor(rnd()*custs.length)];
    const month=1+Math.floor(rnd()*6);
    const day=1+Math.floor(rnd()*28);
    const date=`2024-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const qty=1+Math.floor(rnd()*4);
    const region=rnd()<0.08?null:regions[Math.floor(rnd()*4)];
    const amount=Math.round(qty*prices[pid]*100)/100;
    rows.push(`(${i},'${pid}','${cid}','${date}',${qty},${region?`'${region}'`:'NULL'},${amount})`);
  }
  db.run(`INSERT INTO sales VALUES ${rows.join(',')};`);
}

const CARD_DRILLS = {
"SELECT":{tries:[
 {p:"Return just the name column from products.",sql:"SELECT name FROM products;"},
 {p:"Return name AND price from products.",sql:"SELECT name, price FROM products;"},
 {p:"Return every column from sales (peek at the table).",sql:"SELECT * FROM sales LIMIT 10;"}]},
"FROM":{tries:[
 {p:"Count the rows in products.",sql:"SELECT COUNT(*) FROM products;"},
 {p:"Now count the rows in sales — same query, different FROM.",sql:"SELECT COUNT(*) FROM sales;"},
 {p:"And customers_old.",sql:"SELECT COUNT(*) FROM customers_old;"}]},
"WHERE":{tries:[
 {p:"Products in the 'Tea' category.",sql:"SELECT * FROM products WHERE category = 'Tea';"},
 {p:"Products priced over 20.",sql:"SELECT * FROM products WHERE price > 20;"},
 {p:"Sales in the North region with qty of 3 or more.",sql:"SELECT * FROM sales WHERE region = 'North' AND qty >= 3;"}]},
"ORDER BY":{tries:[
 {p:"Products from cheapest to most expensive.",sql:"SELECT name, price FROM products ORDER BY price;"},
 {p:"Most expensive first (DESC).",sql:"SELECT name, price FROM products ORDER BY price DESC;"},
 {p:"Sales sorted by region, then amount high-to-low within each region.",sql:"SELECT region, amount FROM sales ORDER BY region, amount DESC;"}]},
"LIMIT":{tries:[
 {p:"The 5 biggest sales by amount.",sql:"SELECT * FROM sales ORDER BY amount DESC LIMIT 5;"},
 {p:"The 3 cheapest products.",sql:"SELECT name, price FROM products ORDER BY price LIMIT 3;"}]},
"INNER JOIN":{tries:[
 {p:"Each sale's amount with its product name.",sql:"SELECT p.name, s.amount FROM sales s INNER JOIN products p ON s.product_id = p.product_id LIMIT 15;"},
 {p:"Each sale with the customer's name (customers table).",sql:"SELECT c.name, s.amount FROM sales s INNER JOIN customers c ON s.customer_id = c.id LIMIT 15;"}]},
"LEFT JOIN":{tries:[
 {p:"ALL customers_old rows with any sales they made — keep customers with none.",sql:"SELECT co.name, s.sale_id FROM customers_old co LEFT JOIN sales s ON co.id = s.customer_id LIMIT 20;"},
 {p:"All products with their sales; a product with zero sales would still appear.",sql:"SELECT p.name, s.sale_id FROM products p LEFT JOIN sales s ON p.product_id = s.product_id LIMIT 20;"}]},
"ON":{tries:[
 {p:"Join sales to products — the ON clause connects product_id to product_id.",sql:"SELECT p.category, s.amount FROM sales s JOIN products p ON s.product_id = p.product_id LIMIT 10;"},
 {p:"Join sales to customers — this time ON connects customer_id to customers.id (different column names!).",sql:"SELECT c.name, s.sale_date FROM sales s JOIN customers c ON s.customer_id = c.id LIMIT 10;"}]},
"GROUP BY":{tries:[
 {p:"Number of sales per region.",sql:"SELECT region, COUNT(*) AS n FROM sales GROUP BY region;"},
 {p:"Number of products per category.",sql:"SELECT category, COUNT(*) AS n FROM products GROUP BY category;"},
 {p:"Total revenue per product_id.",sql:"SELECT product_id, SUM(amount) AS revenue FROM sales GROUP BY product_id;"}]},
"COUNT(*)":{tries:[
 {p:"How many sales rows are there?",sql:"SELECT COUNT(*) FROM sales;"},
 {p:"How many sales have a NULL region? (COUNT(*) counts them; COUNT(region) would not.)",sql:"SELECT COUNT(*) FROM sales WHERE region IS NULL;"},
 {p:"Compare: COUNT(*) vs COUNT(region) over all sales — spot the NULL gap.",sql:"SELECT COUNT(*) AS all_rows, COUNT(region) AS with_region FROM sales;"}]},
"SUM(col)":{tries:[
 {p:"Total revenue across all sales.",sql:"SELECT SUM(amount) FROM sales;"},
 {p:"Total units (qty) sold.",sql:"SELECT SUM(qty) FROM sales;"},
 {p:"Total revenue for just the East region.",sql:"SELECT SUM(amount) FROM sales WHERE region = 'East';"}]},
"AVG(col)":{tries:[
 {p:"Average sale amount.",sql:"SELECT AVG(amount) FROM sales;"},
 {p:"Average product price.",sql:"SELECT AVG(price) FROM products;"},
 {p:"Average qty per region.",sql:"SELECT region, AVG(qty) FROM sales GROUP BY region;"}]},
"HAVING":{tries:[
 {p:"Regions with more than 40 sales.",sql:"SELECT region, COUNT(*) AS n FROM sales GROUP BY region HAVING COUNT(*) > 40;"},
 {p:"Products (by product_id) whose total revenue exceeds 500.",sql:"SELECT product_id, SUM(amount) AS rev FROM sales GROUP BY product_id HAVING SUM(amount) > 500;"}]},
"DISTINCT":{tries:[
 {p:"The distinct regions in sales (note NULL shows up too).",sql:"SELECT DISTINCT region FROM sales;"},
 {p:"Distinct customer_ids that actually bought something.",sql:"SELECT DISTINCT customer_id FROM sales ORDER BY customer_id;"}]},
"CASE WHEN":{tries:[
 {p:"Label each product 'premium' if price >= 25, else 'standard'.",sql:"SELECT name, price, CASE WHEN price >= 25 THEN 'premium' ELSE 'standard' END AS tier FROM products;"},
 {p:"Bucket sales: 'big' if amount >= 100, 'medium' if >= 40, else 'small'.",sql:"SELECT amount, CASE WHEN amount >= 100 THEN 'big' WHEN amount >= 40 THEN 'medium' ELSE 'small' END AS size FROM sales LIMIT 15;"}]},
"COALESCE":{tries:[
 {p:"Show region, but replace NULL with 'Unassigned'.",sql:"SELECT sale_id, COALESCE(region, 'Unassigned') AS region FROM sales LIMIT 20;"},
 {p:"Customers' email, falling back to '(no email)' — Eva has a NULL.",sql:"SELECT name, COALESCE(email, '(no email)') AS contact FROM customers;"}]},
"NULL":{tries:[
 {p:"Sales where region is missing.",sql:"SELECT * FROM sales WHERE region IS NULL;"},
 {p:"Prove that = NULL finds nothing (0 rows) — then remember to use IS NULL.",sql:"SELECT COUNT(*) FROM sales WHERE region = NULL;"}]},
"IS NULL":{tries:[
 {p:"Customers with no email on file.",sql:"SELECT name FROM customers WHERE email IS NULL;"},
 {p:"Sales that DO have a region (IS NOT NULL).",sql:"SELECT COUNT(*) FROM sales WHERE region IS NOT NULL;"}]},
"Subquery":{tries:[
 {p:"Sales above the average sale amount.",sql:"SELECT * FROM sales WHERE amount > (SELECT AVG(amount) FROM sales) LIMIT 15;"},
 {p:"Products more expensive than the average product.",sql:"SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);"}]},
"IN":{tries:[
 {p:"Products in the Coffee or Tea categories.",sql:"SELECT name, category FROM products WHERE category IN ('Coffee','Tea');"},
 {p:"Customers who appear in the sales table (IN + subquery).",sql:"SELECT name FROM customers WHERE id IN (SELECT DISTINCT customer_id FROM sales);"}]},
"CTE (WITH)":{tries:[
 {p:"CTE of revenue per product, then select the rows over 400 from it.",sql:"WITH product_rev AS (\n  SELECT product_id, SUM(amount) AS rev\n  FROM sales GROUP BY product_id\n)\nSELECT * FROM product_rev WHERE rev > 400;"},
 {p:"CTE of monthly revenue (strftime '%m'), then pick the best month.",sql:"WITH monthly AS (\n  SELECT strftime('%m', sale_date) AS month, SUM(amount) AS rev\n  FROM sales GROUP BY month\n)\nSELECT * FROM monthly ORDER BY rev DESC LIMIT 1;"}]},
"ROW_NUMBER()":{tries:[
 {p:"Number every sale from biggest amount to smallest.",sql:"SELECT sale_id, amount, ROW_NUMBER() OVER (ORDER BY amount DESC) AS rn FROM sales LIMIT 10;"},
 {p:"Rank products by price within the whole table.",sql:"SELECT name, price, ROW_NUMBER() OVER (ORDER BY price DESC) AS price_rank FROM products;"}]},
"OVER (...)":{tries:[
 {p:"Each sale next to the overall average amount (no GROUP BY needed).",sql:"SELECT sale_id, amount, AVG(amount) OVER () AS overall_avg FROM sales LIMIT 10;"},
 {p:"Running total of revenue by date.",sql:"SELECT sale_date, amount, SUM(amount) OVER (ORDER BY sale_date, sale_id) AS running_total FROM sales LIMIT 15;"}]},
"PARTITION BY":{tries:[
 {p:"Number sales 1,2,3… restarting per region.",sql:"SELECT region, amount, ROW_NUMBER() OVER (PARTITION BY region ORDER BY amount DESC) AS rn FROM sales LIMIT 20;"},
 {p:"Each product's price next to its category average.",sql:"SELECT name, category, price, AVG(price) OVER (PARTITION BY category) AS cat_avg FROM products;"}]},
"Alias (AS)":{tries:[
 {p:"Rename SUM(amount) to something readable.",sql:"SELECT SUM(amount) AS total_revenue FROM sales;"},
 {p:"Table aliases: shorten sales to s and products to p in a join.",sql:"SELECT p.name, s.qty FROM sales AS s JOIN products AS p ON s.product_id = p.product_id LIMIT 10;"}]},
"PRIMARY KEY":{tries:[
 {p:"Inspect the products table definition — which column is the PK? (PRAGMA shows pk=1.)",sql:"PRAGMA table_info(products);"},
 {p:"Prove uniqueness: count rows vs distinct product_ids — they match.",sql:"SELECT COUNT(*) AS rows_, COUNT(DISTINCT product_id) AS distinct_ids FROM products;"}]},
"FOREIGN KEY":{tries:[
 {p:"sales.customer_id references customers.id — find 'orphan' sales whose customer is NOT in customers (they're only in customers_old!).",sql:"SELECT DISTINCT s.customer_id FROM sales s LEFT JOIN customers c ON s.customer_id = c.id WHERE c.id IS NULL;"},
 {p:"Follow the FK the happy direction: each sale with its customer's status.",sql:"SELECT s.sale_id, c.name, c.status FROM sales s JOIN customers c ON s.customer_id = c.id LIMIT 10;"}]},
"Reconciliation":{tries:[
 {p:"Do customers and customers_old agree on row counts?",sql:"SELECT (SELECT COUNT(*) FROM customers) AS current_, (SELECT COUNT(*) FROM customers_old) AS old_;"},
 {p:"Who is in customers_old but missing from customers?",sql:"SELECT co.id, co.name FROM customers_old co LEFT JOIN customers c ON co.id = c.id WHERE c.id IS NULL;"},
 {p:"Does SUM(amount) match SUM(qty × price)? A classic totals check.",sql:"SELECT ROUND(SUM(s.amount),2) AS stored, ROUND(SUM(s.qty * p.price),2) AS computed FROM sales s JOIN products p ON s.product_id = p.product_id;"}]},
"RIGHT JOIN":{tries:[
 {p:"RIGHT JOIN keeps every row of the RIGHT table: all customers_old, matched or not.",sql:"SELECT s.sale_id, co.name FROM sales s RIGHT JOIN customers_old co ON s.customer_id = co.id LIMIT 20;"},
 {p:"Same result flipped as a LEFT JOIN — the usual rewrite.",sql:"SELECT s.sale_id, co.name FROM customers_old co LEFT JOIN sales s ON s.customer_id = co.id LIMIT 20;"}]},
"FULL OUTER JOIN":{tries:[
 {p:"All customers AND all customers_old, matched where possible.",sql:"SELECT c.id AS cur_id, co.id AS old_id FROM customers c FULL OUTER JOIN customers_old co ON c.id = co.id;"},
 {p:"Filter that to mismatches only — rows missing on either side.",sql:"SELECT c.id AS cur_id, co.id AS old_id FROM customers c FULL OUTER JOIN customers_old co ON c.id = co.id WHERE c.id IS NULL OR co.id IS NULL;"}]},
"CURDATE()":{note:"CURDATE() is MySQL. This lab runs SQLite, where the equivalent is <code>date('now')</code> — practice the idea with SQLite's spelling.",tries:[
 {p:"Today's date (SQLite spelling).",sql:"SELECT date('now') AS today;"},
 {p:"Sales made before today (all of them — data is from 2024).",sql:"SELECT COUNT(*) FROM sales WHERE sale_date < date('now');"}]},
"DATE_SUB(date, INTERVAL n unit)":{note:"DATE_SUB is MySQL. SQLite uses date modifiers: <code>date('now','-30 day')</code>.",tries:[
 {p:"The date 30 days ago.",sql:"SELECT date('now','-30 day') AS thirty_days_ago;"},
 {p:"Sales in the 90 days after 2024-03-01 (date + modifier on a literal).",sql:"SELECT COUNT(*) FROM sales WHERE sale_date >= '2024-03-01' AND sale_date < date('2024-03-01','+90 day');"}]},
"DATE_FORMAT(date, format)":{note:"DATE_FORMAT is MySQL. SQLite uses <code>strftime(format, date)</code> — %Y-%m gives '2024-03'.",tries:[
 {p:"Each sale's month as '2024-03' style.",sql:"SELECT sale_date, strftime('%Y-%m', sale_date) AS month FROM sales LIMIT 10;"},
 {p:"Revenue per month — the #1 analyst date pattern.",sql:"SELECT strftime('%Y-%m', sale_date) AS month, SUM(amount) AS revenue FROM sales GROUP BY month ORDER BY month;"}]},
"DATEDIFF(date1, date2)":{note:"DATEDIFF is MySQL. SQLite: subtract julianday() values to get days between dates.",tries:[
 {p:"Days between Jan 1 and Jun 30, 2024.",sql:"SELECT julianday('2024-06-30') - julianday('2024-01-01') AS days_between;"},
 {p:"Days since each customer's first purchase, relative to 2024-07-01.",sql:"SELECT customer_id, CAST(julianday('2024-07-01') - julianday(MIN(sale_date)) AS INTEGER) AS days_since_first FROM sales GROUP BY customer_id;"}]},
"Index":{tries:[
 {p:"Check the query plan for a region filter — SCAN means full table scan.",sql:"EXPLAIN QUERY PLAN SELECT * FROM sales WHERE region = 'North';"},
 {p:"Create an index on region, then re-run the plan — it becomes SEARCH … USING INDEX.",sql:"CREATE INDEX IF NOT EXISTS idx_sales_region ON sales(region);\nEXPLAIN QUERY PLAN SELECT * FROM sales WHERE region = 'North';"}]},
"Composite index":{tries:[
 {p:"Create a two-column index on (region, sale_date) and check the plan for a query filtering both.",sql:"CREATE INDEX IF NOT EXISTS idx_sales_region_date ON sales(region, sale_date);\nEXPLAIN QUERY PLAN SELECT * FROM sales WHERE region = 'East' AND sale_date >= '2024-03-01';"},
 {p:"Column order matters: filtering ONLY sale_date can't use that index's front column.",sql:"EXPLAIN QUERY PLAN SELECT * FROM sales WHERE sale_date >= '2024-03-01';"}]},
"Temporary Table":{tries:[
 {p:"Create a temp table of big sales, then query it.",sql:"CREATE TEMP TABLE IF NOT EXISTS big_sales AS SELECT * FROM sales WHERE amount >= 100;\nSELECT COUNT(*) FROM big_sales;"},
 {p:"Use the temp table in a join like any other table.",sql:"SELECT p.name, COUNT(*) AS big_sale_count FROM big_sales b JOIN products p ON b.product_id = p.product_id GROUP BY p.name ORDER BY big_sale_count DESC;"}]},
"View":{tries:[
 {p:"Create a view of revenue per category, then SELECT from it.",sql:"CREATE VIEW IF NOT EXISTS category_revenue AS\nSELECT p.category, SUM(s.amount) AS revenue\nFROM sales s JOIN products p ON s.product_id = p.product_id\nGROUP BY p.category;\nSELECT * FROM category_revenue ORDER BY revenue DESC;"},
 {p:"Views re-run live: filter the view like a table.",sql:"SELECT * FROM category_revenue WHERE revenue > 900;"}]}
};
