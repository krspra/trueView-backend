import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./utils/db.js";

dotenv.config({});

const server=http.createServer(app);
const PORT=process.env.PORT || 4000;

server.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
    connectDB();
})