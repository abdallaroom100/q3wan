
import express from "express";
import worker from "worker_threads";
import 'dotenv/config';
import connectDb from "./models/config.js";
import cors from "cors";
import path from "path";
import complaintsRouter from "./routers/complaint.router.js";
import userRouter from "./routers/user.router.js";
import adminRouter from "./routers/admin.router.js";



import { dirname } from "path";
import { fileURLToPath } from "url";

// Configure multer storag
// Middlewares
const app = express();

// sendForgetPassowrdMessage()
app.use(
  express.json({ limit: "200mb", extended: true, parameterLimit: 200000 }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "200mb",
    parameterLimit: 200000,
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
 export const devMode = process.env.DEV_MODE == "true"?true:false
app.set("trust proxy", true);
if (process.env.DEV_MODE == "true") {
    
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
} else {
  app.use("/uploads", express.static("/home/ec2-user/gdrive/uploads"));
}
console.log(process.env.DEV_MODE);
app.use("/uploads", express.static("X:\\uploads"));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/complaint", complaintsRouter);
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

connectDb();
// connection
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
