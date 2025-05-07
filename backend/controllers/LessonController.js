import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";
import path from "path";
import fs from "fs";

import { getVideoDurationInSeconds } from "get-video-duration";
import { trackDurationTime } from "../helpers/track-duration-time.js";

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

    // pegar o tempo do arquivo de vídeo
    const videoDuration = await getVideoDurationInSeconds(req.file.path);
    console.log("Duração:", videoDuration);

    const lesson = await Lesson.create({
      title,
      description,
      order,
      video,
      duration: Number(videoDuration),
      ModuleId: moduleId,
    });
    // recalcular o tempo total do módulo
    await trackDurationTime([lesson], module);
    res.status(201).json({ lesson });
    
    
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
  static async Edit(req, res) {
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

    // encontrar lição pelo ID
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Lição não encontrada", field: "id" });
    }

    // pegar os dados do body
    const { title, description, order } = req.body;

    if (req.file) {
      const videoPath = path.resolve(
        "public",
        "videos",
        "lessons",
        lesson.video
      );
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      const videoDuration = await getVideoDurationInSeconds(req.file.path);
      lesson.video = req.file.filename;
      lesson.duration = videoDuration;

      // encontrar o video antigo e deletar do servidor
      await lesson.save();
    }

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
    if (!order) {
      return res
        .status(422)
        .json({ message: "A ordem é obrigatória", field: "order" });
    }
    const orderExist = await Lesson.findOne({ where: { order } });
    if (orderExist && orderExist.id !== lesson.id) {
      return res.status(409).json({ message: "Ordem ja existente" });
    }

    // atualizar a lição
    await Lesson.update(
      {
        title,
        description,
        order,
        video: lesson.video,
        ModuleId: moduleId,
      },
      { where: { id } }
    );
    // recalcular tempo de duração do módulo
    await trackDurationTime([lesson], module);
    const editedLesson = await Lesson.findByPk(id);
    res.status(200).json({ editedLesson });
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
    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Aula nao encontrada", field: "id" });
    }
    // deletar video do servidor
    console.log("Vídeo:", lesson.video);
    try {
      const videoPath = path.resolve(
        "public",
        "videos",
        "lessons",
        lesson.video
      );
      console.log("Vídeo:", videoPath);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath); // Deleta o arquivo de forma síncrona
        console.log("Vídeo deletado:", videoPath);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao deletar video do servidor" });
    }
    await Lesson.destroy({ where: { id } });
    // recalcular tempo de duração do módulo
    await trackDurationTime([lesson], module);
    res.status(200).json({ message: "Aula deletada com sucesso" });

    
  }
}
