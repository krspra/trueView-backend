import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ratingRouter from "./routes/rating.route.js";
import checkAuthenticated from "./middleware/authentication.js";

const app = express();
const whitelist = ["https://true-view-frontend.vercel.app",];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user/",checkAuthenticated, userRouter);
app.use("/api/rating/",checkAuthenticated,ratingRouter);

export default app;
