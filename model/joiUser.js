const joi = require('joi')

let UserValidate = (param) => {
    const schema = joi.object(
        {
            email: joi.string().email().min(3).trim().required(),
            password: joi.string().min(1).trim().required(),
            username: joi.string().min(3).trim().required(),
            contact: joi.number().min(1).required(),
            address: joi.string().min(5).trim().required()
        }
    )
    let { error } = schema.validate(param, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}
//  Testing Complete
// let data = { Username: "Alam", Email: "swd@gmail.com", Password: "1", Contact: 525545, Address: "wfwfwwrfbig rgeuiggiwn" }
// console.log(UserValidate(data))

module.exports = {
    UserValidate
}