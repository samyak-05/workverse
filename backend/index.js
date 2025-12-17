import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send("Hello Guys!");
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, ()=>{
    connectDB();
    console.log("Hello Guys!" ,port);
})