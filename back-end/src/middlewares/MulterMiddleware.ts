import multer from 'multer'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads')
        fs.mkdirSync(uploadPath, {recursive: true})
        cb(null, uploadPath)
    }, 
    filename: (req, file, cb)=> {
        const username = req.headers['username']
        
        if(!username || username == "undefined"){
            const newError: any = new Error("Missing username.")
            newError.status = 400
            return cb(newError, '');
        }
        cb(null, username + ".jpeg")
    },
})

const upload = multer({storage: storage})

export default upload