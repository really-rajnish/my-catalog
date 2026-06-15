# Production Product Catalog Application Setup Guide

This project is a full-stack **Spring Boot (Java)** application integrating **PostgreSQL** (relational database managed via pgAdmin), **MongoDB** (NoSQL document store), and a **Vanilla HTML/CSS/JS frontend** served statically on port 8080. It features a custom vector similarity search engine written in pure Java for processing natural language search queries.

---

## Step-by-Step Installation & Setup

### Step 1: Set Up PostgreSQL & pgAdmin
1. Open **pgAdmin** and connect to your local PostgreSQL server.
2. In the Browser tree on the left, right-click **Databases** -> **Create** -> **Database...**
3. Set the database name to: **`product_catalog`** and click **Save**.
4. (Optional) Select the `product_catalog` database, open the **Query Tool** (Tools -> Query Tool), copy the contents of the local file [seed.sql](file:///c:/MOVIE%20TEMP/product_catalog/seed.sql) into it, and click **Execute** to manually seed the tables. 
   > **Note**: If you skip this, the Spring Boot application will automatically create the tables and seed the data for you on its first start!
5. Open your local file [application.properties](file:///c:/MOVIE%20TEMP/product_catalog/src/main/resources/application.properties) and update the credentials (`spring.datasource.username` and `spring.datasource.password`) to match your PostgreSQL account if they are not `postgres`/`postgres`.

### Step 2: Set Up MongoDB
1. Ensure your local **MongoDB Server** (Community Edition) or **MongoDB Atlas** cluster is running.
2. If running locally, MongoDB usually binds to `mongodb://localhost:27017/`.
3. If using MongoDB Atlas or a custom server, open your local file [application.properties](file:///c:/MOVIE%20TEMP/product_catalog/src/main/resources/application.properties) and update the URI:
   ```properties
   spring.data.mongodb.uri=mongodb://username:password@your-atlas-host:27017/product_catalog
   ```
4. The Spring Boot seeder will automatically create the collections (`product_descriptions`, `product_embeddings`, `user_search_logs`) and populate them on launch!

### Step 3: Run the Spring Boot Application
1. Open a command terminal inside the project root directory `c:\MOVIE TEMP\product_catalog`.
2. Clean and package the application using Maven:
   ```bash
   mvn clean package
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. Watch the terminal logs. You will see:
   - Hibernate generating the database tables in PostgreSQL.
   - Spring Boot seeding the categories, products, pricing, and inventories in PostgreSQL.
   - Spring Boot seeding detailed descriptions and key-value specs in MongoDB.
   - The TF-IDF Vector Search Engine indexing the product documents and storing embeddings in MongoDB.
   - The application starting successfully on port `8080`.

### Step 4: Open the Frontend Dashboard
1. Open your web browser and navigate to:
   👉 **[http://localhost:8080](http://localhost:8080)**
2. Browse products by clicking categories in the sidebar.
3. Test faceted filtering by inputting min/max prices and clicking **Apply Filters**.
4. Test the natural language search bar with inputs like:
   - *"Affordable student notebook"*
   - *"Best camera phone for night photography"*
5. Observe the matches updating with cosine similarity match percentages.
6. Scroll to the bottom logs panel to inspect the search audit logs stored dynamically inside the MongoDB log collection.
