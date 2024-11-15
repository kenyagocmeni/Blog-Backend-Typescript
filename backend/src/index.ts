import express, {Request, Response} from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/posts", commentRoutes);

app.get("/", (req:Request, res:Response)=>{
    res.send("Blog Platform");
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});