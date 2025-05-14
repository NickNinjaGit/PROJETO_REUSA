import joi from "joi";
import { User } from "../models/User.js";
export class userValidation {
  constructor(name, email, password, confirmpassword) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.confirmpassword = confirmpassword;
  }

  async registerValidation() {
    const schema = joi
      .object({
        name: joi.string().min(3).max(30).required().messages({
          "string.min": "O nome deve ter pelo menos 3 caracteres",
          "string.max": "O nome deve ter menos de 30 caracteres",
          "string.empty": "O nome é obrigatório",
        }),
        email: joi
          .string()
          .required()
          .messages({
            "string.empty": "O e-mail é obrigatório",
            "string.email": "Formato de e-mail inválido",
            
          }),
        password: joi.string().min(6).required().messages({
          "string.min": "A senha deve ter pelo menos 6 caracteres",
          "string.empty": "A senha é obrigatória",
        }),
        confirmpassword: joi
          .string()
          .valid(joi.ref("password"))
          .label("confirmpassword")
          .messages({
            "any.only": "As senhas não coincidem",
          }),
      })
      .with("password", "confirmpassword")
      .external(async (value) => {
        // check if user exists
        const userExists = await User.findOne({ where: { email: this.email } });
        if (userExists) {
            throw new joi.ValidationError("Validation error", [
                {
                  message: "Email já está em uso",
                  path: ["email"],
                  type: "any.custom", //importante para dizer que é um erro personalizado
                  context: { key: "email", label: "email" },
                }
            ], value);
        }
        return value;
      });
    try {
      const value = await schema.validateAsync(this);
      return { value };
    } catch (error) {
      return { error };
    }
  }
  async loginValidation()
  {
    const schema = joi.object({
      email: joi
          .string()
          .required()
          .messages({
            "string.empty": "O e-mail é obrigatório",
          }),
      password: joi.string().min(6).required().messages({
        "string.empty": "A senha é obrigatória",
        "string.min": "A senha deve ter pelo menos 6 caracteres",
      })
    })
    try {
      const value = await schema.validateAsync({email: this.email, password: this.password});
      return { value };
    } catch (error) {
      return { error };      
    }
  }
  async updateValidation(id)
  {
    const schema = joi.object({
      name: joi.string().min(3).max(30).required().messages({
        "string.min": "O nome deve ter pelo menos 3 caracteres",
        "string.max": "O nome deve ter menos de 30 caracteres",
        "string.empty": "O nome é obrigatório",
      }),
      email: joi
      .string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net', 'gov', 'br'] } })
      .required().messages({
        "string.empty": "O e-mail é obrigatório",
        "string.email": "Formato de e-mail inválido",
      }),
      password: joi.string().min(6),
      confirmpassword: joi
        .string()
        .valid(joi.ref("password"))
        .label("confirmpassword")
        .messages({
          "any.only": "As senhas não coincidem",
        }),
    }).external(async (value) => {
      // check if user exists
      const userExists = await User.findOne({ where: { email: this.email } });
      if (userExists && userExists.id !== Number(id)) {
          throw new joi.ValidationError("Validation error", [
              {
                message: "Email já está em uso",
                path: ["email"],
                type: "any.custom", //importante para dizer que é um erro personalizado
                context: { key: "email", label: "email" },
              }
          ], value);
      }
      return value;
    });
    try {
      const value = await schema.validateAsync(this);
      return { value };
    } catch (error)
    {
      return { error };
    }
  }
}
