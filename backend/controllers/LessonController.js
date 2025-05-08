import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";
import path from "path";
import fs from "fs";

import { trackDurationTime } from "../helpers/track-duration-time.js";

// Services
import { LessonService } from "../services/LessonService.js";
export class LessonController {
  static async getAllLessons(req, res) {
    // pegar todas as aulas pertencentes aquele módulo daquele curso
    const { courseId, moduleId } = req.params;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const lessons = await Lesson.findAll({ where: { ModuleId: moduleId }, order: [["order", "ASC"]] });
    res.status(200).json({ lessons });
  }

  static async getLessonById(req, res)
  {
    const { courseId, moduleId, id } = req.params;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Aula nao encontrada", field: "id" });
    }
    res.status(200).json({ lesson });
  }
  /* Metodos do instrutor */
  static async getAllInstructorLessons(req, res) {
    const { courseId, moduleId } = req.params;
    // verifica se o módulo pertence aquele curso
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    // verifica se o instrutor logado é o mesmo que criou aquele curso
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // pegar todas as aulas do módulo do instrutor logado
    const lessons = await Lesson.findAll({ where: { ModuleId: moduleId }, order: [["order", "ASC"]] });
    console.log(lessons);
    if (lessons.length === 0) {
      return res.status(200).json({
        message: "Parece que você não tem nenhuma aula cadastrada ainda...",
      });
    }
    res.status(200).json({ lessons });
  }
  static async getInstructorLessonById(req, res) {
    const { courseId, moduleId, id } = req.params;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Aula nao encontrada", field: "id" });
    }
    res.status(200).json({ lesson });
  }
  static async Create(req, res) {
    const { courseId, moduleId } = req.params;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    let { title, description, order } = req.body;
    // pegar o campo de vídeo do multipart/form-data
    if(!req.file)
    {
      return res.status(422).json({ message: "O video é obrigatório", field: "video" });
    }
    const video = req.file.filename;

    // verificar se os campos obrigatórios foram preenchidos
    if (!title) {
      return res
        .status(422)
        .json({ message: "O titulo é obrigatório", field: "title" });
    }
    if (!description) {
      return res
        .status(422)
        .json({ message: "A descricao é obrigatória", field: "description" });
    }
    if (!video) {
      return res
        .status(422)
        .json({ message: "O video é obrigatório", field: "video" });
    }
    const lessons = await Lesson.findAll({ where: { ModuleId: moduleId } });
    if (lessons.length === 0) {
      order = 1;
    }
    else if (!order) {
      return res
        .status(422)
        .json({ message: "A ordem é obrigatória", field: "order" });
    }

    const orderExist = await Lesson.findOne({ where: { order } });
    if (orderExist) {
      return res.status(409).json({ message: "Ordem já existente" });
    }
    await LessonService.CreateService(req, res, moduleId, module, title, description, order, video);
  }
  static async Edit(req, res) {
    const { courseId, moduleId, id } = req.params;
    const module = await Module.findByPk(moduleId, { include: [Lesson] });
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // encontrar lição pelo ID
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Lição não encontrada", field: "id" });
    }

    // pegar os dados do body
    const { title, description } = req.body;
    let { order } = req.body;
    // verificar campos vazios
    if (!title) {
      return res
        .status(422)
        .json({ message: "O titulo é obrigatório", field: "title" });
    }
    if (!description) {
      return res
        .status(422)
        .json({ message: "A descricao é obrigatória", field: "description" });
    }
    // se já for a primeira ordem, não necessita de campo de ordem no body
    if (lesson.order === 1) {
      order = 1;
    }
    if (!order) {
      return res
        .status(422)
        .json({ message: "A ordem é obrigatória", field: "order" });
    }
    const orderExist = await Lesson.findOne({ where: { order } });
    if (orderExist && orderExist.id !== lesson.id) {
      return res.status(409).json({ message: "Ordem ja existente" });
    }
    if (module.Lessons.length === 1 && order !== 1) {
      return res.status(409).json({
        message:
          "A ordem da primeira lição deve ser inicialmente 1, pois o módule possui apenas uma lição",
      });
    }
    await LessonService.EditService(req, res, id, moduleId, module, title, description, order, lesson);
    
  }
  static async Delete(req, res) {
    const { courseId, moduleId, id } = req.params;
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    if (module.CourseId !== Number(courseId)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    // encontrar video pela lição
    const lesson = await Lesson.findByPk(id);
    console.log("Vindo de LessonController", lesson);
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Aula nao encontrada", field: "id" });
    }
    await LessonService.DeleteService(req, res, id, module, lesson);
  }
}
