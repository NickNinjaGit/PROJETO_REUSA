import express from "express";
import { CourseController } from "../controllers/CourseController.js";
import { ModuleController } from "../controllers/ModuleController.js";
import { LessonController } from "../controllers/LessonController.js";
import { isInstructor } from "../middlewares/isInstructor.js";
import { verifyToken } from "../middlewares/verify-token.js";
import { imageUploader } from "../middlewares/imageUploader.js";
import {videoUploader} from "../middlewares/videoUploader.js";
const router = express.Router();

/* Rotas do instrutor */

// CRUD de cursos
router.get(
  "/dashboard",
  verifyToken,
  isInstructor,
  CourseController.getAllMyCourses
);
router.get(
  "/dashboard/:id",
  verifyToken,
  isInstructor,
  CourseController.getMyCourseById
);
router.post(
  "/dashboard/create",
  verifyToken,
  isInstructor,
  imageUploader.single("thumbnail"),
  CourseController.Create
);
router.patch(
  "/dashboard/edit/:id",
  verifyToken,
  isInstructor,
  imageUploader.single("thumbnail"),
  CourseController.Edit
);
router.delete(
  "/dashboard/delete/:id",
  verifyToken,
  isInstructor,
  CourseController.Delete
);

// CRUD de Módulos
router.get(
  "/dashboard/:courseId/modules",
  verifyToken,
  isInstructor,
  ModuleController.getAllInstructorModules
);
router.post(
  "/dashboard/:courseId/module/create",
  verifyToken,
  isInstructor,
  ModuleController.Create
)
router.get(
  "/dashboard/:courseId/module/:id",
  verifyToken,
  isInstructor,
  ModuleController.getMyModuleById
)
router.patch(
  "/dashboard/:courseId/module/edit/:id",
  verifyToken,
  isInstructor,
  ModuleController.Edit
)
router.delete(
  "/dashboard/:courseId/module/delete/:id",
  verifyToken,
  isInstructor,
  ModuleController.Delete
)

// CRUD de Aulas
router.get(
  "/dashboard/:courseId/:moduleId/lessons",
  verifyToken,
  isInstructor,
  LessonController.getAllInstructorLessons
)
router.post(
  "/dashboard/:courseId/:moduleId/lesson/create",
  verifyToken,
  isInstructor,
  videoUploader.single("video"),
  LessonController.Create
)
router.get(
  "/dashboard/:courseId/:moduleId/lesson/:id",
  verifyToken,
  isInstructor,
  LessonController.getInstructorLessonById
)
router.patch(
  "/dashboard/:courseId/:moduleId/lesson/edit/:id",
  verifyToken,
  isInstructor,
  videoUploader.single("video"),
  LessonController.Edit
)
router.delete(
  "/dashboard/:courseId/:moduleId/lesson/delete/:id",
  verifyToken,
  isInstructor,
  LessonController.Delete
)




/* Rotas do aluno */
router.get("/", verifyToken, CourseController.getAllCourses);
router.get("/:id", verifyToken, CourseController.getCourseById);
// rota para carregar video aula individualmente
//router.get("/:courseId/:moduleId/:id", verifyToken, LessonController.getLessonById);
export { router as CourseRoutes };
