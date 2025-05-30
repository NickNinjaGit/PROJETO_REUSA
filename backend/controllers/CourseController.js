import { Course } from "../models/Course.js";
import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";

import { trackDurationTime } from "../helpers/track-duration-time.js";

import path from "path";
import fs from "fs";

// Service
import { CourseService } from "../services/CourseService.js";

export class CourseController {
  static async getAllCourses(req, res) {
    // pegas lista de cursos do banco
    const courses = await Course.findAll();
    // se não tiver cursos, mandar mensagem de placeholder
    if (!courses) {
      res.status(200).json({
        message:
          "Nenhum curso encontrado, por favor, aguarde um instrutor cadastrar algum curso",
      });
    }
    // caso contrário, mandar a lista
    res.status(200).json({ courses });
  }
  static async getCourseById(req, res) {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [{ model: Module, include: [Lesson] }],
    });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    await trackDurationTime(course.Modules, course);
    res.status(200).json({ course });
  }
  /* Métodos do Instrutor */
  static async getAllMyCourses(req, res) {
    // pegar o usuário logado
    const user = req.user;

    // encontrar usuário pelo id do token do instrutor logado
    const userCourses = await User.findByPk(user.id, {
      include: [Course],
    });
    // se não tiver cursos, mandar mensagem de placeholder
    if (userCourses.Courses.length === 0) {
      return res.status(200).json({
        message: "Parece que você não tem nenhum curso cadastrado ainda...",
      });
    }
    // encontrar os cursos do instrutor logado
    res.status(200).json({ userCourses });
  }
  static async getMyCourseById(req, res) {
    const { id } = req.params;
    try {
      const course = await Course.findByPk(id, {
        include: [Module],
      });
      if (!course) {
        return res
          .status(404)
          .json({ message: "Curso nao encontrado", field: "id" });
      }
      // determinar duração do curso baseado nos módulos dele
      await trackDurationTime(course.Modules, course);
      res.status(200).json({ course });
    } catch (error) {
      console.error(error);
    }
    
  }
  static async Create(req, res) {
    // pegar dados de um body
    if (!req.body) {
      return res.status(500).json({ message: "Corpo de requisição inválido!" });
    }
    const { title, description } = req.body;
    // pegar campo de imagem do multipart/form-data
    const thumbnail = req.file.filename;
    // campos vazios
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
    if (!thumbnail) {
      return res
        .status(422)
        .json({ message: "A imagem é obrigatória", field: "thumbnail" });
    }
    await CourseService.CreateService(req, res, title, description, thumbnail);
  }
  static async Edit(req, res) {
    // pegar o id do curso pelo parametro de URL
    const { id } = req.params;
    // pegar dados do body
    const { title, description } = req.body;
    // procurar o curso pelo id
    let course = await Course.findByPk(id);

    // campos vazios
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
    // verificar se o curso pertence aquele instrutor logado
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    await CourseService.EditService(
      req,
      res,
      id,
      course,
      title,
      description
    );
  }
  static async Delete(req, res) {
    // pegar id do parametro de URL
    const { id } = req.params;
    // procurar o curso pelo id
    const course = await Course.findByPk(id);
    if(!course) {
      return res.status(404).json({ message: "Curso nao encontrado", field: "id" });
    }
    // verificar se o curso pertence aquele instrutor logado
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    await CourseService.DeleteService(req, res, course);
  }
}
