import multer from "multer";
import path from "path";

// iniciando um storage do multer
const videoStorage = multer.diskStorage({
  destination: { dest: path.join("./public/videos") },
  fileName: (req, file, cb) => {
    const uniqueSuffix = Date.now() + String(Math.floor(Math.random() * 1000));
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const videoUploader = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4)$/)) {
      return cb(new Error("Por favor, envie apenas arquivos mp4"));
    }
    cb(undefined, true);
  },
});

export { videoUploader };
