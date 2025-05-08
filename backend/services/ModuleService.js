import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";

// helper
import { trackDurationTime } from "../helpers/track-duration-time.js";

export class ModuleService {
  static async CreateService(req, res, course, title, description, order) {
    const duration = 0;
    const module = await Module.create({
      title,
      description,
      order,
      duration,
      CourseId: course.id,
    });
    res.status(200).json({ module });
  }
  static async EditService(req, res, id, course, title, description, order) {
    const module = await Module.findByPk(id, { include: [Lesson] });
    // editar informações do módulo
    await Module.update(
      {
        title,
        description,
        duration: await trackDurationTime(module.Lessons, module),
        order,
      },
      { where: { id } }
    );
    const EditedModule = await Module.findByPk(id);
    res
      .status(200)
      .json({ message: "Módulo editado com sucesso", EditedModule });
  }
  static async DeleteService(req, res, id, course)
  {
    
    // deletar o módulo
    await Module.destroy({ where: { id } });
    // alterar duração do curso
    await trackDurationTime(course.Modules, course);
    res.status(200).json({ message: "Módulo deletado com sucesso" });
  }
}
