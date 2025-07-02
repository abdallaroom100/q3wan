import express from "express"

import connectDb from "./models/config.js"
import cors from "cors"
import path from "path"
import complaintsRouter from "./routers/complaint.router.js"
import userRouter from "./routers/user.router.js"
import adminRouter from "./routers/admin.router.js"
import bodyParser from "body-parser"
import { sendForgetPassowrdMessage } from "./utils/sendForgetrPassowrdMessage.js"
import dotenv from "dotenv"



dotenv.config()
import {dirname} from "path"
import {fileURLToPath} from "url"

// Configure multer storag
// Middlewares
const app = express();
// sendForgetPassowrdMessage()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/user", userRouter);
app.use("/admin",adminRouter)
app.use("/complaint",complaintsRouter)
// Routes

connectDb()
// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));

 