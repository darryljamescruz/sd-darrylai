import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok"});
});

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    res.json({ reply: `Mock Backend Response: Received message: ${message}`});
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});


