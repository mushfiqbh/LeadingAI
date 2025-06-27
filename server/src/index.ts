import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRouter from "./routes/chatRouter";
import mcpRouter from "./routes/mcpRouter";

// app config
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.status(200).json({
    live: true,
    message: "Server is running",
  });
});

app.use("/mcp", mcpRouter);
app.use("/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
