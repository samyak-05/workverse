import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"
import postRouter from "./routes/postRouter.js"
import connectionRouter from "./routes/connectionRouter.js"
import notificationRouter from "./routes/notificationRouter.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

dotenv.config();
const app = express();
let server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})
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
app.use("/api/post", postRouter);
app.use("/api/connections", connectionRouter);
app.use("/api/notification", notificationRouter)

export const userSocketMap = new Map();

io.on("connection", (socket)=>{
    console.log("User Data Connected", socket.id);

    socket.on("register", (userId)=>{
        userSocketMap.set(userId, socket.id);
    })

    socket.on("disconnect", (socket)=>{
        console.log("User Disconnected", socket.id);
    })
})

server.listen(port, ()=>{
    connectDB();
    console.log("Hello Guys!" ,port);
})