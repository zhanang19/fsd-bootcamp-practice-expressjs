const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");

const { cors } = require("./middlewares/app");
const authRouter = require("./routes/auth.router");
const bookRouter = require("./routes/book.router");
const orderRouter = require("./routes/order.router");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors);

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is not provided, fill it with random string or generate it using 'openssl rand -base64 32'"
  );
  process.exit(1);
}

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/orders", orderRouter);

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log("Server Running");
});
