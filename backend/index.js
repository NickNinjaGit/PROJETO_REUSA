import express from "express";
import conn from "./db/conn.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// models
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";
import { Course } from "./models/Course.js";
import { Module } from "./models/Module.js";
import { Lesson } from "./models/Lesson.js";

// Routes
import { UserRoutes } from "./routes/UserRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import courseRoutes from "./routes/courseRoutes.js";

const app = express();
// Config JSON response
app.use(express.json());
// Config cookies
app.use(cookieParser());
// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

try {
  await conn.authenticate();
  await conn.sync({ force: false });
  console.log("Database connected");
} catch (error) {
  console.log(error);
}

// Routes
app.use("/users", UserRoutes);
// app.use("/post", postRoutes);
// app.use("/course", courseRoutes);

// Public folder for images
app.use(express.static("public"));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
