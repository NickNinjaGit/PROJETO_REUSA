import { Course } from "../models/Course.js";
import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";

import { trackDurationTime } from "../helpers/track-duration-time.js";

import path from "path";
import fs from "fs";

export class CourseService {
  static async CreateService(req, res, title, description, thumbnail) {
    // criar um novo curso
    const course = await Course.create({
      title,
      description,
      duration: 0,
      thumbnail,
      UserId: req.user.id,
    });
    // retornar o novo curso
    res.status(201).json({ course });
  }
  static async EditService(req, res, id, course, title, description) {
    // verificar se a requisição esta vindo em multipart/form-data
    if (req.file) {
      const imagePath = path.resolve(
        "public",
        "images",
        "courses",
        course.thumbnail
      );
      // se o arquivo antigo existir, delete-o
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    // atualizar o curso
    await Course.update(
      {
        title,
        description,
        thumbnail: req.file.filename,
      },
      { where: { id } }
    );
    // pegando o curso atualizado
    course = await Course.findByPk(id, { include: [Module] });
    // atualizar duração do curso (se houver mudança de módulos)
    await trackDurationTime(course.Modules, course);
    res.status(200).json({ message: "Curso atualizado com sucesso", course });
  }
  static async DeleteService(req, res, course) {
    // deletar imagens do servidor
    const imagePath = path.resolve("public", "images", "courses", course.thumbnail);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Deleta o arquivo de forma síncrona
      console.log("Imagem deletada:", imagePath);
    }

    // deletar o curso
    await course.destroy();
    // retornar mensagem de sucesso
    res.status(200).json({ message: "Curso deletado com sucesso" });
  }
}
