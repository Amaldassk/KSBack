import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

function fileUpload(req, res, next){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const up_folder = path.join(__dirname, "../../assets/userFiles");

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if(!fs.existsSync(up_folder)){
                fs.mkdirSync(up_folder, {recursive: true});
            }
            cb(null, up_folder);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + "-" + uniqueSuffix + ext);
        },
    });

    const upload = multer({
        storage:storage,
        limits:{
            fileSize: 50 * 1024 * 1024, //50mb
        },
        fileFilter:(req, file, cb)=>{
            if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
                cb(null, true);
            } else {
                cb(null, false);
            }
        },
    });

    upload.single('productImage')(req, res, (err)=>{

        if(err){
            return res.status(500).json({
                success: false,
                message: "Error uploading file",
                error: err.message,
            });
        }

        if(!req.file || req.file.length === 0){
            return next();
        }

        const file = req.file;
        const fileUrl = `${req.protocol}://${req.get("host")}/assets/userFiles/${file.filename}`;

        req.file = file;
        req.fileUrl = fileUrl;
        req.fileType = file.mimetype.split("/")[0];
        next();
    })
}

export default fileUpload;