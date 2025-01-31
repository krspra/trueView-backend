import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ratingRouter from "./routes/rating.route.js";
import checkAuthenticated from "./middleware/authentication.js";

const app = express();

const corsOptions = {
  origin: ["https://true-view-frontend.vercel.app","https://www.secrate.me"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedReferers = ["https://true-view-frontend.vercel.app","https://www.secrate.me"];
  const referer = req.headers.referer;

  if (!referer || !allowedReferers.some((allowed) => referer.startsWith(allowed))) {
    return res.status(403).json({ message: "Forbidden: Invalid Referer" });
  }

  next();
});

// Routes
app.use("/api/user/", checkAuthenticated, userRouter);
app.use("/api/rating/", checkAuthenticated, ratingRouter);

export default app;
