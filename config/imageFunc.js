const multer = require('multer')

let storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cd) => {
        cd(null, file.filename)
    }
})
let upload = multer({
    storage: storage
}).single('image')

let uploadImage = (req, res, fileName) => {
    let storage = multer.diskStorage({
        destination: "public/upload/image",
        filename: (req, file, cd) => {
            cd(null, file.originalname)
        }
    })
    let upload = multer({
        storage: storage
    }).single(fileName)
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err)
            }
            req.file.uploadFolder = '/upload/image/'
            resolve(req.file)
        })
    })
}

module.exports = uploadImage