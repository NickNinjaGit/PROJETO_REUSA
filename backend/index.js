import express from "express";
import conn from "./db/conn.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// models
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";
import { Course } from "./models/Course.js";
import { Module } from "./models/Module.js";
import { Lesson } from "./models/Lesson.js";

// Routes
import { UserRoutes } from "./routes/UserRoutes.js";
import { AdminRoutes } from "./routes/AdminRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
import { CourseRoutes } from "./routes/CourseRoutes.js";
// import PrizesRoutes from "./routes/PrizesRoutes.js";

import { UserController } from './controllers/UserController.js';
import { imageUploader } from './middlewares/imageUploader.js';


// helper
import { createFirstAdmin } from "./helpers/create-first-admin.js";
import { verifyToken } from "./middlewares/verify-token.js";
import helmet from "helmet";

const app = express();
// Config JSON response
app.use(express.json());
// Config cookies
app.use(cookieParser());
// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configuring helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      mediaSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // se precisar para scripts inline
      styleSrc: ["'self'", "'unsafe-inline'"],  // se tiver CSS inline
      connectSrc: ["'self'", "http://localhost:5173"], // para API
    }
  },
  AccessControlAllowOrigin: "http://localhost:5173",
  crossOriginResourcePolicy: { policy: "same-site" }
}));
// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

try {
  await conn.authenticate();
  await conn.sync({ force: false });
  await createFirstAdmin();
  console.log("Database connected");
} catch (error) {
  console.log(error);
}



// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use("/users", UserRoutes);
app.use("/admin", AdminRoutes);
app.use("/courses", CourseRoutes);
// app.use("/post", postRoutes);
// app.use("/prizes", PrizesRoutes);



app.listen(5000, () => {
  console.log("Server started on port 5000");
});
