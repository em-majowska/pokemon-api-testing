import connectDB from "./config/db";
import app from "./server";
import dotenv from "dotenv";
dotenv.config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server has started on PORT: ", PORT);
});
