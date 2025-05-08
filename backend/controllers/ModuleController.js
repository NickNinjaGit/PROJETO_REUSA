import { Module } from "../models/Module.js";
import { Lesson } from "../models/Lesson.js";
import { Course } from "../models/Course.js";

// helper
import { trackDurationTime } from "../helpers/track-duration-time.js";

// Service
import { ModuleService } from "../services/ModuleService.js";
export class ModuleController {
  /* Métodos do Instrutor */

  static async getAllInstructorModules(req, res) {
    // pegar o usuário logado
    const user = req.user;

    // pegar curso no parametro de URL
    const { courseId: id } = req.params;
    const courseModules = await Course.findByPk(id, {
      include: [Module],
      order: [[Module, "order", "ASC"]],
    });
    // contabilizar tempo do módulo baseado nas lições existentes nele
    if (!courseModules) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    // verificar se o curso não tem módulos ainda
    if (courseModules.Modules.length === 0) {
      return res.status(200).json({
        message:
          "Parece que seu curso ainda não tem nenhum módulo cadastrado...",
      });
    }
    // devolver todos os módulos relacionados ao curso
    res.status(200).json({ courseModules });
  }
  static async getMyModuleById(req, res) {
    const { courseId, id } = req.params;
    const course = await Course.findByPk(courseId);
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    const module = await Module.findByPk(id, {
      include: [Lesson],
    });
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    //calcular duração dos módulos baseado no tempo das lições
    await trackDurationTime(module.Lessons, module);
    res.status(200).json({ module });
  }
  static async Create(req, res) {
    let { title, description, order } = req.body;
    const { courseId: id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    // verificar se aquele curso pertence ao instrutor logado
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
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
    // verificar se o módulo é o primeiro criado
    const modules = await Module.findAll({ where: { CourseId: course.id } });
    if (modules.length === 0) {
      order = 1;
    } else if (!order) {
      return res
        .status(422)
        .json({ message: "A ordem é obrigatória", field: "order" });
    }
    // verificar se há algum módulo com a mesma ordem
    const moduleOrderExists = await Module.findOne({ where: { order } });
    if (moduleOrderExists) {
      return res.status(409).json({
        message:
          "Módulo com mesma ordem já foi registrado. Escolha uma ordem diferente",
        field: "order",
      });
    }
    await ModuleService.CreateService(
      req,
      res,
      course,
      title,
      description,
      order
    );
  }

  static async Edit(req, res) {
    // pegar id do curso e do módulo pelos parametros de URL
    const { courseId, id } = req.params;
    const course = await Course.findByPk(courseId, { include: [Module] });
    // verifica se o curso existe
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    // verificar se aquele curso pertence ao instrutor logado
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    // pegar dados do body
    const { title, description } = req.body;
    let { order } = req.body;
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
    const module = await Module.findByPk(id);
    if (!module) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    // se já for a primeira ordem, não necessita de campo de ordem no body
    if (module.order === 1) {
      order = 1;
    }
    if (!order) {
      return res
        .status(422)
        .json({ message: "A ordem é obrigatória", field: "order" });
    }
    // verificar se houver um módulo com a mesma ordem
    const moduleOrderExists = await Module.findOne({ where: { order } });
    if (moduleOrderExists && moduleOrderExists.id !== Number(id)) {
      return res.status(409).json({
        message:
          "Módulo com mesma ordem já foi registrado. Escolha uma ordem diferente",
        field: "order",
      });
    }
    // verificar se o módulo de id 1 é o único no curso
    if (course.Modules.length === 1 && order !== 1) {
      return res.status(409).json({
        message:
          "A ordem do primeiro módulo deve ser inicialmente 1, pois o curso possui apenas um módulo",
      });
    }
    await ModuleService.EditService(
      req,
      res,
      id,
      course,
      title,
      description,
      order
    );
  }
  static async Delete(req, res) {
    // pega o id do módulo e do curso pelos parametros de URL
    const { courseId, id } = req.params;
    const course = await Course.findByPk(courseId, { include: [Module] });
    // verifica se o curso existe
    if (!course) {
      return res
        .status(404)
        .json({ message: "Curso nao encontrado", field: "id" });
    }
    // verificar se aquele curso pertence ao instrutor logado
    if (course.UserId !== req.user.id) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    // verificar se o módulo existe
    const moduleExist = await Module.findByPk(id);
    if (!moduleExist) {
      return res
        .status(404)
        .json({ message: "Módulo nao encontrado", field: "id" });
    }
    await ModuleService.DeleteService(req, res, id, course);
  }
}
