import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Converte import.meta.url em __filename e __dirname corretos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (req.baseUrl.includes("users")) folder = "users";
    else if (req.baseUrl.includes("posts")) folder = "posts";
    else if (req.baseUrl.includes("courses")) folder = "courses";

    // Monta o caminho absoluto corretamente
    const folderPath = path.join(__dirname, "..", "public", "images", folder);
    console.log("→ Pasta de destino:", folderPath);

    // Garante que a pasta exista
    try {
      fs.mkdirSync(folderPath, { recursive: true });
    } catch (err) {
      console.error("Erro criando pasta:", err);
      return cb(err);
    }

    cb(null, folderPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + String(Math.floor(Math.random() * 1000));
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    console.log("→ Nome do arquivo gerado:", filename);
    cb(null, filename);
  },
});

const imageUploader = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please envie apenas arquivos png, jpg or jpeg"));
    }
    cb(null, true);
  },
});

export { imageUploader };