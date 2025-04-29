import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        let folder = "";  // local
        if (req.baseUrl.includes('users')) folder = 'users';
        else if (req.baseUrl.includes('posts')) folder = 'posts';
        
        cb(null, `./public/images/${folder}`);
    },
    
    filename: function (req, file, cb)
    {
        const uniqueSuffix = Date.now() + String(Math.floor(Math.random() * 1000));
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const imageUploader = multer({
    storage: imageStorage,
    fileFilter(req, file, cb)
    {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/))
        {
            return cb(new Error('Please upload only png, jpg or jpeg'));
        }
        cb(undefined, true);
    }
})

export {imageUploader};