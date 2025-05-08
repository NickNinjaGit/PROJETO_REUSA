import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";
import path from "path";
import fs from "fs";

import { getVideoDurationInSeconds } from "get-video-duration";
import { trackDurationTime } from "../helpers/track-duration-time.js";

export class LessonService {
  static async CreateService(
    req,
    res,
    moduleId,
    module,
    title,
    description,
    order,
    video
  ) {
    // pegar o tempo do arquivo de vídeo
    const videoDuration = await getVideoDurationInSeconds(req.file.path);

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
  static async EditService(
    req,
    res,
    id,
    moduleId,
    module,
    title,
    description,
    order,
    lesson
  ) {
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
      lesson.video = req.file.filename;
    }
    const videoDuration = await getVideoDurationInSeconds(req.file.path);
    // atualizar a lição
    await Lesson.update(
      {
        title,
        description,
        order,
        video: lesson.video,
        duration: Number(videoDuration),
        ModuleId: moduleId,
      },
      { where: { id } }
    );
    // recalcular tempo de duração do módulo
    await trackDurationTime([lesson], module);
    const editedLesson = await Lesson.findByPk(id);
    res.status(200).json({ editedLesson });
  }
  static async DeleteService(req, res, id, module, lesson) {
    // deletar video do servidor
    console.log(lesson);
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
