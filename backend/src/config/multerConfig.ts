import multer from "multer";
import path from "path";

//Yükleme işleminin yapılacağı dizini ve dosya isimlerini belirleme:
const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "uploads/");//Dosyaların saklanacağı klasör
    },
    filename:(req, file, cb) =>{
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()* 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

//Dosya formatı filtresi (sadece resim dosyalarına izin var.):
const fileFilter = (req:Express.Request, file:Express.Multer.File, cb: multer.FileFilterCallback) =>{
    
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true);
    }else{
        cb(new Error("Sadece resimler kabul edilir."));
    }

};

const upload = multer({storage, fileFilter});

export default upload;