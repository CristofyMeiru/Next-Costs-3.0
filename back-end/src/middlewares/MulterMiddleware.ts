import multer from 'multer'
import fs from 'fs'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '/uploads')
        fs.mkdirSync(uploadPath, {recursive: true})
        cb(null, uploadPath)
    },
    filename: (req, file, cb)=> {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const upload = multer({storage: storage})

export default upload